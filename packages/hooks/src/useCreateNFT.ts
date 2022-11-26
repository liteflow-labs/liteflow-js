import { Signer, TypedDataSigner } from '@ethersproject/abstract-signer'
import { gql } from 'graphql-request'
import { useCallback, useContext, useState } from 'react'
import invariant from 'ts-invariant'
import { LiteflowContext } from './context'
import { ErrorMessages } from './errorMessages'
import { Standard } from './graphql'
import useCheckOwnership from './useCheckOwnership'
import useConfig from './useConfig'
import useIPFSUploader from './useIPFSUploader'
import { convertTx } from './utils/transaction'

gql`
  mutation CreateAsset(
    $input: AssetInputBis!
    $creatorAddress: Address!
    $amount: Uint256!
    $royalties: Int
  ) {
    createAsset(input: { asset: $input }) {
      asset {
        id
        token {
          __typename
          ... on ERC721 {
            mint(owner: $creatorAddress, royalties: $royalties) {
              ...Transaction
            }
          }
          ... on ERC1155 {
            mint(
              owner: $creatorAddress
              amount: $amount
              royalties: $royalties
            ) {
              ...Transaction
            }
          }
        }
      }
    }
  }
`

gql`
  mutation CreateLazyMintedAssetSignature(
    $asset: LazyMintedAssetSignatureInput!
  ) {
    createLazyMintedAssetSignature(input: { asset: $asset }) {
      eip712Data
    }
  }
`

gql`
  mutation CreateLazyMintedAsset(
    $asset: LazyMintedAssetInput!
    $signature: String!
  ) {
    createLazyMintedAsset(input: { asset: $asset, signature: $signature }) {
      asset {
        id
      }
    }
  }
`

export enum CreateNftStep {
  INITIAL,
  UPLOAD,
  TRANSACTION_SIGNATURE,
  TRANSACTION_PENDING,
  OWNERSHIP,
  LAZYMINT_SIGNATURE,
  LAZYMINT_PENDING,
}

type createNftFn = (data: {
  standard: Standard
  name: string
  description: string
  content: File
  preview?: File
  isAnimation: boolean
  isPrivate: boolean
  amount?: number
  royalties?: number
  traits?: { type: string; value: string }[]
}) => Promise<string>

export default function useCreateNFT(
  signer: (Signer & TypedDataSigner) | undefined,
  { uploadUrl }: { uploadUrl: string },
): [
  createNftFn,
  {
    activeStep: CreateNftStep
    transactionHash: string | undefined
  },
] {
  const { sdk } = useContext(LiteflowContext)
  const config = useConfig()
  const [transactionHash, setTransactionHash] = useState<string>()
  const [activeStep, setActiveProcess] = useState<CreateNftStep>(
    CreateNftStep.INITIAL,
  )
  const [uploadFile] = useIPFSUploader(uploadUrl)
  const [{ pollOwnership }] = useCheckOwnership()

  const uploadMedia = useCallback(
    async ({
      content,
      preview,
      isAnimation,
      isPrivate,
    }: {
      content: File
      preview?: File
      isAnimation: boolean
      isPrivate: boolean
    }): Promise<{
      image: string
      animationUrl: string | null
      unlockableContent: string | null
    }> => {
      if (isPrivate) {
        invariant(preview, ErrorMessages.MINT_UNLOCKABLE_CONTENT_PREVIEW)
        const [previewIpfs, privateContentIpfs] = await Promise.all([
          uploadFile(preview),
          uploadFile(content, { protected: true }),
        ])
        return {
          image: `ipfs://${previewIpfs}`,
          animationUrl: null,
          unlockableContent: `ipfs://${privateContentIpfs}`,
        }
      }
      if (isAnimation) {
        invariant(preview, ErrorMessages.MINT_ANIMATION_PREVIEW)
        const [previewIpfs, contentIpfs] = await Promise.all([
          uploadFile(preview),
          uploadFile(content),
        ])
        return {
          image: `ipfs://${previewIpfs}`,
          animationUrl: `ipfs://${contentIpfs}`,
          unlockableContent: null,
        }
      }
      return {
        image: `ipfs://${await uploadFile(content)}`,
        animationUrl: null,
        unlockableContent: null,
      }
    },
    [uploadFile],
  )

  const createNft: createNftFn = useCallback(
    async ({
      name,
      description,
      content,
      preview,
      isAnimation,
      isPrivate,
      standard,
      amount,
      royalties,
      traits,
    }) => {
      invariant(
        !isPrivate || (isPrivate && (await config).hasUnlockableContent),
        ErrorMessages.FEATURE_DISABLED_UNLOCKABLE_CONTENT,
      )
      invariant(signer, ErrorMessages.SIGNER_FALSY)
      const account = await signer.getAddress()

      setActiveProcess(CreateNftStep.UPLOAD)
      try {
        const media = await uploadMedia({
          content,
          preview,
          isAnimation,
          isPrivate,
        })

        // lazy minting
        if ((await config).hasLazyMint) {
          const assetToCreate = {
            standard,
            creatorAddress: account.toLowerCase(),
            description,
            name,
            traits: traits || null,
            ...media,
            supply: amount ? amount.toString() : '1',
            royalties: royalties ? Math.round(royalties * 100) : null,
          }

          const { createLazyMintedAssetSignature } =
            await sdk.CreateLazyMintedAssetSignature({
              asset: assetToCreate,
            })

          invariant(
            createLazyMintedAssetSignature?.eip712Data,
            ErrorMessages.MINT_SIGNATURE_GENERATION,
          )

          // sign data
          setActiveProcess(CreateNftStep.LAZYMINT_SIGNATURE)
          const eip712Data = createLazyMintedAssetSignature.eip712Data
          const { domain, types, message /*, primaryType */ } = eip712Data
          delete types.EIP712Domain // Hack: remove primary type from types to allow ethers detect the main type "Order" (aka: primaryType)
          const signature = await signer._signTypedData(domain, types, message)

          // send signature to api
          setActiveProcess(CreateNftStep.LAZYMINT_PENDING)
          const { createLazyMintedAsset } = await sdk.CreateLazyMintedAsset({
            signature,
            asset: {
              tokenId: message.tokenId,
              ...assetToCreate,
            },
          })
          invariant(
            createLazyMintedAsset?.asset,
            ErrorMessages.ASSET_LAZY_MINT_CREATION_FAILED,
          )
          return createLazyMintedAsset.asset.id
        }

        const { createAsset } = await sdk.CreateAsset({
          input: {
            standard,
            creatorAddress: account.toLowerCase(),
            description,
            name,
            traits: traits || null,
            ...media,
          },
          creatorAddress: account.toLowerCase(),
          amount: amount ? amount.toString() : '1',
          royalties: royalties ? Math.round(royalties * 100) : 0,
        })
        const asset = createAsset?.asset
        invariant(asset, ErrorMessages.ASSET_CREATION_FAILED)
        invariant(
          asset.token.__typename === 'ERC721' ||
            asset.token.__typename === 'ERC1155',
          ErrorMessages.ASSET_INVALID_STANDARD,
        )
        invariant(asset.token.mint, ErrorMessages.ASSET_NO_MINT)

        setActiveProcess(CreateNftStep.TRANSACTION_SIGNATURE)
        const tx = await signer.sendTransaction(convertTx(asset.token.mint))
        setTransactionHash(tx.hash)
        setActiveProcess(CreateNftStep.TRANSACTION_PENDING)
        // waiting for transaction to be mined
        console.info(`waiting for transaction with hash ${tx.hash}...`)
        await tx.wait()
        console.info(`transaction validated`)

        setActiveProcess(CreateNftStep.OWNERSHIP)
        // poll the api until the ownership is updated
        console.info('polling api to check ownership...')
        await pollOwnership({
          assetId: asset.id,
          ownerAddress: account.toLowerCase(),
          initialQuantity: '0',
        })
        console.info('polling done')

        return asset.id
      } finally {
        setActiveProcess(CreateNftStep.INITIAL)
        setTransactionHash(undefined)
      }
    },
    [sdk, signer, pollOwnership, uploadMedia, config],
  )

  return [createNft, { activeStep, transactionHash }]
}

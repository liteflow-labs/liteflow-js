import { Signer, TypedDataSigner } from '@ethersproject/abstract-signer'
import { gql } from 'graphql-request'
import { useCallback, useContext, useState } from 'react'
import invariant from 'ts-invariant'
import { LiteflowContext } from './context'
import { ErrorMessages } from './errorMessages'
import { LazyMintedAssetSignatureInput } from './graphql'
import useCheckOwnership from './useCheckOwnership'
import useConfig from './useConfig'
import useIPFSUploader from './useIPFSUploader'
import { convertTx } from './utils/transaction'

gql`
  mutation CreateAssetTransaction(
    $chainId: Int!
    $collectionAddress: Address!
    $metadata: MetadataInput!
    $creatorAddress: Address!
    $royalties: Int
    $supply: Uint256!
  ) {
    createAssetTransaction(
      chainId: $chainId
      collectionAddress: $collectionAddress
      creatorAddress: $creatorAddress
      metadata: $metadata
      royalties: $royalties
      supply: $supply
    ) {
      assetId
      transaction {
        ...Transaction
      }
    }
  }
`

gql`
  mutation CreateLazyMintedAssetSignature(
    $chainId: Int!
    $collectionAddress: Address!
    $asset: LazyMintedAssetSignatureInput!
  ) {
    createLazyMintedAssetSignature(
      input: {
        chainId: $chainId
        collectionAddress: $collectionAddress
        asset: $asset
      }
    ) {
      eip712Data
    }
  }
`

gql`
  mutation CreateLazyMintedAsset(
    $chainId: Int!
    $collectionAddress: Address!
    $asset: LazyMintedAssetInput!
    $signature: String!
  ) {
    createLazyMintedAsset(
      input: {
        chainId: $chainId
        collectionAddress: $collectionAddress
        asset: $asset
        signature: $signature
      }
    ) {
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
  chainId: number
  collectionAddress: string
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
  const getConfig = useConfig()
  const [transactionHash, setTransactionHash] = useState<string>()
  const [activeStep, setActiveProcess] = useState<CreateNftStep>(
    CreateNftStep.INITIAL,
  )
  const [uploadFile] = useIPFSUploader(uploadUrl)
  const { pollOwnership } = useCheckOwnership()

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
      chainId,
      collectionAddress,
      name,
      description,
      content,
      preview,
      isAnimation,
      isPrivate,
      amount,
      royalties,
      traits,
    }) => {
      const { hasLazyMint, hasUnlockableContent } = await getConfig()
      invariant(
        !isPrivate || (isPrivate && hasUnlockableContent),
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
        const assetToCreate = {
          creatorAddress: account.toLowerCase(),
          royalties: royalties ? Math.round(royalties * 100) : null,
          supply: amount ? amount.toString() : '1',
          metadata: {
            name,
            image: media.image,
            description,
            animationUrl: media.animationUrl,
            unlockableContent: media.unlockableContent,
            attributes: (traits || []).map((x) => ({
              traitType: x.type,
              value: x.value,
            })),
          },
        }

        // lazy minting
        if (hasLazyMint) {
          const { createLazyMintedAssetSignature } =
            await sdk.CreateLazyMintedAssetSignature({
              chainId: chainId,
              collectionAddress: collectionAddress,
              asset: assetToCreate as LazyMintedAssetSignatureInput, // TODO: remove this cast when attributes from the API are removed
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
            chainId: chainId,
            collectionAddress: collectionAddress,
            signature,
            asset: {
              tokenId: message.tokenId,
              ...(assetToCreate as LazyMintedAssetSignatureInput), // TODO: remove this cast when attributes from the API are removed
            },
          })
          invariant(
            createLazyMintedAsset?.asset,
            ErrorMessages.ASSET_LAZY_MINT_CREATION_FAILED,
          )
          return createLazyMintedAsset.asset.id
        }

        const { createAssetTransaction } = await sdk.CreateAssetTransaction({
          chainId: chainId,
          collectionAddress: collectionAddress,
          ...assetToCreate,
        })
        invariant(
          createAssetTransaction,
          ErrorMessages.ASSET_TRANSACTION_CREATION_FAILED,
        )

        setActiveProcess(CreateNftStep.TRANSACTION_SIGNATURE)
        const tx = await signer.sendTransaction(
          convertTx(createAssetTransaction.transaction),
        )
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
          assetId: createAssetTransaction.assetId,
          ownerAddress: account.toLowerCase(),
          initialQuantity: '0',
        })
        console.info('polling done')

        return createAssetTransaction.assetId
      } finally {
        setActiveProcess(CreateNftStep.INITIAL)
        setTransactionHash(undefined)
      }
    },
    [sdk, signer, pollOwnership, uploadMedia, getConfig],
  )

  return [createNft, { activeStep, transactionHash }]
}

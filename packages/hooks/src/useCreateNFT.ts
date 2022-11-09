import { Signer, TypedDataSigner } from '@ethersproject/abstract-signer'
import { gql } from 'graphql-request'
import { useCallback, useContext, useState } from 'react'
import invariant from 'ts-invariant'
import { LiteflowContext } from './context'
import { ErrorMessages } from './errorMessages'
import useCheckOwnership from './useCheckOwnership'
import useIPFSUploader from './useIPFSUploader'
import { convertTx } from './utils/transaction'

gql`
  mutation CreateAssetTransaction(
    $chainId: Int!
    $collection: Address!
    $metadata: Metadata!
    $creator: Address!
    $royalties: Int
    $supply: Uint256!
  ) {
    createAssetTransaction(
      chainId: $chainId
      collection: $collection
      metadata: $metadata
      creator: $creator
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
    $collection: Address!
    $asset: LazyMintedAssetSignatureInput!
  ) {
    createLazyMintedAssetSignature(
      chainId: $chainId
      collection: $collection
      asset: $asset
    ) {
      eip712Data
    }
  }
`

gql`
  mutation CreateLazyMintedAsset(
    $chainId: Int!
    $collection: Address!
    $asset: LazyMintedAssetInput!
    $signature: String!
  ) {
    createLazyMintedAsset(
      chainId: $chainId
      collection: $collection
      asset: $asset
      signature: $signature
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
  collection: string
  name: string
  description: string
  content: File
  preview?: File
  isAnimation: boolean
  isPrivate: boolean
  amount?: number
  royalties?: number
  traits?: { type: string; value: string }[]
  isLazyMint?: boolean
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
      collection,
      amount,
      royalties,
      traits,
      isLazyMint,
    }) => {
      invariant(signer, ErrorMessages.SIGNER_FALSY)
      invariant(signer.provider, ErrorMessages.SIGNER_NO_PROVIDER)
      const account = await signer.getAddress()
      const chainId = (await signer.provider.getNetwork()).chainId

      setActiveProcess(CreateNftStep.UPLOAD)
      try {
        const media = await uploadMedia({
          content,
          preview,
          isAnimation,
          isPrivate,
        })
        const metadata = {
          name,
          image: media.image,
          description,
          animationUrl: media.animationUrl,
          unlockableContent: media.unlockableContent,
          attributes: (traits || []).map((x) => ({
            traitType: x.type,
            value: x.value,
          })),
        }

        // lazy minting
        if (isLazyMint) {
          const assetToCreate = {
            creator: account.toLowerCase(),
            royalties: royalties ? Math.round(royalties * 100) : null,
            supply: amount ? amount.toString() : '1',
            metadata: metadata,
          }

          const { createLazyMintedAssetSignature } =
            await sdk.CreateLazyMintedAssetSignature({
              chainId: chainId,
              collection: collection,
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
            chainId: chainId,
            collection: collection,
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

        const { createAssetTransaction } = await sdk.CreateAssetTransaction({
          chainId: chainId,
          collection: collection,
          creator: account.toLowerCase(),
          metadata: metadata,
          supply: amount ? amount.toString() : '1',
          royalties: royalties ? Math.round(royalties * 100) : 0,
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
    [sdk, signer, pollOwnership, uploadMedia],
  )

  return [createNft, { activeStep, transactionHash }]
}

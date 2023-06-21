import { Signer, TypedDataSigner } from '@ethersproject/abstract-signer'
import { toAddress, toAssetId } from '@liteflow/core'
import { useCallback, useContext, useState } from 'react'
import invariant from 'ts-invariant'
import { LiteflowContext } from './context'
import { ErrorMessages } from './errorMessages'

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
  {}: {
    /** @deprecated uploadUrl is not required anymore */
    uploadUrl: string
  },
): [
  createNftFn,
  {
    activeStep: CreateNftStep
    transactionHash: string | undefined
  },
] {
  const { sdk, client } = useContext(LiteflowContext)
  const [transactionHash, setTransactionHash] = useState<string>()
  const [activeStep, setActiveProcess] = useState<CreateNftStep>(
    CreateNftStep.INITIAL,
  )

  const detectMedia = useCallback(
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
      image: File
      animationUrl?: File
      unlockableContent?: File
    }> => {
      if (isPrivate) {
        invariant(preview, ErrorMessages.MINT_UNLOCKABLE_CONTENT_PREVIEW)
        return { image: preview, unlockableContent: content }
      }
      if (isAnimation) {
        invariant(preview, ErrorMessages.MINT_ANIMATION_PREVIEW)
        return { image: preview, animationUrl: content }
      }
      return { image: content }
    },
    [],
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
      const {
        config: { hasLazyMint },
      } = await sdk.GetConfig()
      invariant(signer, ErrorMessages.SIGNER_FALSY)

      try {
        const media = await detectMedia({
          content,
          preview,
          isAnimation,
          isPrivate,
        })
        const assetToCreate = {
          chain: chainId,
          collection: toAddress(collectionAddress),
          royalties: royalties,
          supply: amount,
          metadata: {
            name,
            description,
            image: media.image,
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
          const { chain, collection, token } = await client.asset.lazymint(
            assetToCreate,
            signer,
            (state) => {
              switch (state.type) {
                case 'UPLOAD':
                  return setActiveProcess(CreateNftStep.UPLOAD)
                case 'LAZYMINT_SIGNATURE':
                  return setActiveProcess(CreateNftStep.LAZYMINT_SIGNATURE)
                case 'LAZYMINT_PENDING':
                  return setActiveProcess(CreateNftStep.LAZYMINT_PENDING)
                case 'OWNERSHIP':
                  return setActiveProcess(CreateNftStep.OWNERSHIP)
              }
            },
          )
          return toAssetId(chain, collection, token)
        }

        const { chain, collection, token } = await client.asset.mint(
          assetToCreate,
          signer,
          (state) => {
            switch (state.type) {
              case 'UPLOAD':
                return setActiveProcess(CreateNftStep.UPLOAD)
              case 'TRANSACTION_SIGNATURE':
                return setActiveProcess(CreateNftStep.TRANSACTION_SIGNATURE)
              case 'TRANSACTION_PENDING': {
                setTransactionHash(state.payload.txHash)
                return setActiveProcess(CreateNftStep.TRANSACTION_PENDING)
              }
              case 'OWNERSHIP':
                return setActiveProcess(CreateNftStep.OWNERSHIP)
            }
          },
        )

        return toAssetId(chain, collection, token)
      } finally {
        setActiveProcess(CreateNftStep.INITIAL)
        setTransactionHash(undefined)
      }
    },
    [client.asset, sdk, signer, detectMedia],
  )

  return [createNft, { activeStep, transactionHash }]
}

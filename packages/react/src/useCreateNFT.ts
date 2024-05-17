import {
  Address,
  ChainId,
  Signer,
  TransactionHash,
  toAssetId,
} from '@liteflow/core'
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

type createNftFn = (
  data: {
    chain: ChainId
    collection: Address
    supply?: number
    royalties?: number
    metadata: {
      name: string
      description: string
      attributes?: { traitType: string; value: string }[]
      media: {
        content: File
        preview?: File
        isAnimation: boolean
      }
    }
  },
  lazymint: boolean,
) => Promise<string>

export default function useCreateNFT(signer: Signer | undefined): [
  createNftFn,
  {
    activeStep: CreateNftStep
    transactionHash: TransactionHash | undefined
  },
] {
  const { client } = useContext(LiteflowContext)
  const [transactionHash, setTransactionHash] = useState<TransactionHash>()
  const [activeStep, setActiveProcess] = useState<CreateNftStep>(
    CreateNftStep.INITIAL,
  )

  const detectMedia = useCallback(
    async ({
      content,
      preview,
      isAnimation,
    }: {
      content: File
      preview?: File
      isAnimation: boolean
    }): Promise<{
      image: File
      animationUrl?: File
    }> => {
      if (isAnimation) {
        invariant(preview, ErrorMessages.MINT_ANIMATION_PREVIEW)
        return { image: preview, animationUrl: content }
      }
      return { image: content }
    },
    [],
  )

  const createNft: createNftFn = useCallback(
    async (
      { chain, collection, metadata, supply, royalties },
      lazymint = false,
    ) => {
      invariant(signer, ErrorMessages.SIGNER_FALSY)

      const { media, ...restMetadata } = metadata

      try {
        const assetToCreate = {
          chain,
          collection,
          royalties,
          supply,
          metadata: {
            ...restMetadata,
            ...(await detectMedia(media)),
          },
        }

        // lazy minting
        if (lazymint) {
          const asset = await client.asset.lazymint(
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
          return toAssetId(asset.chain, asset.collection, asset.token)
        }

        const asset = await client.asset.mint(
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

        return toAssetId(asset.chain, asset.collection, asset.token)
      } finally {
        setActiveProcess(CreateNftStep.INITIAL)
        setTransactionHash(undefined)
      }
    },
    [client.asset, signer, detectMedia],
  )

  return [createNft, { activeStep, transactionHash }]
}

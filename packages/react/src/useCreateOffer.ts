import { Signer, TypedDataSigner } from '@ethersproject/abstract-signer'
import { BigNumber } from '@ethersproject/bignumber'
import {
  Address,
  ChainId,
  PriceERC20,
  PriceNative,
  TransactionHash,
} from '@liteflow/core'
import { useCallback, useContext, useState } from 'react'
import invariant from 'ts-invariant'
import { LiteflowContext } from './context'
import { ErrorMessages } from './errorMessages'
import { OfferType } from './graphql'

export enum CreateOfferStep {
  INITIAL,
  APPROVAL_SIGNATURE,
  APPROVAL_PENDING,
  SIGNATURE,
}

export default function useCreateOffer(
  signer: (Signer & TypedDataSigner) | undefined,
): [
  (data: {
    type: OfferType
    chain: ChainId
    collection: Address
    token: string
    quantity: BigNumber
    unitPrice: PriceNative | PriceERC20
    taker?: Address
    expiredAt?: Date
    auctionId?: UUID
    metadata?: Record<string, unknown>
  }) => Promise<string>,
  {
    activeStep: CreateOfferStep
    transactionHash: TransactionHash | undefined
  },
] {
  const { client } = useContext(LiteflowContext)
  const [activeStep, setActiveProcess] = useState<CreateOfferStep>(
    CreateOfferStep.INITIAL,
  )
  const [transactionHash, setTransactionHash] = useState<TransactionHash>()

  const updateProgress = useCallback(
    ({ type, payload }) => {
      if (type === 'APPROVAL_SIGNATURE')
        setActiveProcess(CreateOfferStep.APPROVAL_SIGNATURE)
      if (type === 'APPROVAL_PENDING') {
        setActiveProcess(CreateOfferStep.APPROVAL_PENDING)
        setTransactionHash(payload.txHash)
      }
      if (type === 'OFFER_SIGNATURE')
        setActiveProcess(CreateOfferStep.SIGNATURE)
    },
    [setActiveProcess, setTransactionHash],
  )

  const createOffer = useCallback(
    async ({
      type,
      chain,
      collection,
      token,
      quantity,
      unitPrice,
      expiredAt,
      taker,
      auctionId,
      metadata,
    }: {
      type: OfferType
      chain: ChainId
      collection: Address
      token: string
      quantity: BigNumber
      unitPrice: PriceNative | PriceERC20
      taker?: Address
      expiredAt?: Date
      auctionId?: UUID
      metadata?: Record<string, unknown>
    }): Promise<string> => {
      setActiveProcess(CreateOfferStep.INITIAL)
      try {
        invariant(signer, ErrorMessages.SIGNER_FALSY)

        if (type === 'SALE') {
          const listingId = await client.exchange.listToken(
            {
              chain,
              collection,
              token,
              quantity,
              taker,
              expiredAt,
              unitPrice,
              metadata,
            },
            signer,
            updateProgress,
          )
          return listingId
        }
        if (type === 'BUY') {
          invariant(unitPrice.currency)
          const bidId = await client.exchange.placeBid(
            {
              chain,
              collection,
              token,
              quantity,
              taker,
              expiredAt,
              unitPrice,
              auctionId,
              metadata,
            },
            signer,
            updateProgress,
          )
          return bidId
        }

        throw new Error(ErrorMessages.OFFER_CREATION_FAILED)
      } finally {
        setActiveProcess(CreateOfferStep.INITIAL)
      }
    },
    [signer, client, setActiveProcess, updateProgress],
  )

  return [createOffer, { activeStep, transactionHash }]
}

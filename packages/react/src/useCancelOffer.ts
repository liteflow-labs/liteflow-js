import { Signer } from '@ethersproject/abstract-signer'
import { TransactionHash } from '@liteflow/core'
import { useCallback, useContext, useState } from 'react'
import invariant from 'ts-invariant'
import { LiteflowContext } from './context'
import { ErrorMessages } from './errorMessages'

export enum CancelOfferStep {
  INITIAL,
  TRANSACTION_SIGNATURE,
  TRANSACTION_PENDING,
}

type CancelOfferFn = (offerId: UUID) => Promise<void>

export default function useCancelOffer(signer: Signer | undefined): [
  CancelOfferFn,
  {
    activeStep: CancelOfferStep
    transactionHash: TransactionHash | undefined
  },
] {
  const { client } = useContext(LiteflowContext)
  const [transactionHash, setTransactionHash] = useState<TransactionHash>()
  const [activeStep, setActiveProcess] = useState<CancelOfferStep>(
    CancelOfferStep.INITIAL,
  )

  // Create a callback for the onProgress event
  const onProgress = useCallback(
    (state) => {
      switch (state.type) {
        case 'TRANSACTION_SIGNATURE':
          setActiveProcess(CancelOfferStep.TRANSACTION_SIGNATURE)
          break
        case 'TRANSACTION_PENDING':
          setActiveProcess(CancelOfferStep.TRANSACTION_PENDING)
          setTransactionHash(state.payload.txHash)
          break
      }
    },
    [setActiveProcess, setTransactionHash],
  )

  const cancelOffer: CancelOfferFn = useCallback(
    async (id) => {
      invariant(signer, ErrorMessages.SIGNER_FALSY)
      const offer = await client.exchange.getOffer(id)
      invariant(offer)
      if (offer.type === 'SALE') {
        await client.exchange.cancelListing(id, signer, onProgress)
      } else {
        await client.exchange.cancelBid(id, signer, onProgress)
      }
    },
    [client, signer, onProgress],
  )

  return [cancelOffer, { activeStep, transactionHash }]
}

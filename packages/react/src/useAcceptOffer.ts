import { Signer } from '@ethersproject/abstract-signer'
import { BigNumberish } from '@ethersproject/bignumber'
import { TransactionHash, UUID } from '@liteflow/core'
import { useCallback, useContext, useState } from 'react'
import invariant from 'ts-invariant'
import { LiteflowContext } from './context'
import { ErrorMessages } from './errorMessages'

export enum AcceptOfferStep {
  INITIAL,
  APPROVAL_SIGNATURE,
  APPROVAL_PENDING,
  TRANSACTION_SIGNATURE,
  TRANSACTION_PENDING,
  OWNERSHIP,
}

type acceptOfferFn = (offerId: UUID, quantity: BigNumberish) => Promise<void>

export default function useAcceptOffer(signer: Signer | undefined): [
  acceptOfferFn,
  {
    activeStep: AcceptOfferStep
    transactionHash: TransactionHash | undefined
  },
] {
  const { client } = useContext(LiteflowContext)
  const [activeStep, setActiveProcess] = useState<AcceptOfferStep>(
    AcceptOfferStep.INITIAL,
  )
  const [transactionHash, setTransactionHash] = useState<TransactionHash>()

  const onProgress = useCallback(
    (state) => {
      switch (state.type) {
        case 'APPROVAL_SIGNATURE': {
          setActiveProcess(AcceptOfferStep.APPROVAL_SIGNATURE)
          break
        }
        case 'APPROVAL_PENDING': {
          setActiveProcess(AcceptOfferStep.APPROVAL_PENDING)
          setTransactionHash(state.payload.txHash)
          break
        }
        case 'TRANSACTION_SIGNATURE': {
          setActiveProcess(AcceptOfferStep.TRANSACTION_SIGNATURE)
          break
        }
        case 'TRANSACTION_PENDING': {
          setActiveProcess(AcceptOfferStep.TRANSACTION_PENDING)
          setTransactionHash(state.payload.txHash)
          break
        }
        case 'OWNERSHIP': {
          setActiveProcess(AcceptOfferStep.OWNERSHIP)
          break
        }
        case 'OFFER_VALIDITY': {
          console.log('validating offer...')
        }
      }
    },
    [setActiveProcess, setTransactionHash],
  )

  const acceptOffer: acceptOfferFn = useCallback(
    async (id, quantity) => {
      invariant(signer, ErrorMessages.SIGNER_FALSY)
      const offer = await client.exchange.getOffer(id)
      invariant(offer)

      try {
        if (offer.type === 'SALE') {
          await client.exchange.buyToken(id, quantity, signer, onProgress)
        } else {
          await client.exchange.acceptBid(id, quantity, signer, onProgress)
        }
      } finally {
        setActiveProcess(AcceptOfferStep.INITIAL)
        setTransactionHash(undefined)
      }
    },
    [client, signer, onProgress],
  )

  return [acceptOffer, { activeStep, transactionHash }]
}

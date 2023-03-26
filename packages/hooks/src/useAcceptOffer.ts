import { Signer } from '@ethersproject/abstract-signer'
import { BigNumberish } from '@ethersproject/bignumber'
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

type acceptOfferFn = (
  offer: {
    id: string
    /** @deprecated `unitPrice` is not needed anymore */
    unitPrice?: BigNumberish
  },
  quantity: BigNumberish,
) => Promise<void>

export default function useAcceptOffer(signer: Signer | undefined): [
  acceptOfferFn,
  {
    activeStep: AcceptOfferStep
    transactionHash: string | undefined
  },
] {
  const { client } = useContext(LiteflowContext)
  const [activeStep, setActiveProcess] = useState<AcceptOfferStep>(
    AcceptOfferStep.INITIAL,
  )
  const [transactionHash, setTransactionHash] = useState<string>()

  const acceptOffer: acceptOfferFn = useCallback(
    async ({ id }, quantity) => {
      invariant(signer, ErrorMessages.SIGNER_FALSY)

      try {
        await client.exchange.acceptOffer(id, quantity, signer, (state) => {
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
              setActiveProcess(AcceptOfferStep.TRANSACTION_PENDING)
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
        })
      } finally {
        setActiveProcess(AcceptOfferStep.INITIAL)
        setTransactionHash(undefined)
      }
    },
    [signer, client.exchange],
  )

  return [acceptOffer, { activeStep, transactionHash }]
}

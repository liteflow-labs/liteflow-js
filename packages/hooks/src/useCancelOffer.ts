import { Signer } from '@ethersproject/abstract-signer'
import { useCallback, useContext, useState } from 'react'
import invariant from 'ts-invariant'
import { LiteflowContext } from './context'
import { ErrorMessages } from './errorMessages'
import { Offer } from './graphql'

export enum CancelOfferStep {
  INITIAL,
  TRANSACTION_SIGNATURE,
  TRANSACTION_PENDING,
}

type CancelOfferFn = (offerId: Pick<Offer, 'id'>) => Promise<void>

export default function useCancelOffer(signer: Signer | undefined): [
  CancelOfferFn,
  {
    activeStep: CancelOfferStep
    transactionHash: string | undefined
  },
] {
  const { client } = useContext(LiteflowContext)
  const [transactionHash, setTransactionHash] = useState<string>()
  const [activeStep, setActiveProcess] = useState<CancelOfferStep>(
    CancelOfferStep.INITIAL,
  )

  const cancelOffer: CancelOfferFn = useCallback(
    async ({ id }) => {
      invariant(signer, ErrorMessages.SIGNER_FALSY)
      await client.exchange.cancelOffer(id, signer, (state) => {
        switch (state.type) {
          case 'TRANSACTION_SIGNATURE':
            setActiveProcess(CancelOfferStep.TRANSACTION_SIGNATURE)
            break
          case 'TRANSACTION_PENDING':
            setActiveProcess(CancelOfferStep.TRANSACTION_PENDING)
            setTransactionHash(state.payload.txHash)
            break
        }
      })
    },
    [client.exchange, signer],
  )

  return [cancelOffer, { activeStep, transactionHash }]
}

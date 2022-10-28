import { Signer } from '@ethersproject/abstract-signer'
import { gql } from 'graphql-request'
import { useCallback, useContext, useState } from 'react'
import invariant from 'ts-invariant'
import { LiteflowContext } from './context'
import { ErrorCodes } from './error'
import { Offer } from './graphql'
import { convertTx } from './utils/transaction'

gql`
  mutation DeleteOffer($id: UUID!) {
    deleteOffer(input: { id: $id }) {
      offer {
        id
      }
    }
  }
`

gql`
  query OfferWithCancel($offerId: UUID!, $taker: Address!) {
    offer(id: $offerId) {
      cancel(account: $taker) {
        ...Transaction
      }
    }
  }
`

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
  const { sdk } = useContext(LiteflowContext)
  const [transactionHash, setTransactionHash] = useState<string>()
  const [activeStep, setActiveProcess] = useState<CancelOfferStep>(
    CancelOfferStep.INITIAL,
  )

  const cancelOffer: CancelOfferFn = useCallback(
    async ({ id }) => {
      invariant(signer, ErrorCodes.SIGNER_FALSY)
      const account = await signer.getAddress()

      try {
        // fetch cancel tx from api
        const { offer } = await sdk.OfferWithCancel({
          offerId: id,
          taker: account.toLowerCase(),
        })
        invariant(offer, ErrorCodes.OFFER_NOT_FOUND)

        setActiveProcess(CancelOfferStep.TRANSACTION_SIGNATURE)
        // sign and broadcast the transaction
        const tx = await signer.sendTransaction(convertTx(offer.cancel))
        setActiveProcess(CancelOfferStep.TRANSACTION_PENDING)
        setTransactionHash(tx.hash)
        console.info(`waiting for transaction with hash ${tx.hash}...`)
        await tx.wait()
        console.info(`transaction validated`)

        // set the offer as cancelled on the api
        await sdk.DeleteOffer({ id })
      } finally {
        setActiveProcess(CancelOfferStep.INITIAL)
        setTransactionHash(undefined)
      }
    },
    [sdk, signer],
  )

  return [cancelOffer, { activeStep, transactionHash }]
}

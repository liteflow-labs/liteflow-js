import { Signer } from '@ethersproject/abstract-signer'
import { gql } from 'graphql-request'
import { useCallback, useContext, useState } from 'react'
import { LiteflowContext } from './context'
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
    async (offer) => {
      if (!signer) throw new Error('signer falsy')
      const account = await signer.getAddress()

      try {
        // fetch cancel tx from api
        const offerWithCancel = await sdk.OfferWithCancel({
          offerId: offer.id,
          taker: account.toLowerCase(),
        })
        if (!offerWithCancel)
          throw new Error('unknown error when fetching offer with cancel')

        if (!offerWithCancel.offer)
          throw new Error(`offer ${offer.id} doesn't exists`)

        setActiveProcess(CancelOfferStep.TRANSACTION_SIGNATURE)
        // sign and broadcast the transaction
        const tx = await signer.sendTransaction(
          convertTx(offerWithCancel.offer.cancel),
        )
        setActiveProcess(CancelOfferStep.TRANSACTION_PENDING)
        setTransactionHash(tx.hash)
        console.info(`waiting for transaction with hash ${tx.hash}...`)
        await tx.wait()
        console.info(`transaction validated`)

        // set the offer as cancelled on the api
        await sdk.DeleteOffer({ id: offer.id })
      } finally {
        setActiveProcess(CancelOfferStep.INITIAL)
        setTransactionHash(undefined)
      }
    },
    [sdk, signer],
  )

  return [cancelOffer, { activeStep, transactionHash }]
}

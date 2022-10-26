import { Signer } from '@ethersproject/abstract-signer'
import { BigNumber } from '@ethersproject/bignumber'
import { gql } from 'graphql-request'
import { useCallback, useContext, useEffect, useState } from 'react'
import { LiteflowContext } from './context'
import useAcceptOffer, { AcceptOfferStep } from './useAcceptOffer'

gql`
  query FetchAuctionBid($id: UUID!) {
    auction(id: $id) {
      reserveAmount
      offers(
        first: 1
        orderBy: [UNIT_PRICE_IN_REF_DESC, CREATED_AT_ASC]
        filter: { signature: { isNull: false } }
      ) {
        nodes {
          id
          amount
          quantity
          unitPrice
        }
      }
    }
  }
`
export enum AcceptAuctionStep {
  INITIAL,
  APPROVAL_SIGNATURE,
  APPROVAL_PENDING,
  TRANSACTION_SIGNATURE,
  TRANSACTION_PENDING,
  OWNERSHIP,
  RESOLVE_BEST_BID,
}

export default function useAcceptAuction(signer: Signer | undefined): [
  (auctionId: string) => Promise<void>,
  {
    activeStep: AcceptAuctionStep
    transactionHash: string | undefined
  },
] {
  const { sdk } = useContext(LiteflowContext)
  const [acceptOffer, { activeStep: activeAcceptOfferStep, transactionHash }] =
    useAcceptOffer(signer)
  const [activeStep, setActiveProcess] = useState<AcceptAuctionStep>(
    AcceptAuctionStep.INITIAL,
  )

  useEffect(() => {
    switch (activeAcceptOfferStep) {
      case AcceptOfferStep.APPROVAL_SIGNATURE:
        return setActiveProcess(AcceptAuctionStep.APPROVAL_SIGNATURE)
      case AcceptOfferStep.APPROVAL_PENDING:
        return setActiveProcess(AcceptAuctionStep.APPROVAL_PENDING)
      case AcceptOfferStep.TRANSACTION_SIGNATURE:
        return setActiveProcess(AcceptAuctionStep.TRANSACTION_SIGNATURE)
      case AcceptOfferStep.TRANSACTION_PENDING:
        return setActiveProcess(AcceptAuctionStep.TRANSACTION_PENDING)
      case AcceptOfferStep.OWNERSHIP:
        return setActiveProcess(AcceptAuctionStep.OWNERSHIP)
      case AcceptOfferStep.INITIAL:
        return setActiveProcess(AcceptAuctionStep.INITIAL)
      default:
        throw new Error('invalid step')
    }
  }, [activeAcceptOfferStep])

  const acceptAuction = useCallback(
    async (auctionId: string) => {
      try {
        setActiveProcess(AcceptAuctionStep.RESOLVE_BEST_BID)
        const data = await sdk.FetchAuctionBid({ id: auctionId })
        if (!data?.auction) throw new Error('Auction not found')
        const offer = data.auction.offers.nodes[0]
        if (!offer) throw new Error('No offer found')
        if (
          BigNumber.from(offer.amount).lt(
            BigNumber.from(data.auction.reserveAmount),
          )
        )
          throw new Error('reserve not matched')
        await acceptOffer(offer, offer.quantity)
      } finally {
        setActiveProcess(AcceptAuctionStep.INITIAL)
      }
    },
    [sdk, acceptOffer],
  )
  return [acceptAuction, { activeStep, transactionHash }]
}

import { Signer } from '@ethersproject/abstract-signer'
import { BigNumber } from '@ethersproject/bignumber'
import { gql } from 'graphql-request'
import { useCallback, useContext, useEffect, useState } from 'react'
import invariant from 'ts-invariant'
import { LiteflowContext } from './context'
import { ErrorMessages } from './errorMessages'
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
        invariant(data.auction, ErrorMessages.AUCTION_NOT_FOUND)
        const offer = data.auction.offers.nodes[0]
        invariant(offer, ErrorMessages.OFFER_NOT_FOUND)

        invariant(
          BigNumber.from(offer.amount).gte(
            BigNumber.from(data.auction.reserveAmount),
          ),
          ErrorMessages.AUCTION_RESERVER_NOT_MATCH,
        )
        await acceptOffer(offer, offer.quantity)
      } finally {
        setActiveProcess(AcceptAuctionStep.INITIAL)
      }
    },
    [sdk, acceptOffer],
  )
  return [acceptAuction, { activeStep, transactionHash }]
}

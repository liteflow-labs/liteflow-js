import type { Signer } from 'ethers'
import { BigNumber } from 'ethers'
import invariant from 'ts-invariant'
import type { Sdk } from '../graphql'
import type { IState, UUID } from '../types'
import type { State as AcceptOfferState } from './acceptOffer'
import { acceptOffer } from './acceptOffer'

export type State = IState<'RESOLVE_BEST_BID', {}> | AcceptOfferState

export async function acceptAuctionHighestBid(
  sdk: Sdk,
  id: UUID,
  signer: Signer,
  onProgress?: (state: State) => void,
): Promise<UUID> {
  // TODO: iterate over the offers until we find one that is valid
  onProgress?.({ type: 'RESOLVE_BEST_BID', payload: {} })
  const { auction } = await sdk.FetchAuctionBid({ id })
  invariant(auction)
  const offer = auction.offers.nodes[0]
  invariant(offer, "Can't find offer")

  invariant(
    BigNumber.from(offer.amount).gte(BigNumber.from(auction.reserveAmount)),
    "Offer doesn't meet the reserve price",
  )

  await acceptOffer(sdk, offer.id, offer.quantity, signer, onProgress)

  return id
}

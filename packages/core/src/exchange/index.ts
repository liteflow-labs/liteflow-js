import type { Signer } from 'ethers'
import invariant from 'ts-invariant'
import type { FetchOfferQuery, Sdk } from '../graphql'
import type { UUID, Uint256 } from '../types'
import type { State as AcceptAuctionHighestBidState } from './acceptAuctionHighestBid'
import { acceptAuctionHighestBid } from './acceptAuctionHighestBid'
import type { State as AcceptOfferState } from './acceptOffer'
import { acceptOffer } from './acceptOffer'
import type { State as CancelOfferState } from './cancelOffer'
import { cancelOffer } from './cancelOffer'
import type { Auction } from './createAuction'
import { createAuction } from './createAuction'
import type { State as ListTokenState, Listing } from './listToken'
import { listToken } from './listToken'
import type { Bid, State as PlaceBidState } from './placeBid'
import { placeBid } from './placeBid'

export class Exchange {
  private readonly sdk: Sdk

  constructor(sdk: Sdk) {
    this.sdk = sdk
  }

  async placeBid(
    bid: Bid,
    signer: Signer,
    onProgress?: (state: PlaceBidState) => void,
  ): Promise<UUID> {
    return placeBid(this.sdk, bid, signer, onProgress)
  }

  async listToken(
    listing: Listing,
    signer: Signer,
    onProgress?: (state: ListTokenState) => void,
  ): Promise<UUID> {
    return listToken(this.sdk, listing, signer, onProgress)
  }

  async cancelBid(
    bidId: UUID,
    signer: Signer,
    onProgress?: (state: CancelOfferState) => void,
  ): Promise<UUID> {
    return cancelOffer(this.sdk, bidId, signer, onProgress)
  }

  async cancelListing(
    listingId: UUID,
    signer: Signer,
    onProgress?: (state: CancelOfferState) => void,
  ): Promise<UUID> {
    return cancelOffer(this.sdk, listingId, signer, onProgress)
  }

  async acceptBid(
    bidId: UUID,
    quantity: Uint256,
    signer: Signer,
    onProgress?: (state: AcceptOfferState) => void,
  ): Promise<UUID> {
    return acceptOffer(this.sdk, bidId, quantity, signer, onProgress)
  }

  async buyToken(
    listingId: UUID,
    quantity: Uint256,
    signer: Signer,
    onProgress?: (state: AcceptOfferState) => void,
  ): Promise<UUID> {
    return acceptOffer(this.sdk, listingId, quantity, signer, onProgress)
  }

  async createAuction(
    auction: Auction,
    signer: Signer,
    onProgress?: (state: ListTokenState) => void,
  ): Promise<UUID> {
    return createAuction(this.sdk, auction, signer, onProgress)
  }

  async acceptAuctionHighestBid(
    auctionId: UUID,
    signer: Signer,
    onProgress?: (state: AcceptAuctionHighestBidState) => void,
  ): Promise<UUID> {
    return acceptAuctionHighestBid(this.sdk, auctionId, signer, onProgress)
  }

  // Low level API to retrieve an offer
  // Offer can be either a bid or a listing
  async getOffer(
    offerId: UUID,
  ): Promise<NonNullable<FetchOfferQuery['offer']>> {
    const { offer } = await this.sdk.FetchOffer({ offerId })
    invariant(offer, "Offer doesn't exist")
    return offer
  }
}

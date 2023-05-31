import type { Signer } from 'ethers'
import invariant from 'ts-invariant'
import type { FetchOfferQuery, Sdk } from '../graphql'
import type { Uint256, UUID } from '../types'
import type { State as AcceptOfferState } from './acceptOffer'
import { acceptOffer } from './acceptOffer'
import type { State as CancelOfferState } from './cancelOffer'
import { cancelOffer } from './cancelOffer'
import type { Listing, State as ListTokenState } from './listToken'
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

  async acceptOffer(
    offerId: UUID,
    quantity: Uint256,
    signer: Signer,
    onProgress?: (state: AcceptOfferState) => void,
  ): Promise<UUID> {
    return acceptOffer(this.sdk, offerId, quantity, signer, onProgress)
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

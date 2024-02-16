import type { Signer } from 'ethers'
import invariant from 'ts-invariant'
import type { OfferFragment, Sdk } from '../graphql'
import type { UUID, Uint256 } from '../types'
import type { State as AcceptOfferState } from './acceptOffer'
import { acceptOffer } from './acceptOffer'
import type { State as BatchPurchaseState } from './batchPurchase'
import { batchPurchase } from './batchPurchase'
import type { State as CancelOfferState } from './cancelOffer'
import { cancelOffer } from './cancelOffer'
import type { State as ListTokenState, Listing } from './listToken'
import { listToken } from './listToken'
import type { Bid, State as PlaceBidState } from './placeBid'
import { placeBid } from './placeBid'

export class Exchange {
  private readonly sdk: Sdk

  constructor(sdk: Sdk) {
    this.sdk = sdk
  }

  /**
   * Place a bid on a token
   * @param {Bid} bid - The bid to place
   * @param {Signer} signer - The signer to use to place the bid
   * @param {(state: PlaceBidState) => void} onProgress - Callback to track the bidding progress
   * @returns {Promise<UUID>} The ID of the placed bid
   */
  async placeBid(
    bid: Bid,
    signer: Signer,
    onProgress?: (state: PlaceBidState) => void,
  ): Promise<UUID> {
    return placeBid(this.sdk, bid, signer, onProgress)
  }

  /**
   * List a token for sale
   * @param {Listing} listing - The listing to create
   * @param {Signer} signer - The signer to use to create the listing
   * @param {(state: ListTokenState) => void} onProgress - Callback to track the listing progress
   * @returns {Promise<UUID>} The ID of the listed token
   */
  async listToken(
    listing: Listing,
    signer: Signer,
    onProgress?: (state: ListTokenState) => void,
  ): Promise<UUID> {
    return listToken(this.sdk, listing, signer, onProgress)
  }

  /**
   * Cancel a bid
   * @param {UUID} bidId - The bid to cancel
   * @param {Signer} signer - The signer to use to cancel the bid
   * @param {(state: CancelOfferState) => void} onProgress - Callback to track the cancellation progress
   * @returns {Promise<UUID>} The ID of the cancelled bid
   */
  async cancelBid(
    bidId: UUID,
    signer: Signer,
    onProgress?: (state: CancelOfferState) => void,
  ): Promise<UUID> {
    return cancelOffer(this.sdk, bidId, signer, onProgress)
  }

  /**
   * Cancel a listing
   * @param {UUID} listingId - The listing to cancel
   * @param {Signer} signer - The signer to use to cancel the listing
   * @param {(state: CancelOfferState) => void} onProgress - Callback to track the cancellation progress
   * @returns {Promise<UUID>} The ID of the cancelled listing
   */
  async cancelListing(
    listingId: UUID,
    signer: Signer,
    onProgress?: (state: CancelOfferState) => void,
  ): Promise<UUID> {
    return cancelOffer(this.sdk, listingId, signer, onProgress)
  }

  /**
   * Accept a bid
   * @param {UUID} bidId - The bid to accept
   * @param {Uint256} quantity - The quantity of the bid to accept
   * @param {Signer} signer - The signer to use to accept the bid
   * @param {(state: AcceptOfferState) => void} onProgress - Callback to track the acceptance progress
   * @returns {Promise<UUID>} The ID of the accepted bid
   */
  async acceptBid(
    bidId: UUID,
    quantity: Uint256,
    signer: Signer,
    onProgress?: (state: AcceptOfferState) => void,
  ): Promise<UUID> {
    const { openOffer } = await this.sdk.FetchOpenOffer({ offerId: bidId })
    invariant(openOffer, "Offer doesn't exist")
    return acceptOffer(this.sdk, openOffer, quantity, signer, onProgress)
  }

  /**
   * Accept a listing
   * @param {UUID} listingId - The listing to accept
   * @param {Uint256} quantity - The quantity of the listing to accept
   * @param {Signer} signer - The signer to use to accept the listing
   * @param {(state: AcceptOfferState) => void} onProgress - Callback to track the acceptance progress
   * @returns {Promise<UUID>} The ID of the accepted listing
   */
  async buyToken(
    listingId: UUID,
    quantity: Uint256,
    signer: Signer,
    onProgress?: (state: AcceptOfferState) => void,
  ): Promise<UUID> {
    const { listing } = await this.sdk.FetchListing({ offerId: listingId })
    invariant(listing, 'Listing not found')
    return acceptOffer(this.sdk, listing, quantity, signer, onProgress)
  }

  /**
   * Accept multiple listings
   * The signer should already have approved the transfer of the tokens otherwise the transaction will fail
   * @param {Array<{ listingId: UUID, quantity: Uint256 }>} purchases - The listings to accept
   * @param {Signer} signer - The signer to use to accept the listings
   * @param {(state: BatchPurchaseState) => void} onProgress - Callback to track the purchase progress
   * @returns {Promise<UUID[]>} The IDs of the accepted listings
   */
  async batchPurchase(
    purchases: { listingId: UUID; quantity: Uint256 }[],
    signer: Signer,
    onProgress?: (state: BatchPurchaseState) => void,
  ): Promise<UUID[]> {
    return batchPurchase(this.sdk, purchases, signer, onProgress)
  }

  // Low level API to retrieve an offer
  // Offer can be either a bid or a listing
  async getOffer(offerId: UUID): Promise<OfferFragment> {
    const { listing } = await this.sdk.FetchListing({ offerId })
    if (listing) {
      return listing
    }

    const { openOffer } = await this.sdk.FetchOpenOffer({ offerId })
    invariant(openOffer, "Offer doesn't exist")
    return openOffer
  }
}

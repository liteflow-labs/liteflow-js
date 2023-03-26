import type { Signer } from 'ethers'
import type { Sdk } from '../graphql'
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

  async cancelOffer(
    offerId: UUID,
    signer: Signer,
    onProgress?: (state: CancelOfferState) => void,
  ): Promise<UUID> {
    return cancelOffer(this.sdk, offerId, signer, onProgress)
  }

  async acceptOffer(
    offerId: UUID,
    quantity: Uint256,
    signer: Signer,
    onProgress?: (state: AcceptOfferState) => void,
  ): Promise<UUID> {
    return acceptOffer(this.sdk, offerId, quantity, signer, onProgress)
  }
}

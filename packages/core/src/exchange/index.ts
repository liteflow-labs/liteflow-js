import type { Signer } from 'ethers'
import type { Sdk } from '../graphql'
import type { UUID } from '../types'
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
}

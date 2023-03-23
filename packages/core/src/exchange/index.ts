import type { Signer } from 'ethers'
import type { Sdk } from '../graphql'
import type { UUID } from '../types'
import * as ListToken from './listToken'
import * as PlaceBid from './placeBid'

export class Exchange {
  private readonly sdk: Sdk

  constructor(sdk: Sdk) {
    this.sdk = sdk
  }

  placeBid(
    bid: PlaceBid.Bid,
    signer: Signer,
    onProgress?: (state: PlaceBid.State) => void,
  ): Promise<UUID> {
    return PlaceBid.placeBid(this.sdk, bid, signer, onProgress)
  }

  listToken(
    listing: ListToken.Listing,
    signer: Signer,
    onProgress?: (state: ListToken.State) => void,
  ): Promise<UUID> {
    return ListToken.listToken(this.sdk, listing, signer, onProgress)
  }
}

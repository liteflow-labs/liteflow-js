import type { Signer } from 'ethers'
import type { Sdk } from '../graphql'
import type { Address, ChainId } from '../types'
import type { Uploader } from '../uploader'
import type { State as LazymintState } from './lazymint'
import { lazymint } from './lazymint'
import type { State as MintState } from './mint'
import { mint } from './mint'
import type { MintedAsset } from './type'

export class Asset {
  private readonly sdk: Sdk
  private readonly uploader: Uploader

  constructor(sdk: Sdk, uploader: Uploader) {
    this.sdk = sdk
    this.uploader = uploader
  }

  async mint(
    asset: MintedAsset,
    signer: Signer,
    onProgress?: (state: MintState) => void,
  ): Promise<{
    chain: ChainId
    collection: Address
    tokenId: string
  }> {
    return mint(this.sdk, this.uploader, asset, signer, onProgress)
  }

  async lazymint(
    asset: MintedAsset,
    signer: Signer,
    onProgress?: (state: LazymintState) => void,
  ): Promise<{
    chain: ChainId
    collection: Address
    tokenId: string
  }> {
    return lazymint(this.sdk, this.uploader, asset, signer, onProgress)
  }
}

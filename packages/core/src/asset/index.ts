import type { Signer } from 'ethers'
import invariant from 'ts-invariant'
import type { Sdk } from '../graphql'
import type { Address, ChainId } from '../types'
import type { State as LazymintState } from './lazymint'
import { lazymint } from './lazymint'
import type { State as MintState } from './mint'
import { mint } from './mint'
import type { MintedAsset } from './type'

export class Asset {
  private readonly sdk: Sdk
  private readonly uploadEndpoint: URL

  constructor(sdk: Sdk, uploadEndpoint: URL) {
    this.sdk = sdk
    this.uploadEndpoint = uploadEndpoint
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

  private async uploader(file: File | URL | undefined, isPrivate = false) {
    if (!file) return
    if (file instanceof URL) return file.toString()
    const formData = new FormData()
    formData.append('file', file)
    formData.append('protected', isPrivate ? 'true' : 'false')
    const response = await fetch(this.uploadEndpoint, {
      method: 'POST',
      body: formData,
    })
    const result = await response.json()
    invariant(response.ok, `Upload failed: ${result.error}`)
    return result.cid
  }
}

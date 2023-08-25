import type { Signer } from 'ethers'
import type { Sdk } from '../graphql'
import type { Address, ChainId, UUID, Uint256 } from '../types'
import type { Uploader } from '../uploader'
import type { State as LazymintState } from './lazymint'
import { lazymint } from './lazymint'
import type { State as MintState } from './mint'
import { mint } from './mint'
import type { State as MintDropState } from './mintDrop'
import { mintDrop } from './mintDrop'
import type * as Type from './type'

export class Asset {
  private readonly sdk: Sdk
  private readonly uploader: Uploader

  constructor(sdk: Sdk, uploader: Uploader) {
    this.sdk = sdk
    this.uploader = uploader
  }

  /**
   * Mint an asset directly on-chain
   * @param {Type.Asset} asset - The asset data to mint
   * @param {Signer} signer - The signer to use to mint the asset
   * @param {(state: MintState) => void} onProgress - Callback to track the minting progress
   * @returns {Promise<{ chain: ChainId; collection: Address; token: string }>} The address of the minted asset
   */
  async mint(
    asset: Type.Asset,
    signer: Signer,
    onProgress?: (state: MintState) => void,
  ): Promise<{
    chain: ChainId
    collection: Address
    token: string
  }> {
    return mint(this.sdk, this.uploader, asset, signer, onProgress)
  }

  /**
   * Mint a drop directly on-chain
   * @param {UUID} dropId - The drop to mint
   * @param {Uint256} quantity - The quantity of the drop to mint
   * @param {Signer} signer - The signer to use to mint the drop
   * @param {(state: MintDropState) => void} onProgress - Callback to track the minting progress
   * @returns {Promise<{ tokenIds: string[] }>} The IDs of the minted assets
   */
  async mintDrop(
    dropId: UUID,
    quantity: Uint256,
    signer: Signer,
    onProgress?: (state: MintDropState) => void,
  ): Promise<{ tokenIds: string[] }> {
    return mintDrop(this.sdk, dropId, quantity, signer, onProgress)
  }

  /**
   * Mint an asset off-chain that will be minted on-chain later when purchased
   * @param {Type.Asset} asset - The asset data to lazymint
   * @param {Signer} signer - The signer to use to lazymint the asset
   * @param {(state: LazymintState) => void} onProgress - Callback to track the lazyminting progress
   * @returns {Promise<{ chain: ChainId; collection: Address; token: string }>} The address of the minted asset
   */
  async lazymint(
    asset: Type.Asset,
    signer: Signer,
    onProgress?: (state: LazymintState) => void,
  ): Promise<{
    chain: ChainId
    collection: Address
    token: string
  }> {
    return lazymint(this.sdk, this.uploader, asset, signer, onProgress)
  }
}

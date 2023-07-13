import type { BigNumberish } from 'ethers'
import type { Address, ChainId } from '../types'

export type Asset = {
  /**
   * The chain to mint the asset on
   * @type ChainId
   */
  chain: ChainId

  /**
   * The collection to mint the asset on
   * @type Address
   */
  collection: Address

  /**
   * The royalties to set on the asset expressed in percentage (eg: 5%).
   * @type number
   * @default 0
   */
  royalties?: number

  /**
   * The supply of the asset. If not set, the asset will be minted as a 1 of 1 even for ERC1155
   * @type BigNumberish
   * @default 1
   */
  supply?: BigNumberish

  /**
   * The metadata of the asset
   */
  metadata: {
    /**
     * The name of the asset
     * @type string
     */
    name: string

    /**
     * The image of the asset
     * @type File | URL
     */
    image: File | URL

    /**
     * The description of the asset
     * @type string
     */
    description?: string

    /**
     * The animation of the asset
     * @type File | URL
     */
    animationUrl?: File | URL

    /**
     * The unlockable content of the asset. This will be encrypted and only the owner of the asset will be able to decrypt it
     * @type File | URL
     */
    unlockableContent?: File | URL

    /**
     * The attributes of the asset
     * @type { traitType: string; value: string }[]
     * @default []
     */
    attributes?: {
      traitType: string
      value: string
    }[]
  }
}

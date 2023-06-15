import type { BigNumberish } from 'ethers'
import type { Address, ChainId } from '../types'

export type Uploader = (
  file: File | URL | undefined,
  isPrivate?: boolean,
) => Promise<string>

export type MintedAsset = {
  chain: ChainId
  collection: Address
  royalties?: number
  supply?: BigNumberish
  metadata: {
    name: string
    image: File | URL
    description?: string
    animationUrl?: File | URL
    unlockableContent?: File | URL
    attributes?: {
      traitType: string
      value: string
    }[]
  }
}

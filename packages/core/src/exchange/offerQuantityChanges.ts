import { BigNumber } from '@ethersproject/bignumber'
import invariant from 'ts-invariant'
import type { Sdk } from '../graphql'
import type { Address, ChainId, Uint256 } from '../types'
import { toAssetId } from '../utils/convert'

export async function checkOwnership(
  sdk: Sdk,
  chainId: ChainId,
  collection: Address,
  tokenId: string,
  owner: Address,
): Promise<Uint256> {
  const { ownership } = await sdk.FetchQuantityOwned({
    assetId: toAssetId(chainId, collection, tokenId),
    ownerAddress: owner,
  })
  return ownership?.quantity ?? '0'
}

export async function pollOwnership(
  sdk: Sdk,
  chainId: ChainId,
  collection: Address,
  tokenId: string,
  owner: Address,
  initialQuantity: Uint256,
  max = 120,
  interval = 5_000,
): Promise<void> {
  // poll the api until the ownership is updated
  let i = 0
  while (i < max) {
    // fetch
    const quantity = await checkOwnership(
      sdk,
      chainId,
      collection,
      tokenId,
      owner,
    )

    // check if quantity changed compared to the initial one
    if (!BigNumber.from(quantity).eq(BigNumber.from(initialQuantity))) break

    // wait
    await new Promise((resolve) => setTimeout(resolve, interval))
    i++
  }
  invariant(i !== max - 1, 'Ownership not found')
}

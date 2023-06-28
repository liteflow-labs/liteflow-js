import { BigNumber } from '@ethersproject/bignumber'
import invariant from 'ts-invariant'
import type { Sdk } from '../graphql'
import type { Address, ChainId, Uint256 } from '../types'
import { toAssetId } from '../utils/convert'

export async function checkOwnership(
  sdk: Sdk,
  chain: ChainId,
  collection: Address,
  token: string,
  owner: Address,
): Promise<Uint256> {
  const { ownership } = await sdk.FetchQuantityOwned({
    assetId: toAssetId(chain, collection, token),
    ownerAddress: owner,
  })
  return ownership?.quantity ?? '0'
}

export async function pollOwnership(
  sdk: Sdk,
  chain: ChainId,
  collection: Address,
  token: string,
  owner: Address,
  initialQuantity: Uint256,
  max = 120,
  interval = 5_000,
): Promise<void> {
  // poll the api until the ownership is updated
  let i = 0
  while (i < max) {
    // fetch
    const quantity = await checkOwnership(sdk, chain, collection, token, owner)

    // check if quantity changed compared to the initial one
    if (!BigNumber.from(quantity).eq(BigNumber.from(initialQuantity))) break

    // wait
    await new Promise((resolve) => setTimeout(resolve, interval))
    i++
  }
  invariant(i !== max - 1, 'Ownership not found')
}

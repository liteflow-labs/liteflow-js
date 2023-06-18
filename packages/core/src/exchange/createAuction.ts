import type { Signer } from '@ethersproject/abstract-signer'
import { BigNumber } from '@ethersproject/bignumber'
import invariant from 'ts-invariant'
import type { Sdk } from '../graphql'
import type {
  Address,
  ChainId,
  IState,
  TransactionHash,
  Uint256,
  UUID,
} from '../types'
import {
  toAddress,
  toAssetId,
  toCurrencyId,
  toTransactionHash,
} from '../utils/convert'
import { approveCollection } from './approveCollection'

export type State =
  | IState<'APPROVAL_SIGNATURE', {}>
  | IState<'APPROVAL_PENDING', { txHash: TransactionHash }>

export type Auction = {
  chain: ChainId
  collection: Address
  token: string
  reservePrice: {
    amount: Uint256
    currency: Address | null
  }
  endAt: Date
  expiredAt: Date
}

export async function createAuction(
  sdk: Sdk,
  { chain, collection, token, reservePrice, endAt, expiredAt }: Auction,
  signer: Signer,
  onProgress?: (state: State) => void,
): Promise<UUID> {
  const address = await signer.getAddress()

  onProgress?.({ type: 'APPROVAL_SIGNATURE', payload: {} })
  const tx = await approveCollection(sdk, { chain, collection }, signer)
  if (tx) {
    onProgress?.({
      type: 'APPROVAL_PENDING',
      payload: { txHash: toTransactionHash(tx.hash) },
    })
    await tx.wait()
  }

  const { createAuction } = await sdk.CreateAuction({
    createAuctionInput: {
      assetId: toAssetId(chain, collection, token),
      currencyId: toCurrencyId(chain, reservePrice.currency),
      reserveAmount: BigNumber.from(reservePrice.amount).toString(),
      endAt: endAt.toISOString(),
      expireAt: expiredAt.toISOString(),
      creatorAddress: toAddress(address.toLowerCase()),
    },
  })

  invariant(createAuction?.auction?.id, 'Failed to create auction')
  return createAuction.auction.id
}
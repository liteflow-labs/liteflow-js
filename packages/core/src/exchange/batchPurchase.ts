import { BigNumber } from '@ethersproject/bignumber'
import { invariant } from 'ts-invariant'
import type { FetchListingQuery, Sdk } from '../graphql'
import type { IState, Signer, TransactionHash, UUID, Uint256 } from '../types'
import { toAddress, toTransactionHash } from '../utils/convert'
import { sendTransaction } from '../utils/transaction'
import { checkOwnership, pollOwnership } from './offerQuantityChanges'
import { checkOfferValidity } from './utils'

export type State =
  | IState<'OFFER_VALIDITY', {}>
  | IState<'TRANSACTION_SIGNATURE', {}>
  | IState<'TRANSACTION_PENDING', { txHash: TransactionHash }>
  | IState<'OWNERSHIP', {}>

export async function batchPurchase(
  sdk: Sdk,
  purchases: { listingId: UUID; quantity: Uint256 }[],
  signer: Signer,
  onProgress?: (state: State) => void,
): Promise<UUID[]> {
  const address = signer.account.address

  const offersAndQuantities: {
    offer: NonNullable<FetchListingQuery['listing']>
    quantity: Uint256
  }[] = []
  onProgress?.({ type: 'OFFER_VALIDITY', payload: {} })
  for (const { listingId, quantity } of purchases) {
    const { listing: offer } = await sdk.FetchListing({ offerId: listingId })
    invariant(offer, "Can't find offer")

    await checkOfferValidity(offer, toAddress(address))
    offersAndQuantities.push({ offer, quantity })
  }

  const {
    createCheckoutTransaction: { transaction },
  } = await sdk.CreateBatchPurchaseTransaction({
    accountAddress: toAddress(address),
    items: offersAndQuantities.map(({ offer, quantity }) => ({
      offerId: offer.id,
      fillQuantity: BigNumber.from(quantity || 1).toString(),
    })),
  })

  const firstOffer = offersAndQuantities[0]?.offer
  invariant(firstOffer, "Can't find offer")

  const initialQuantity = await checkOwnership(
    sdk,
    firstOffer.asset.collection.chainId,
    firstOffer.asset.collection.address,
    firstOffer.asset.tokenId,
    toAddress(address),
  )

  onProgress?.({ type: 'TRANSACTION_SIGNATURE', payload: {} })
  const tx = await sendTransaction(signer, transaction)

  onProgress?.({
    type: 'TRANSACTION_PENDING',
    payload: { txHash: toTransactionHash(tx.hash) },
  })
  await signer.waitForTransactionReceipt(tx)

  onProgress?.({ type: 'OWNERSHIP', payload: {} })
  await pollOwnership(
    sdk,
    firstOffer.asset.collection.chainId,
    firstOffer.asset.collection.address,
    firstOffer.asset.tokenId,
    toAddress(address),
    initialQuantity,
  )

  return offersAndQuantities.map(({ offer }) => offer.id)
}

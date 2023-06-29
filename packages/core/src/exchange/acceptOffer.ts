import type { TransactionResponse } from '@ethersproject/abstract-provider'
import type { Signer } from 'ethers'
import { BigNumber } from 'ethers'
import { invariant } from 'ts-invariant'
import type { FetchOfferQuery, Sdk } from '../graphql'
import type { Address, IState, TransactionHash, UUID, Uint256 } from '../types'
import { toAddress, toTransactionHash } from '../utils/convert'
import { sendTransaction } from '../utils/transaction'
import { approveCollection } from './approveCollection'
import { approveCurrency } from './approveCurrency'
import { checkOwnership, pollOwnership } from './offerQuantityChanges'

export type State =
  | IState<'OFFER_VALIDITY', {}>
  | IState<'APPROVAL_SIGNATURE', {}>
  | IState<'APPROVAL_PENDING', { txHash: TransactionHash }>
  | IState<'TRANSACTION_SIGNATURE', {}>
  | IState<'TRANSACTION_PENDING', { txHash: TransactionHash }>
  | IState<'OWNERSHIP', {}>

const checkOfferValidity = async (
  offer: FetchOfferQuery['offer'],
  taker: Address,
) => {
  invariant(offer)

  if (offer.expiredAt && new Date(offer.expiredAt) < new Date())
    throw new Error('Offer has expired')

  if (BigNumber.from(offer.availableQuantity).isZero())
    throw new Error('Offer is not available')

  if (offer.takerAddress && toAddress(offer.takerAddress) !== taker)
    throw new Error('Offer is not for you')

  if (toAddress(offer.makerAddress) === toAddress(taker))
    throw new Error('You can not accept your own offer')

  // TODO: Check if the maker still has the asset
  // TODO: Check if the maker has authorized the transfer

  // Except front running, the offer should be valid at this point
}

const approveTransferTransaction = async (
  sdk: Sdk,
  offer: FetchOfferQuery['offer'],
  quantity: Uint256,
  signer: Signer,
): Promise<TransactionResponse | null> => {
  invariant(offer)
  if (offer.type === 'BUY')
    return approveCollection(
      sdk,
      {
        chain: offer.asset.collection.chainId,
        collection: toAddress(offer.asset.collection.address),
      },
      signer,
    )
  // The offer is in native token so we don't need any approval
  if (!offer.currency.address) return null
  return approveCurrency(
    sdk,
    {
      chain: offer.currency.chainId,
      currency: toAddress(offer.currency.address),
      amount: BigNumber.from(offer.unitPrice).mul(quantity).toString(),
    },
    signer,
  )
}

export async function acceptOffer(
  sdk: Sdk,
  offerId: UUID,
  quantity: Uint256,
  signer: Signer,
  onProgress?: (state: State) => void,
): Promise<UUID> {
  const address = await signer.getAddress()

  const { offer } = await sdk.FetchOffer({ offerId })
  invariant(offer, "Can't find offer")

  onProgress?.({ type: 'OFFER_VALIDITY', payload: {} })
  await checkOfferValidity(offer, toAddress(address))

  onProgress?.({ type: 'APPROVAL_SIGNATURE', payload: {} })
  const approveTx = await approveTransferTransaction(
    sdk,
    offer,
    quantity,
    signer,
  )
  if (approveTx) {
    onProgress?.({
      type: 'APPROVAL_PENDING',
      payload: { txHash: toTransactionHash(approveTx.hash) },
    })
    await approveTx.wait()
  }

  const newOwner =
    offer.type === 'SALE' ? offer.takerAddress || address : offer.makerAddress

  const {
    createOfferFillTransaction: { transaction },
  } = await sdk.CreateOfferFillTransaction({
    offerId: offer.id,
    accountAddress: toAddress(address),
    quantity: quantity.toString(),
  })

  const initialQuantity = await checkOwnership(
    sdk,
    offer.asset.collection.chainId,
    offer.asset.collection.address,
    offer.asset.tokenId,
    toAddress(newOwner),
  )

  onProgress?.({ type: 'TRANSACTION_SIGNATURE', payload: {} })
  const tx = await sendTransaction(signer, transaction)

  onProgress?.({
    type: 'TRANSACTION_PENDING',
    payload: { txHash: toTransactionHash(tx.hash) },
  })
  await tx.wait()

  onProgress?.({ type: 'OWNERSHIP', payload: {} })
  await pollOwnership(
    sdk,
    offer.asset.collection.chainId,
    offer.asset.collection.address,
    offer.asset.tokenId,
    toAddress(newOwner),
    initialQuantity,
  )

  return offer.id
}

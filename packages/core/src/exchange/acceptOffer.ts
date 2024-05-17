import { BigNumber } from '@ethersproject/bignumber'
import { invariant } from 'ts-invariant'
import type { OfferFragment, Sdk } from '../graphql'
import type {
  Hash,
  IState,
  Signer,
  TransactionHash,
  UUID,
  Uint256,
} from '../types'
import { toAddress, toTransactionHash } from '../utils/convert'
import { sendTransaction } from '../utils/transaction'
import { approveCollection } from './approveCollection'
import { approveCurrency } from './approveCurrency'
import { checkOwnership, pollOwnership } from './offerQuantityChanges'
import { checkOfferValidity } from './utils'

export type State =
  | IState<'OFFER_VALIDITY', {}>
  | IState<'APPROVAL_SIGNATURE', {}>
  | IState<'APPROVAL_PENDING', { txHash: TransactionHash }>
  | IState<'TRANSACTION_SIGNATURE', {}>
  | IState<'TRANSACTION_PENDING', { txHash: TransactionHash }>
  | IState<'OWNERSHIP', {}>

const approveTransferTransaction = async (
  sdk: Sdk,
  offer: OfferFragment,
  quantity: Uint256,
  signer: Signer,
): Promise<{ hash: Hash } | null> => {
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
  offer: OfferFragment,
  quantity: Uint256,
  signer: Signer,
  onProgress?: (state: State) => void,
): Promise<UUID> {
  const address = signer.account.address

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
    await signer.waitForTransactionReceipt(approveTx)
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
  await signer.waitForTransactionReceipt(tx)

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

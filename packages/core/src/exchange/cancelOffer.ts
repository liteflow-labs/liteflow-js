import type { Sdk } from '../graphql'
import type { IState, Signer, TransactionHash, UUID } from '../types'
import { toAddress, toTransactionHash } from '../utils/convert'
import { sendTransaction } from '../utils/transaction'

export type State =
  | IState<'TRANSACTION_SIGNATURE', {}>
  | IState<'TRANSACTION_PENDING', { txHash: TransactionHash }>

export async function cancelOffer(
  sdk: Sdk,
  offerId: UUID,
  signer: Signer,
  onProgress?: (state: State) => void,
): Promise<UUID> {
  const address = signer.account.address

  const { createCancelOfferTransaction } =
    await sdk.CreateCancelOfferTransaction({
      offerId,
      account: toAddress(address),
    })
  if (!createCancelOfferTransaction) throw new Error("Can't find offer")

  onProgress?.({ type: 'TRANSACTION_SIGNATURE', payload: {} })
  const tx = await sendTransaction(
    signer,
    createCancelOfferTransaction.transaction,
  )

  onProgress?.({
    type: 'TRANSACTION_PENDING',
    payload: { txHash: toTransactionHash(tx.hash) },
  })
  await signer.waitForTransactionReceipt(tx)

  await sdk.DeleteOffer({ id: offerId })
  return offerId
}

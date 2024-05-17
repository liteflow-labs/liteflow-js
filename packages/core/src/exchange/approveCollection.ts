import type { Sdk } from '../graphql'
import type { Address, ChainId, Hash, Signer } from '../types'
import { toAddress } from '../utils/convert'
import { sendTransaction } from '../utils/transaction'

type CollectionApproval = {
  chain: ChainId
  collection: Address
}

export async function approveCollection(
  sdk: Sdk,
  { chain, collection }: CollectionApproval,
  signer: Signer,
): Promise<{ hash: Hash } | null> {
  const address = signer.account.address

  const {
    createCollectionApprovalTransaction: { transaction },
  } = await sdk.CreateCollectionApprovalTransaction({
    accountAddress: toAddress(address),
    chainId: chain,
    collectionAddress: toAddress(collection),
  })

  if (!transaction) return null

  return sendTransaction(signer, transaction)
}

import type { TransactionResponse } from '@ethersproject/abstract-provider'
import type { Signer } from 'ethers'
import type { Sdk } from '../graphql'
import type { Address, ChainId } from '../types'
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
): Promise<TransactionResponse | null> {
  const address = await signer.getAddress()

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

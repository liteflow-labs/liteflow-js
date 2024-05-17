import { isHex } from 'viem'
import type { Transaction } from '../graphql'
import type { Hash, Signer } from '../types'

export async function sendTransaction(
  signer: Signer,
  transaction: Transaction,
): Promise<{ hash: Hash }> {
  const data = isHex(transaction.data) ? transaction.data : undefined
  const hash = await signer.sendTransaction({
    account: transaction.from || undefined,
    to: transaction.to || undefined,
    data: data,
    value: transaction.value ? BigInt(transaction.value) : undefined,
    gasPrice: transaction.gasPrice ? BigInt(transaction.gasPrice) : undefined,
  })
  return {
    hash,
  }
}

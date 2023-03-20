import type { TransactionResponse } from '@ethersproject/abstract-provider'
import type { Signer } from 'ethers'
import { BigNumber } from 'ethers'
import type { Transaction } from '../graphql'

export async function sendTransaction(
  signer: Signer,
  transaction: Transaction,
): Promise<TransactionResponse> {
  const tx = await signer.sendTransaction({
    to: transaction.to || undefined,
    from: transaction.from || undefined,
    data: transaction.data || undefined,
    value: transaction.value ? BigNumber.from(transaction.value) : undefined,
    gasPrice: transaction.gasPrice
      ? BigNumber.from(transaction.gasPrice)
      : undefined,
  })
  return tx
}

import type { TransactionResponse } from '@ethersproject/abstract-provider'
import type { Signer } from 'ethers'
import type { Sdk } from '../graphql'
import type { Address, ChainId, Uint256 } from '../types'
import { toAddress, toCurrencyId } from '../utils/convert'
import { sendTransaction } from '../utils/transaction'

type CurrencyApproval = {
  chain: ChainId
  currency: Address
  amount: Uint256
}

export async function approveCurrency(
  sdk: Sdk,
  { chain, currency, amount }: CurrencyApproval,
  signer: Signer,
): Promise<TransactionResponse | null> {
  const address = await signer.getAddress()

  const {
    createCurrencyApprovalTransaction: { transaction },
  } = await sdk.CreateCurrencyApprovalTransaction({
    accountAddress: toAddress(address),
    currencyId: toCurrencyId(chain, toAddress(currency)),
    amount: amount.toString(),
  })

  if (!transaction) return null

  return sendTransaction(signer, transaction)
}
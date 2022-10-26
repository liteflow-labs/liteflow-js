import { TransactionRequest } from '@ethersproject/abstract-provider'
import { BigNumber } from '@ethersproject/bignumber'
import { Deferrable } from '@ethersproject/properties'
import { gql } from 'graphql-request'
import { Transaction as TransactionType } from '../graphql'

gql`
  fragment Transaction on Transaction {
    to
    from
    data
    gasPrice
    value
  }
`

export function convertTx(tx: TransactionType): Deferrable<TransactionRequest> {
  return {
    to: tx.to || undefined,
    from: tx.from || undefined,
    data: tx.data || undefined,
    value: tx.value ? BigNumber.from(tx.value) : undefined,
    gasPrice: tx.gasPrice ? BigNumber.from(tx.gasPrice) : undefined,
  }
}

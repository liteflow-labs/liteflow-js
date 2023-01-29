import { Signer } from '@ethersproject/abstract-signer'
import { BigNumber } from '@ethersproject/bignumber'
import { gql } from 'graphql-request'
import { useCallback, useContext, useState } from 'react'
import invariant from 'ts-invariant'
import { LiteflowContext } from './context'
import { ErrorMessages } from './errorMessages'
import { convertTx } from './utils/transaction'

gql`
  mutation CreateCurrencyApprovalTransaction(
    $accountAddress: Address!
    $amount: Uint256!
    $currencyId: String!
  ) {
    createCurrencyApprovalTransaction(
      accountAddress: $accountAddress
      amount: $amount
      currencyId: $currencyId
    ) {
      transaction {
        ...Transaction
      }
    }
  }
`

export enum ApproveCurrencyStep {
  INITIAL,
  SIGNATURE,
  PENDING,
}

export default function useApproveCurrency(signer: Signer | undefined): [
  (data: { amount: BigNumber; currencyId: string }) => Promise<void>,
  {
    activeStep: ApproveCurrencyStep
    transactionHash: string | undefined
  },
] {
  const { sdk } = useContext(LiteflowContext)
  const [transactionHash, setTransactionHash] = useState<string>()
  const [activeStep, setActiveProcess] = useState<ApproveCurrencyStep>(
    ApproveCurrencyStep.INITIAL,
  )

  const approveCurrency = useCallback(
    async ({
      amount,
      currencyId,
    }: {
      amount: BigNumber
      currencyId: string
    }): Promise<void> => {
      invariant(signer, ErrorMessages.SIGNER_FALSY)
      try {
        setActiveProcess(ApproveCurrencyStep.SIGNATURE)
        const account = await signer.getAddress()
        const { createCurrencyApprovalTransaction } =
          await sdk.CreateCurrencyApprovalTransaction({
            accountAddress: account.toLowerCase(),
            currencyId: currencyId,
            amount: amount.toString(),
          })
        const approval = createCurrencyApprovalTransaction.transaction
        if (!approval) return

        // must authorize operator by executing a transaction
        console.info(`must authorized operator first`)
        const tx = await signer.sendTransaction(convertTx(approval))
        setActiveProcess(ApproveCurrencyStep.PENDING)
        setTransactionHash(tx.hash)
        console.info(`waiting for transaction with hash ${tx.hash}...`)
        await tx.wait()
        console.info(`transaction validated`)
      } finally {
        setTransactionHash(undefined)
        setActiveProcess(ApproveCurrencyStep.INITIAL)
      }
    },
    [sdk, signer],
  )

  return [approveCurrency, { activeStep, transactionHash }]
}

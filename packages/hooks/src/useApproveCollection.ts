import { Signer } from '@ethersproject/abstract-signer'
import { gql } from 'graphql-request'
import { useCallback, useContext, useState } from 'react'
import invariant from 'ts-invariant'
import { LiteflowContext } from './context'
import { ErrorMessages } from './errorMessages'
import { convertTx } from './utils/transaction'

gql`
  mutation CreateCollectionApprovalTransaction(
    $accountAddress: Address!
    $chainId: Int!
    $collectionAddress: String!
  ) {
    createCollectionApprovalTransaction(
      accountAddress: $accountAddress
      chainId: $chainId
      collectionAddress: $collectionAddress
    ) {
      transaction {
        ...Transaction
      }
    }
  }
`

export enum ApproveCollectionStep {
  INITIAL,
  SIGNATURE,
  PENDING,
}

export default function useApproveCollection(signer: Signer | undefined): [
  (data: { chainId: number; collectionAddress: string }) => Promise<void>,
  {
    activeStep: ApproveCollectionStep
    transactionHash: string | undefined
  },
] {
  const { sdk } = useContext(LiteflowContext)
  const [transactionHash, setTransactionHash] = useState<string>()
  const [activeStep, setActiveProcess] = useState<ApproveCollectionStep>(
    ApproveCollectionStep.INITIAL,
  )

  const approveCollection = useCallback(
    async ({
      chainId,
      collectionAddress,
    }: {
      chainId: number
      collectionAddress: string
    }): Promise<void> => {
      invariant(signer, ErrorMessages.SIGNER_FALSY)
      try {
        setActiveProcess(ApproveCollectionStep.SIGNATURE)
        const account = await signer.getAddress()
        const { createCollectionApprovalTransaction } =
          await sdk.CreateCollectionApprovalTransaction({
            accountAddress: account.toLowerCase(),
            chainId: chainId,
            collectionAddress: collectionAddress.toLowerCase(),
          })
        const approval = createCollectionApprovalTransaction.transaction
        if (!approval) return

        // must authorize operator by executing a transaction
        console.info(`must authorized operator first`)
        const tx = await signer.sendTransaction(convertTx(approval))
        setActiveProcess(ApproveCollectionStep.PENDING)
        setTransactionHash(tx.hash)
        console.info(`waiting for transaction with hash ${tx.hash}...`)
        await tx.wait()
        console.info(`transaction validated`)
      } finally {
        setTransactionHash(undefined)
        setActiveProcess(ApproveCollectionStep.INITIAL)
      }
    },
    [sdk, signer],
  )

  return [approveCollection, { activeStep, transactionHash }]
}

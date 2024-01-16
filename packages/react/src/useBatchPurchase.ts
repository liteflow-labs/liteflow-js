import { Signer } from '@ethersproject/abstract-signer'
import { BigNumberish } from '@ethersproject/bignumber'
import { TransactionHash, UUID } from '@liteflow/core'
import { useCallback, useContext, useState } from 'react'
import invariant from 'ts-invariant'
import { LiteflowContext } from './context'
import { ErrorMessages } from './errorMessages'

export enum BatchPurchaseStep {
  INITIAL,
  TRANSACTION_SIGNATURE,
  TRANSACTION_PENDING,
  OWNERSHIP,
}

type batchPurchaseFn = (
  purchases: { offerId: UUID; quantity: BigNumberish }[],
) => Promise<void>

export default function useBatchPurchase(signer: Signer | undefined): [
  batchPurchaseFn,
  {
    activeStep: BatchPurchaseStep
    transactionHash: TransactionHash | undefined
  },
] {
  const { client } = useContext(LiteflowContext)
  const [activeStep, setActiveProcess] = useState<BatchPurchaseStep>(
    BatchPurchaseStep.INITIAL,
  )
  const [transactionHash, setTransactionHash] = useState<TransactionHash>()

  const onProgress = useCallback(
    (state) => {
      switch (state.type) {
        case 'TRANSACTION_SIGNATURE': {
          setActiveProcess(BatchPurchaseStep.TRANSACTION_SIGNATURE)
          break
        }
        case 'TRANSACTION_PENDING': {
          setActiveProcess(BatchPurchaseStep.TRANSACTION_PENDING)
          setTransactionHash(state.payload.txHash)
          break
        }
        case 'OWNERSHIP': {
          setActiveProcess(BatchPurchaseStep.OWNERSHIP)
          break
        }
        case 'OFFER_VALIDITY': {
          console.log('validating offer...')
        }
      }
    },
    [setActiveProcess, setTransactionHash],
  )

  const batchPurchase: batchPurchaseFn = useCallback(
    async (purchases) => {
      invariant(signer, ErrorMessages.SIGNER_FALSY)
      try {
        await client.exchange.batchPurchase(
          purchases.map((x) => ({
            listingId: x.offerId,
            quantity: x.quantity,
          })),
          signer,
          onProgress,
        )
      } finally {
        setActiveProcess(BatchPurchaseStep.INITIAL)
        setTransactionHash(undefined)
      }
    },
    [client, signer, onProgress],
  )

  return [batchPurchase, { activeStep, transactionHash }]
}

import { Signer } from '@ethersproject/abstract-signer'
import { BigNumberish } from '@ethersproject/bignumber'
import { Address, ChainId, TransactionHash, UUID } from '@liteflow/core'
import { useCallback, useContext, useState } from 'react'
import invariant from 'ts-invariant'
import { LiteflowContext } from './context'
import { ErrorMessages } from './errorMessages'

export enum MintDropStep {
  INITIAL,
  TRANSACTION_SIGNATURE,
  TRANSACTION_PENDING,
  OWNERSHIP,
}

type mintDropFn = (
  {
    chain,
    collection,
    dropId,
  }: { chain: ChainId; collection: Address; dropId: UUID },
  quantity: BigNumberish,
) => Promise<void>

export default function useMintDrop(signer: Signer | undefined): [
  mintDropFn,
  {
    activeStep: MintDropStep
    transactionHash: TransactionHash | undefined
  },
] {
  const { client } = useContext(LiteflowContext)
  const [activeStep, setActiveProcess] = useState<MintDropStep>(
    MintDropStep.INITIAL,
  )
  const [transactionHash, setTransactionHash] = useState<TransactionHash>()

  const onProgress = useCallback(
    (state) => {
      switch (state.type) {
        case 'TRANSACTION_SIGNATURE': {
          setActiveProcess(MintDropStep.TRANSACTION_PENDING)
          break
        }
        case 'TRANSACTION_PENDING': {
          setActiveProcess(MintDropStep.TRANSACTION_PENDING)
          setTransactionHash(state.payload.txHash)
          break
        }
        case 'OWNERSHIP': {
          setActiveProcess(MintDropStep.OWNERSHIP)
          break
        }
      }
    },
    [setActiveProcess, setTransactionHash],
  )

  const mintDrop: mintDropFn = useCallback(
    async ({ chain, collection, dropId }, quantity) => {
      invariant(signer, ErrorMessages.SIGNER_FALSY)
      try {
        await client.exchange.mintDrop(
          { chain, collection, dropId },
          quantity,
          signer,
          onProgress,
        )
      } finally {
        setActiveProcess(MintDropStep.INITIAL)
        setTransactionHash(undefined)
      }
    },
    [client, signer, onProgress],
  )

  return [mintDrop, { activeStep, transactionHash }]
}

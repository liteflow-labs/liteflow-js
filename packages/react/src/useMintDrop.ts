import type { BigNumberish } from '@ethersproject/bignumber'
import { Address, ChainId, Signer, TransactionHash, UUID } from '@liteflow/core'
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
  dropId: UUID,
  quantity: BigNumberish,
) => Promise<
  {
    chain: ChainId
    collection: Address
    token: string
  }[]
>

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
          setActiveProcess(MintDropStep.TRANSACTION_SIGNATURE)
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
    async (dropId, quantity) => {
      invariant(signer, ErrorMessages.SIGNER_FALSY)
      try {
        const mints = await client.asset.mintDrop(
          dropId,
          quantity,
          signer,
          onProgress,
        )
        return mints
      } finally {
        setActiveProcess(MintDropStep.INITIAL)
        setTransactionHash(undefined)
      }
    },
    [client, signer, onProgress],
  )

  return [mintDrop, { activeStep, transactionHash }]
}

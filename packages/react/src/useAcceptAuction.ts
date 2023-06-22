import { Signer } from '@ethersproject/abstract-signer'
import { TransactionHash, UUID } from '@liteflow/core'
import { useCallback, useContext, useState } from 'react'
import invariant from 'ts-invariant'
import { LiteflowContext } from './context'
import { ErrorMessages } from './errorMessages'

export enum AcceptAuctionStep {
  INITIAL,
  APPROVAL_SIGNATURE,
  APPROVAL_PENDING,
  TRANSACTION_SIGNATURE,
  TRANSACTION_PENDING,
  OWNERSHIP,
  RESOLVE_BEST_BID,
}

export default function useAcceptAuction(signer: Signer | undefined): [
  (auctionId: UUID) => Promise<void>,
  {
    activeStep: AcceptAuctionStep
    transactionHash: TransactionHash | undefined
  },
] {
  const { client } = useContext(LiteflowContext)
  const [transactionHash, setTransactionHash] = useState<TransactionHash>()
  const [activeStep, setActiveProcess] = useState<AcceptAuctionStep>(
    AcceptAuctionStep.INITIAL,
  )

  const acceptAuction = useCallback(
    async (auctionId: string) => {
      invariant(signer, ErrorMessages.SIGNER_FALSY)
      setActiveProcess(AcceptAuctionStep.INITIAL)
      try {
        await client.exchange.acceptAuctionHighestBid(
          auctionId,
          signer,
          (status) => {
            switch (status.type) {
              case 'RESOLVE_BEST_BID':
                return setActiveProcess(AcceptAuctionStep.RESOLVE_BEST_BID)
              case 'OFFER_VALIDITY':
                return setActiveProcess(AcceptAuctionStep.OWNERSHIP)
              case 'APPROVAL_SIGNATURE':
                return setActiveProcess(AcceptAuctionStep.APPROVAL_SIGNATURE)
              case 'APPROVAL_PENDING':
                setTransactionHash(status.payload.txHash)
                return setActiveProcess(AcceptAuctionStep.APPROVAL_PENDING)
              case 'TRANSACTION_SIGNATURE':
                return setActiveProcess(AcceptAuctionStep.TRANSACTION_SIGNATURE)
              case 'TRANSACTION_PENDING': {
                setTransactionHash(status.payload.txHash)
                return setActiveProcess(AcceptAuctionStep.TRANSACTION_PENDING)
              }
              case 'OWNERSHIP':
                return setActiveProcess(AcceptAuctionStep.OWNERSHIP)
              default:
                throw new Error('invalid step')
            }
          },
        )
      } finally {
        setActiveProcess(AcceptAuctionStep.INITIAL)
        setTransactionHash(undefined)
      }
    },
    [client, signer],
  )
  return [acceptAuction, { activeStep, transactionHash }]
}

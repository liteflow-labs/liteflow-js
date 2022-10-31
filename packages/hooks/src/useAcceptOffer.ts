import { Signer } from '@ethersproject/abstract-signer'
import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { gql } from 'graphql-request'
import { useCallback, useContext, useState } from 'react'
import { LiteflowContext } from './context'
import { TransactionFragment } from './graphql'
import useCheckOwnership from './useCheckOwnership'
import { convertTx } from './utils/transaction'

gql`
  query OfferWithApprovalAndFill(
    $offerId: UUID!
    $taker: Address!
    $quantity: Uint256!
    $amount: Uint256!
  ) {
    offer(id: $offerId) {
      type
      makerAddress
      takerAddress
      assetId
      currency {
        approval(account: $taker, amount: $amount) {
          ...Transaction
        }
      }
      asset {
        token {
          __typename
          ... on ERC721 {
            approval(account: $taker) {
              ...Transaction
            }
          }
          ... on ERC1155 {
            approval(account: $taker) {
              ...Transaction
            }
          }
        }
      }
      fill(account: $taker, quantity: $quantity) {
        ...Transaction
      }
    }
  }
`

export enum AcceptOfferStep {
  INITIAL,
  APPROVAL_SIGNATURE,
  APPROVAL_PENDING,
  TRANSACTION_SIGNATURE,
  TRANSACTION_PENDING,
  OWNERSHIP,
}

type acceptOfferFn = (
  offer: {
    id: string
    unitPrice: BigNumberish
  },
  quantity: BigNumberish,
) => Promise<void>

export default function useAcceptOffer(signer: Signer | undefined): [
  acceptOfferFn,
  {
    activeStep: AcceptOfferStep
    transactionHash: string | undefined
  },
] {
  const { sdk } = useContext(LiteflowContext)
  const [{ pollOwnership, checkOwnership }] = useCheckOwnership()

  const [activeStep, setActiveProcess] = useState<AcceptOfferStep>(
    AcceptOfferStep.INITIAL,
  )
  const [transactionHash, setTransactionHash] = useState<string>()

  const acceptOffer: acceptOfferFn = useCallback(
    async (offer, quantity) => {
      if (!signer) throw new Error('signer falsy')
      const account = await signer.getAddress()

      try {
        // fetch approval from api
        const offerWithApprovalAndFill = await sdk.OfferWithApprovalAndFill({
          offerId: offer.id,
          taker: account.toLowerCase(),
          quantity: quantity.toString(),
          amount: BigNumber.from(offer.unitPrice).mul(quantity).toString(),
        })
        if (!offerWithApprovalAndFill)
          throw new Error('unknown error when fetching offer approval and fill')

        if (!offerWithApprovalAndFill.offer)
          throw new Error(`offer ${offer.id} doesn't exists`)

        // check if operator is authorized
        let approval: TransactionFragment | null
        if (offerWithApprovalAndFill.offer.type === 'SALE') {
          // accepting an offer of type sale, approval is on the currency
          approval = offerWithApprovalAndFill.offer.currency.approval
        } else {
          // accepting an offer of type buy, approval is on the asset
          approval = // typescript check
            offerWithApprovalAndFill.offer.asset.token.__typename ===
              'ERC721' ||
            offerWithApprovalAndFill.offer.asset.token.__typename === 'ERC1155'
              ? offerWithApprovalAndFill.offer.asset.token.approval
              : null
        }
        if (approval) {
          try {
            setActiveProcess(AcceptOfferStep.APPROVAL_SIGNATURE)
            // must authorize operator by executing a transaction
            console.info(`must authorized operator first`)
            const tx = await signer.sendTransaction(convertTx(approval))
            setActiveProcess(AcceptOfferStep.APPROVAL_PENDING)
            setTransactionHash(tx.hash)
            console.info(`waiting for transaction with hash ${tx.hash}...`)
            await tx.wait()
            console.info(`transaction validated`)
          } finally {
            setTransactionHash(undefined)
          }
        }

        // determine the asset id to check ownership from
        const assetId = offerWithApprovalAndFill.offer.assetId
        const newOwner =
          offerWithApprovalAndFill.offer.type === 'SALE'
            ? offerWithApprovalAndFill.offer.takerAddress ||
              account.toLowerCase()
            : offerWithApprovalAndFill.offer.makerAddress

        // fetch initial quantity
        const { quantity: initialQuantity } = await checkOwnership(
          assetId,
          newOwner,
        )

        setActiveProcess(AcceptOfferStep.TRANSACTION_SIGNATURE)
        // sign and broadcast the transaction
        const tx = await signer.sendTransaction(
          convertTx(offerWithApprovalAndFill.offer.fill),
        )
        setTransactionHash(tx.hash)
        setActiveProcess(AcceptOfferStep.TRANSACTION_PENDING)
        console.info(`waiting for transaction with hash ${tx.hash}...`)
        await tx.wait()
        console.info(`transaction validated`)

        setActiveProcess(AcceptOfferStep.OWNERSHIP)
        // poll the api until the ownership is updated
        console.info('polling api to check ownership...')
        await pollOwnership({
          assetId,
          ownerAddress: newOwner,
          initialQuantity,
        })
        console.info('polling done')
      } finally {
        setActiveProcess(AcceptOfferStep.INITIAL)
        setTransactionHash(undefined)
      }
    },
    [sdk, signer, checkOwnership, pollOwnership],
  )

  return [acceptOffer, { activeStep, transactionHash }]
}

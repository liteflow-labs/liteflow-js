import { Signer } from '@ethersproject/abstract-signer'
import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { gql } from 'graphql-request'
import { useCallback, useContext, useState } from 'react'
import invariant from 'ts-invariant'
import { LiteflowContext } from './context'
import { ErrorMessages } from './errorMessages'
import { TransactionFragment } from './graphql'
import useCheckOwnership from './useCheckOwnership'
import { convertTx } from './utils/transaction'

gql`
  query OfferWithApproval($offerId: UUID!, $taker: Address!) {
    offer(id: $offerId) {
      type
      makerAddress
      takerAddress
      assetId
      currencyId
      asset {
        chainId
        collectionAddress
      }
    }
  }
`

gql`
  mutation CreateOfferFillTransaction(
    $offerId: String!
    $accountAddress: Address!
    $quantity: Uint256!
  ) {
    createOfferFillTransaction(
      offerId: $offerId
      accountAddress: $accountAddress
      quantity: $quantity
    ) {
      transaction {
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
  const { pollOwnership, checkOwnership } = useCheckOwnership()

  const [activeStep, setActiveProcess] = useState<AcceptOfferStep>(
    AcceptOfferStep.INITIAL,
  )
  const [transactionHash, setTransactionHash] = useState<string>()

  const acceptOffer: acceptOfferFn = useCallback(
    async ({ id, unitPrice }, quantity) => {
      invariant(signer, ErrorMessages.SIGNER_FALSY)
      const account = await signer.getAddress()

      try {
        // fetch approval from api
        const { offer } = await sdk.OfferWithApproval({
          offerId: id,
          taker: account.toLowerCase(),
        })
        invariant(offer, ErrorMessages.OFFER_NOT_FOUND)

        // check if operator is authorized
        let approval: TransactionFragment | null
        if (offer.type === 'SALE') {
          // accepting an offer of type sale, approval is on the currency
          const { createCurrencyApprovalTransaction } =
            await sdk.CreateCurrencyApprovalTransaction({
              accountAddress: account.toLowerCase(),
              currencyId: offer.currencyId,
              amount: BigNumber.from(unitPrice).mul(quantity).toString(),
            })
          approval = createCurrencyApprovalTransaction.transaction
        } else {
          // accepting an offer of type buy, approval is on the asset
          const { createCollectionApprovalTransaction } =
            await sdk.CreateCollectionApprovalTransaction({
              accountAddress: account.toLowerCase(),
              chainId: offer.asset.chainId,
              collectionAddress: offer.asset.collectionAddress,
            })
          approval = createCollectionApprovalTransaction.transaction
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
        const assetId = offer.assetId
        const newOwner =
          offer.type === 'SALE'
            ? offer.takerAddress || account.toLowerCase()
            : offer.makerAddress

        // fetch fill transaction
        const { createOfferFillTransaction } =
          await sdk.CreateOfferFillTransaction({
            accountAddress: account.toLowerCase(),
            offerId: id,
            quantity: quantity.toString(),
          })

        // fetch initial quantity
        const { quantity: initialQuantity } = await checkOwnership(
          assetId,
          newOwner,
        )

        setActiveProcess(AcceptOfferStep.TRANSACTION_SIGNATURE)
        // sign and broadcast the transaction
        const tx = await signer.sendTransaction(
          convertTx(createOfferFillTransaction.transaction),
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

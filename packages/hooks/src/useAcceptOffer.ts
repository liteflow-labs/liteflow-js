import { Signer } from '@ethersproject/abstract-signer'
import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { gql } from 'graphql-request'
import { useCallback, useContext, useEffect, useState } from 'react'
import invariant from 'ts-invariant'
import { LiteflowContext } from './context'
import { ErrorMessages } from './errorMessages'
import useApproveCollection, {
  ApproveCollectionStep,
} from './useApproveCollection'
import useApproveCurrency, { ApproveCurrencyStep } from './useApproveCurrency'
import useCheckOwnership from './useCheckOwnership'
import { convertTx } from './utils/transaction'

gql`
  query FetchOffer($offerId: UUID!) {
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
  const [
    approveCurrency,
    {
      activeStep: approveCurrencyActiveStep,
      transactionHash: approveCurrencyTransactionHash,
    },
  ] = useApproveCurrency(signer)
  const [
    approveCollection,
    {
      activeStep: approveCollectionActiveStep,
      transactionHash: approveCollectionTransactionHash,
    },
  ] = useApproveCollection(signer)

  // sync approve currency active step
  useEffect(() => {
    switch (approveCurrencyActiveStep) {
      case ApproveCurrencyStep.PENDING: {
        setActiveProcess(AcceptOfferStep.APPROVAL_PENDING)
        break
      }
      case ApproveCurrencyStep.SIGNATURE: {
        setActiveProcess(AcceptOfferStep.APPROVAL_SIGNATURE)
        break
      }
    }
  }, [approveCurrencyActiveStep])

  // sync approve collection active step
  useEffect(() => {
    switch (approveCollectionActiveStep) {
      case ApproveCollectionStep.PENDING: {
        setActiveProcess(AcceptOfferStep.APPROVAL_PENDING)
        break
      }
      case ApproveCollectionStep.SIGNATURE: {
        setActiveProcess(AcceptOfferStep.APPROVAL_SIGNATURE)
        break
      }
    }
  }, [approveCollectionActiveStep])

  // sync approve currency transaction hash
  useEffect(() => {
    setTransactionHash(approveCurrencyTransactionHash)
  }, [approveCurrencyTransactionHash])

  // sync approve collection transaction hash
  useEffect(() => {
    setTransactionHash(approveCollectionTransactionHash)
  }, [approveCollectionTransactionHash])

  const acceptOffer: acceptOfferFn = useCallback(
    async ({ id, unitPrice }, quantity) => {
      invariant(signer, ErrorMessages.SIGNER_FALSY)
      const account = await signer.getAddress()

      try {
        // fetch approval from api
        const { offer } = await sdk.FetchOffer({
          offerId: id,
        })
        invariant(offer, ErrorMessages.OFFER_NOT_FOUND)

        // check if operator is authorized
        if (offer.type === 'SALE') {
          // accepting an offer of type sale, approval is on the currency
          await approveCurrency({
            currencyId: offer.currencyId,
            amount: BigNumber.from(unitPrice).mul(quantity),
          })
        } else {
          // accepting an offer of type buy, approval is on the asset
          await approveCollection({
            chainId: offer.asset.chainId,
            collectionAddress: offer.asset.collectionAddress,
          })
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
    [
      signer,
      sdk,
      checkOwnership,
      pollOwnership,
      approveCurrency,
      approveCollection,
    ],
  )

  return [acceptOffer, { activeStep, transactionHash }]
}

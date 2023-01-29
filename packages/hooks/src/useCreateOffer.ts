import { Signer, TypedDataSigner } from '@ethersproject/abstract-signer'
import { BigNumber } from '@ethersproject/bignumber'
import { gql } from 'graphql-request'
import { useCallback, useContext, useEffect, useState } from 'react'
import invariant from 'ts-invariant'
import { LiteflowContext } from './context'
import { ErrorMessages } from './errorMessages'
import { OfferType } from './graphql'
import useApproveCollection, {
  ApproveCollectionStep,
} from './useApproveCollection'
import useApproveCurrency, { ApproveCurrencyStep } from './useApproveCurrency'

gql`
  query FetchAssetForOffer($assetId: String!) {
    asset(id: $assetId) {
      chainId
      collectionAddress
    }
  }
`

gql`
  mutation CreateOfferSignature($offer: OfferInputBis!) {
    createOfferSignature(input: { offer: $offer }) {
      eip712Data
      timestamp
      salt
    }
  }
`

gql`
  mutation CreateOffer(
    $offer: OfferInputBis!
    $timestamp: Int!
    $salt: String!
    $signature: String!
  ) {
    createOffer(
      input: {
        offer: $offer
        timestamp: $timestamp
        salt: $salt
        signature: $signature
      }
    ) {
      offer {
        id
      }
    }
  }
`

export enum CreateOfferStep {
  INITIAL,
  APPROVAL_SIGNATURE,
  APPROVAL_PENDING,
  SIGNATURE,
}

export default function useCreateOffer(
  signer: (Signer & TypedDataSigner) | undefined,
): [
  (data: {
    type: OfferType
    quantity: BigNumber
    unitPrice: BigNumber
    assetId: string
    currencyId: string
    takerAddress?: string
    expiredAt: Date | null
    auctionId?: string
  }) => Promise<string>,
  {
    activeStep: CreateOfferStep
    transactionHash: string | undefined
  },
] {
  const { sdk } = useContext(LiteflowContext)
  const [activeStep, setActiveProcess] = useState<CreateOfferStep>(
    CreateOfferStep.INITIAL,
  )
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
        setActiveProcess(CreateOfferStep.APPROVAL_PENDING)
        break
      }
      case ApproveCurrencyStep.SIGNATURE: {
        setActiveProcess(CreateOfferStep.APPROVAL_SIGNATURE)
        break
      }
    }
  }, [approveCurrencyActiveStep])

  // sync approve collection active step
  useEffect(() => {
    switch (approveCollectionActiveStep) {
      case ApproveCollectionStep.PENDING: {
        setActiveProcess(CreateOfferStep.APPROVAL_PENDING)
        break
      }
      case ApproveCollectionStep.SIGNATURE: {
        setActiveProcess(CreateOfferStep.APPROVAL_SIGNATURE)
        break
      }
    }
  }, [approveCollectionActiveStep])

  const createOffer = useCallback(
    async ({
      type,
      quantity,
      unitPrice,
      assetId,
      currencyId,
      takerAddress,
      expiredAt,
      auctionId,
    }: {
      type: OfferType
      quantity: BigNumber
      unitPrice: BigNumber
      assetId: string
      currencyId: string
      takerAddress?: string
      expiredAt: Date | null
      auctionId?: string
    }): Promise<string> => {
      invariant(signer, ErrorMessages.SIGNER_FALSY)
      const account = await signer.getAddress()

      try {
        // approval if needed
        setActiveProcess(CreateOfferStep.APPROVAL_SIGNATURE)
        if (type === 'SALE') {
          // fetch asset
          const { asset } = await sdk.FetchAssetForOffer({ assetId })
          invariant(asset, ErrorMessages.OFFER_CREATION_FAILED)
          // creating a new offer of type sale, approval is on the asset
          await approveCollection({
            chainId: asset.chainId,
            collectionAddress: asset.collectionAddress,
          })
        } else {
          // creating a new offer of type buy, approval is on the currency
          await approveCurrency({
            currencyId,
            amount: quantity.mul(unitPrice),
          })
        }

        // fetch offer signature
        setActiveProcess(CreateOfferStep.SIGNATURE)
        const offer = {
          type,
          makerAddress: account.toLowerCase(),
          assetId: assetId,
          currencyId: currencyId,
          quantity: quantity.toString(),
          unitPrice: unitPrice.toString(),
          takerAddress: takerAddress?.toLowerCase() || null,
          auctionId: auctionId || null,
          expiredAt: expiredAt,
        }
        const { createOfferSignature } = await sdk.CreateOfferSignature({
          offer,
        })
        const { eip712Data, timestamp, salt } = createOfferSignature

        // sign data
        const { domain, types, message /*, primaryType */ } = eip712Data
        delete types.EIP712Domain // Hack: remove primary type from types to allow ethers detect the main type "Order" (aka: primaryType)
        const signature = await signer._signTypedData(domain, types, message)

        // create offer
        const { createOffer } = await sdk.CreateOffer({
          offer,
          signature,
          salt,
          timestamp,
        })
        return createOffer.offer.id
      } finally {
        setActiveProcess(CreateOfferStep.INITIAL)
      }
    },
    [approveCollection, approveCurrency, sdk, signer],
  )

  return [
    createOffer,
    {
      activeStep,
      transactionHash:
        approveCurrencyTransactionHash || approveCollectionTransactionHash,
    },
  ]
}

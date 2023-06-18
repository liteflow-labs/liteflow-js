import { Signer, TypedDataSigner } from '@ethersproject/abstract-signer'
import { BigNumber } from '@ethersproject/bignumber'
import { TransactionHash, toAddress } from '@liteflow/core'
import { gql } from 'graphql-request'
import { useCallback, useContext, useState } from 'react'
import invariant from 'ts-invariant'
import { LiteflowContext } from './context'
import { ErrorMessages } from './errorMessages'
import { OfferType } from './graphql'

gql`
  query FetchAssetForOffer($assetId: String!, $currencyId: String!) {
    asset(id: $assetId) {
      chainId
      collectionAddress
      tokenId
    }
    currency(id: $currencyId) {
      chainId
      address
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
  const { sdk, client } = useContext(LiteflowContext)
  const [activeStep, setActiveProcess] = useState<CreateOfferStep>(
    CreateOfferStep.INITIAL,
  )
  const [transactionHash, setTransactionHash] = useState<TransactionHash>()

  const updateProgress = useCallback(
    ({ type, payload }) => {
      if (type === 'APPROVAL_SIGNATURE')
        setActiveProcess(CreateOfferStep.APPROVAL_SIGNATURE)
      if (type === 'APPROVAL_PENDING') {
        setActiveProcess(CreateOfferStep.APPROVAL_PENDING)
        setTransactionHash(payload.txHash)
      }
      if (type === 'OFFER_SIGNATURE')
        setActiveProcess(CreateOfferStep.SIGNATURE)
    },
    [setActiveProcess, setTransactionHash],
  )

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
      setActiveProcess(CreateOfferStep.INITIAL)
      try {
        invariant(signer, ErrorMessages.SIGNER_FALSY)
        const { asset, currency } = await sdk.FetchAssetForOffer({
          assetId,
          currencyId,
        })
        invariant(asset, ErrorMessages.OFFER_CREATION_FAILED)
        invariant(currency, ErrorMessages.OFFER_CREATION_FAILED)

        const offer = {
          chain: asset.chainId,
          collection: toAddress(asset.collectionAddress),
          token: asset.tokenId,
          quantity: quantity,
          takerAddress: takerAddress ? toAddress(takerAddress) : undefined,
          expiredAt: expiredAt || undefined,
        }

        if (type === 'SALE')
          return client.exchange.listToken(
            {
              ...offer,
              unitPrice: {
                amount: unitPrice,
                currency: currency.address ? toAddress(currency.address) : null,
              },
            },
            signer,
            updateProgress,
          )
        if (type === 'BUY') {
          invariant(currency.address)
          return client.exchange.placeBid(
            {
              ...offer,
              unitPrice: {
                amount: unitPrice,
                currency: toAddress(currency.address),
              },
              auctionId,
            },
            signer,
            updateProgress,
          )
        }

        throw new Error(ErrorMessages.OFFER_CREATION_FAILED)
      } finally {
        setActiveProcess(CreateOfferStep.INITIAL)
      }
    },
    [sdk, signer, client, setActiveProcess, updateProgress],
  )

  return [createOffer, { activeStep, transactionHash }]
}

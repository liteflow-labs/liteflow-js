import { Signer, TypedDataSigner } from '@ethersproject/abstract-signer'
import { BigNumber } from '@ethersproject/bignumber'
import { gql } from 'graphql-request'
import { useCallback, useContext, useState } from 'react'
import invariant from 'ts-invariant'
import { LiteflowContext } from './context'
import { ErrorMessages } from './errorMessages'
import { OfferType, TransactionFragment } from './graphql'
import { convertTx } from './utils/transaction'

gql`
  mutation CreateOffer(
    $input: OfferInputBis!
    $makerAddress: Address!
    $amount: Uint256!
  ) {
    createOffer(input: { offer: $input }) {
      offer {
        id
        eip712Data
        asset {
          token {
            __typename
            ... on ERC721 {
              approval(account: $makerAddress) {
                ...Transaction
              }
            }
            ... on ERC1155 {
              approval(account: $makerAddress) {
                ...Transaction
              }
            }
          }
        }
        currency {
          approval(account: $makerAddress, amount: $amount) {
            ...Transaction
          }
        }
      }
    }
  }
`

gql`
  mutation PublishOffer($offerId: UUID!, $signature: String!) {
    publishOffer(input: { id: $offerId, signature: $signature }) {
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
  const [transactionHash, setTransactionHash] = useState<string>()
  const [activeStep, setActiveProcess] = useState<CreateOfferStep>(
    CreateOfferStep.INITIAL,
  )

  const createAndPublishOffer = useCallback(
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
        const { createOffer } = await sdk.CreateOffer({
          input: {
            type,
            makerAddress: account.toLowerCase(),
            assetId: assetId,
            currencyId: currencyId,
            quantity: quantity.toString(),
            unitPrice: unitPrice.toString(),
            takerAddress: takerAddress?.toLowerCase() || null,
            auctionId: auctionId || null,
            expiredAt: expiredAt,
          },
          makerAddress: account.toLowerCase(),
          amount: quantity.mul(unitPrice).toString(),
        })
        invariant(createOffer?.offer, ErrorMessages.OFFER_CREATION_FAILED)
        const { id: offerId, eip712Data, asset, currency } = createOffer.offer

        setActiveProcess(CreateOfferStep.APPROVAL_SIGNATURE)
        let approval: TransactionFragment | null
        if (type === 'SALE') {
          // creating a new offer of type sale, approval is on the asset
          approval = // typescript check
            asset.token.__typename === 'ERC721' ||
            asset.token.__typename === 'ERC1155'
              ? asset.token.approval
              : null
        } else {
          // creating a new offer of type buy, approval is on the currency
          approval = currency.approval
        }
        if (approval) {
          try {
            // must authorize operator by executing a transaction
            console.info(`must authorized operator first`)
            const tx = await signer.sendTransaction(convertTx(approval))
            setActiveProcess(CreateOfferStep.APPROVAL_PENDING)
            setTransactionHash(tx.hash)
            console.info(`waiting for transaction with hash ${tx.hash}...`)
            await tx.wait()
            console.info(`transaction validated`)
          } finally {
            setTransactionHash(undefined)
          }
        }

        setActiveProcess(CreateOfferStep.SIGNATURE)
        // sign data
        const { domain, types, message /*, primaryType */ } = eip712Data
        delete types.EIP712Domain // Hack: remove primary type from types to allow ethers detect the main type "Order" (aka: primaryType)
        const signature = await signer._signTypedData(domain, types, message)

        // send signature to api
        const { publishOffer } = await sdk.PublishOffer({
          offerId,
          signature,
        })
        invariant(publishOffer?.offer, ErrorMessages.OFFER_CREATION_FAILED)
        return publishOffer.offer.id
      } finally {
        setActiveProcess(CreateOfferStep.INITIAL)
      }
    },
    [sdk, signer],
  )

  return [createAndPublishOffer, { activeStep, transactionHash }]
}

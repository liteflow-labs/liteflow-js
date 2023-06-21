import { Signer } from '@ethersproject/abstract-signer'
import { toAddress } from '@liteflow/core'
import { useCallback, useContext, useState } from 'react'
import invariant from 'ts-invariant'
import { LiteflowContext } from './context'
import { ErrorMessages } from './errorMessages'

type AuctionInput = {
  assetId: string
  endAt: Date
  auctionValiditySeconds: number
  reserveAmount: string
  currencyId: string
}

export default function useCreateAuction(
  signer: Signer | undefined,
): [(input: AuctionInput) => Promise<string>, { loading: boolean }] {
  const { sdk, client } = useContext(LiteflowContext)
  const [loading, setLoading] = useState(false)
  const createAuctionFn = useCallback(
    async (input: AuctionInput): Promise<string> => {
      invariant(signer, ErrorMessages.SIGNER_FALSY)
      setLoading(true)

      try {
        const { asset, currency } = await sdk.FetchAssetForOffer({
          assetId: input.assetId,
          currencyId: input.currencyId,
        })
        invariant(asset, ErrorMessages.OFFER_CREATION_FAILED)
        invariant(currency, ErrorMessages.OFFER_CREATION_FAILED)
        invariant(currency.address, ErrorMessages.OFFER_CREATION_FAILED)

        const auctionId = await client.exchange.createAuction(
          {
            chain: asset.chainId,
            collection: toAddress(asset.collectionAddress),
            token: asset.tokenId,
            reservePrice: {
              amount: input.reserveAmount,
              currency: toAddress(currency.address),
            },
            endAt: input.endAt,
            expiredAt: new Date(
              new Date(input.endAt).getTime() +
                input.auctionValiditySeconds * 1000,
            ),
          },
          signer,
        )
        return auctionId
      } finally {
        setLoading(false)
      }
    },
    [sdk, client, signer],
  )
  return [createAuctionFn, { loading }]
}

import { Signer } from '@ethersproject/abstract-signer'
import { gql } from 'graphql-request'
import { useCallback, useContext, useState } from 'react'
import invariant from 'ts-invariant'
import { LiteflowContext } from './context'
import { ErrorMessages } from './errorMessages'

gql`
  mutation CreateAuction($createAuctionInput: AuctionInput!) {
    createAuction(input: { auction: $createAuctionInput }) {
      auction {
        id
      }
    }
  }
`

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
  const { sdk } = useContext(LiteflowContext)
  const [loading, setLoading] = useState(false)
  const createAuctionFn = useCallback(
    async (input: AuctionInput): Promise<string> => {
      invariant(signer, ErrorMessages.SIGNER_FALSY)
      try {
        setLoading(true)
        const account = await signer.getAddress()
        const { createAuction } = await sdk.CreateAuction({
          createAuctionInput: {
            assetId: input.assetId,
            endAt: input.endAt,
            reserveAmount: input.reserveAmount,
            currencyId: input.currencyId,
            creatorAddress: account.toLowerCase(),
            expireAt: new Date(
              new Date(input.endAt).getTime() +
                input.auctionValiditySeconds * 1000,
            ),
          },
        })
        invariant(
          createAuction?.auction?.id,
          ErrorMessages.AUCTION_CREATION_FAILED,
        )
        return createAuction.auction.id
      } finally {
        setLoading(false)
      }
    },
    [sdk, signer],
  )
  return [createAuctionFn, { loading }]
}

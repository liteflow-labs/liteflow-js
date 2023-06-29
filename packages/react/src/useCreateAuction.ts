import { Signer } from '@ethersproject/abstract-signer'
import { Address, ChainId, PriceERC20 } from '@liteflow/core'
import { useCallback, useContext, useState } from 'react'
import invariant from 'ts-invariant'
import { LiteflowContext } from './context'
import { ErrorMessages } from './errorMessages'

type AuctionInput = {
  chain: ChainId
  collection: Address
  token: string
  endAt: Date
  auctionValiditySeconds: number
  reservePrice: PriceERC20
}

export default function useCreateAuction(
  signer: Signer | undefined,
): [(input: AuctionInput) => Promise<string>, { loading: boolean }] {
  const { client } = useContext(LiteflowContext)
  const [loading, setLoading] = useState(false)
  const createAuctionFn = useCallback(
    async (input: AuctionInput): Promise<string> => {
      invariant(signer, ErrorMessages.SIGNER_FALSY)
      setLoading(true)

      try {
        const auctionId = await client.exchange.createAuction(
          {
            chain: input.chain,
            collection: input.collection,
            token: input.token,
            reservePrice: input.reservePrice,
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
    [client, signer],
  )
  return [createAuctionFn, { loading }]
}

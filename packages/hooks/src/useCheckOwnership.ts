import { BigNumber } from '@ethersproject/bignumber'
import { gql } from 'graphql-request'
import { useCallback, useContext } from 'react'
import invariant from 'ts-invariant'
import { LiteflowContext } from './context'
import { ErrorMessages } from './errorMessages'

gql`
  query CheckOwnership(
    $chainId: Int!
    $collectionAddress: Address!
    $tokenId: String!
    $ownerAddress: Address!
  ) {
    ownerships(
      condition: {
        chainId: $chainId
        collectionAddress: $collectionAddress
        tokenId: $tokenId
        ownerAddress: $ownerAddress
      }
      first: 1
    ) {
      nodes {
        quantity
      }
    }
  }
`

export type CheckOwnershipFunction = (
  chainId: number,
  collectionAddress: string,
  tokenId: string,
  ownerAddress: string,
) => Promise<{ isOwner: boolean; quantity: string }>

export default function useCheckOwnership(): {
  checkOwnership: CheckOwnershipFunction
  pollOwnership: (config: {
    chainId: number
    collectionAddress: string
    tokenId: string
    ownerAddress: string
    initialQuantity: string
    max?: number
    interval?: number
  }) => Promise<void>
} {
  const { sdk } = useContext(LiteflowContext)
  const checkOwnership = useCallback<CheckOwnershipFunction>(
    async (
      chainId: number,
      collectionAddress: string,
      tokenId: string,
      ownerAddress: string,
    ) => {
      const { ownerships } = await sdk.CheckOwnership({
        chainId,
        collectionAddress,
        tokenId,
        ownerAddress: ownerAddress.toLowerCase(),
      })
      invariant(ownerships, ErrorMessages.OWNERSHIP_NOT_FOUND)
      if (ownerships.nodes[0]) {
        return {
          isOwner: true,
          quantity: ownerships.nodes[0].quantity,
        }
      }
      return {
        isOwner: false,
        quantity: '0',
      }
    },
    [sdk],
  )

  const pollOwnership = useCallback(
    async ({
      chainId,
      collectionAddress,
      tokenId,
      ownerAddress,
      initialQuantity,
      max,
      interval,
    }: {
      chainId: number
      collectionAddress: string
      tokenId: string
      ownerAddress: string
      initialQuantity: string
      max?: number
      interval?: number
    }) => {
      if (!max) max = 120
      if (!interval) interval = 5000
      // poll the api until the ownership is updated
      let i = 0
      while (i < max) {
        // fetch
        const { quantity } = await checkOwnership(
          chainId,
          collectionAddress,
          tokenId,
          ownerAddress,
        )

        // check if quantity changed compared to the initial one
        if (!BigNumber.from(quantity).eq(BigNumber.from(initialQuantity))) break

        // wait
        await new Promise((resolve) => setTimeout(resolve, interval))
        i++
      }
      invariant(i !== max - 1, ErrorMessages.POLLING_TIMEOUT)
    },
    [checkOwnership],
  )

  return { checkOwnership, pollOwnership }
}

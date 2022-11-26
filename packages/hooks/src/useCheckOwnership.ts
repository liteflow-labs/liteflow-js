import { BigNumber } from '@ethersproject/bignumber'
import { gql } from 'graphql-request'
import { useCallback, useContext } from 'react'
import invariant from 'ts-invariant'
import { LiteflowContext } from './context'
import { ErrorMessages } from './errorMessages'

gql`
  query CheckOwnership($assetId: String!, $ownerAddress: Address!) {
    ownerships(
      condition: { assetId: $assetId, ownerAddress: $ownerAddress }
      first: 1
    ) {
      nodes {
        quantity
      }
    }
  }
`

export type CheckOwnershipFunction = (
  assetId: string,
  ownerAddress: string,
) => Promise<{ isOwner: boolean; quantity: string }>

export default function useCheckOwnership(): {
  checkOwnership: CheckOwnershipFunction
  pollOwnership: (config: {
    assetId: string
    ownerAddress: string
    initialQuantity: string
    max?: number
    interval?: number
  }) => Promise<void>
}[] {
  const { sdk } = useContext(LiteflowContext)
  const checkOwnership = useCallback<CheckOwnershipFunction>(
    async (assetId: string, ownerAddress: string) => {
      const { ownerships } = await sdk.CheckOwnership({
        assetId,
        ownerAddress: ownerAddress.toLowerCase(),
      })
      invariant(ownerships, ErrorMessages.OWNERSHIP_NOT_FOUND)
      if (ownerships.nodes.length === 0)
        return {
          isOwner: false,
          quantity: '0',
        }
      return {
        isOwner: true,
        quantity: ownerships.nodes[0].quantity,
      }
    },
    [sdk],
  )

  const pollOwnership = useCallback(
    async ({
      assetId,
      ownerAddress,
      initialQuantity,
      max,
      interval,
    }: {
      assetId: string
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
        const { quantity } = await checkOwnership(assetId, ownerAddress)

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

  return [{ checkOwnership, pollOwnership }]
}

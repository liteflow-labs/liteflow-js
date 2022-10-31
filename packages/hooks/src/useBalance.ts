import { BigNumber } from '@ethersproject/bignumber'
import { gql } from 'graphql-request'
import { useCallback, useContext, useEffect, useState } from 'react'
import { LiteflowContext } from './context'

gql`
  query FetchBalance($currencyId: String!, $account: Address!) {
    currency(id: $currencyId) {
      balanceOf(account: $account)
    }
  }
`

// Hook to fetch the user's balance of an currency type ERC20
export default function useBalance(
  account: string | null | undefined,
  currencyId: string | null,
): [
  BigNumber | undefined,
  {
    loading: boolean
    refetch: () => Promise<BigNumber | undefined>
  },
] {
  const { sdk } = useContext(LiteflowContext)
  const [balance, setBalance] = useState<BigNumber>()
  const [loading, setLoading] = useState(false)
  const refetch = useCallback(async () => {
    if (!account) return
    if (!currencyId) return
    try {
      setLoading(true)
      const { currency } = await sdk.FetchBalance({
        currencyId: currencyId,
        account: account.toLowerCase(),
      })
      if (!currency) return
      const res = BigNumber.from(currency.balanceOf)
      setBalance(res)
      return res
    } finally {
      setLoading(false)
    }
  }, [sdk, currencyId, account])

  useEffect(() => {
    void refetch()
    return () => setBalance(undefined)
  }, [refetch])

  return [balance, { loading, refetch }]
}

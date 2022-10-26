import { Account, WalletAccount, wrapServerSideProps } from '@nft/components'
import { useSession } from '@nft/hooks'
import { GetServerSideProps } from 'next'
import React, { useMemo, VFC } from 'react'
import {
  useWalletCurrenciesQuery,
  WalletCurrenciesDocument,
  WalletCurrenciesQuery,
} from '../graphql'
import useLoginRedirect from '../hooks/useLoginRedirect'

export type Props = {
  currencies: {
    name: string
    id: string
    image: string
    decimals: number
    symbol: string
  }[]
}

export const server = (url: string): GetServerSideProps<Props> =>
  wrapServerSideProps<Props>(url, async (_, client) => {
    const { data, error } = await client.query<WalletCurrenciesQuery>({
      query: WalletCurrenciesDocument,
    })
    if (error) throw error
    if (!data.currencies?.nodes) return { notFound: true }
    return { props: { currencies: data.currencies.nodes } }
  })

export const Template: VFC<{
  networkName: string
}> = ({ networkName }) => {
  const { account } = useSession()
  useLoginRedirect()
  const { data } = useWalletCurrenciesQuery()
  const currencies = useMemo(() => data?.currencies?.nodes, [data])

  if (!currencies) return <></>
  if (!account) return <></>
  return (
    <Account currentTab="wallet">
      <WalletAccount
        account={account}
        currencies={currencies}
        networkName={networkName}
      />
    </Account>
  )
}

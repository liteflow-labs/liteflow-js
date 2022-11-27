import { Account, WalletAccount, wrapServerSideProps } from '@nft/components'
import { useSession } from '@nft/hooks'
import { GetServerSideProps } from 'next'
import React, { useMemo, VFC } from 'react'
import {
  useWalletCurrenciesQuery,
  WalletCurrenciesDocument,
  WalletCurrenciesQuery,
} from '../graphql'
import useEagerConnect from '../hooks/useEagerConnect'
import useLoginRedirect from '../hooks/useLoginRedirect'

export type Props = {
  currentAccount: string | null
}

export const server = (url: string): GetServerSideProps<Props> =>
  wrapServerSideProps<Props>(url, async (context, client) => {
    const { data, error } = await client.query<WalletCurrenciesQuery>({
      query: WalletCurrenciesDocument,
    })
    if (error) throw error
    if (!data.currencies?.nodes) return { notFound: true }
    return {
      props: {
        currentAccount: context.user.address,
      },
    }
  })

export const Template: VFC<
  Props & {
    networkName: string
  }
> = ({ networkName, currentAccount }) => {
  const { account, connectors } = useSession()
  const ready = useEagerConnect(connectors, currentAccount)
  useLoginRedirect(ready)
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

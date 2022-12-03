import { Signer } from '@ethersproject/abstract-signer'
import { Text } from '@chakra-ui/react'
import { TokenGrid } from '@nft/components'
import { useSession } from '@nft/hooks'
import { GetServerSideProps, NextPage } from 'next'
import Trans from 'next-translate/Trans'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import React, { useCallback, useMemo } from 'react'
import invariant from 'ts-invariant'
import {
  AssetDetailFragment,
  FetchOwnedAssetsDocument,
  FetchOwnedAssetsQuery,
  OwnershipsOrderBy,
  useFetchOwnedAssetsQuery,
} from '../graphql'
import useExecuteOnAccountChange from '../hooks/useExecuteOnAccountChange'
import usePaginate from '../hooks/usePaginate'
import {
  convertAsset,
  convertAuctionWithBestBid,
  convertFullUser,
  convertSale,
  convertUser,
} from '../utils/convert'
import { getLimit, getOffset, getOrder, getPage } from '../utils/params'
import UserProfileTemplate from './Profile'
import { wrapServerSideProps } from '../props'

export type Props = {
  userAddress: string
  now: string
  // Pagination
  limit: number
  page: number
  offset: number
  // OrderBy
  orderBy: OwnershipsOrderBy
  meta: {
    title: string
    description: string
    image: string
  }
  loginUrlForReferral?: string
}

export const server = (
  url: string,
  defaultLimit: number,
): GetServerSideProps<Props> =>
  wrapServerSideProps<Props>(url, async (ctx, client) => {
    const userAddress = ctx.params?.id
      ? Array.isArray(ctx.params.id)
        ? ctx.params.id[0].toLowerCase()
        : ctx.params.id.toLowerCase()
      : null
    invariant(userAddress, 'userAddress is falsy')

    const limit = getLimit(ctx, defaultLimit)
    const page = getPage(ctx)
    const orderBy = getOrder<OwnershipsOrderBy>(ctx, 'CREATED_AT_DESC')
    const offset = getOffset(ctx, defaultLimit)

    const now = new Date()
    const { data, error } = await client.query<FetchOwnedAssetsQuery>({
      query: FetchOwnedAssetsDocument,
      variables: {
        address: userAddress.toLowerCase(),
        now,
        limit,
        offset,
        orderBy,
      },
    })
    if (error) throw error
    if (!data) throw new Error('data is falsy')
    return {
      props: {
        userAddress,
        now: now.toJSON(),
        limit,
        page,
        offset,
        orderBy,
        meta: {
          title: data.account?.name || userAddress,
          description: data.account?.description || '',
          image: data.account?.image || '',
        },
      },
    }
  })

export const Template: NextPage<
  Omit<Props, 'meta'> & {
    limits: number[]
    signer: Signer | undefined
    ready: boolean
  }
> = ({
  now,
  limit,
  limits,
  page,
  offset,
  orderBy,
  userAddress,
  loginUrlForReferral,
  ready,
  signer,
}) => {
  const { t } = useTranslation('templates')
  const { pathname, replace, query } = useRouter()
  const [changePage, changeLimit] = usePaginate()
  const { account } = useSession()

  const date = useMemo(() => new Date(now), [now])
  const { data, refetch } = useFetchOwnedAssetsQuery({
    variables: {
      address: userAddress,
      limit,
      offset,
      orderBy,
      now: date,
    },
  })
  useExecuteOnAccountChange(refetch, ready)

  const userAccount = useMemo(
    () => convertFullUser(data?.account || null, userAddress),
    [data, userAddress],
  )

  const changeOrder = useCallback(
    async (orderBy: any) => {
      await replace({ pathname, query: { ...query, orderBy } })
    },
    [replace, pathname, query],
  )

  const assets = useMemo(
    () =>
      (data?.owned?.nodes || [])
        .map((x) => x.asset)
        .filter((x): x is AssetDetailFragment => !!x)
        .map((x) => ({
          ...convertAsset(x),
          auction: x.auctions?.nodes[0]
            ? convertAuctionWithBestBid(x.auctions.nodes[0])
            : undefined,
          creator: convertUser(x.creator, x.creator.address),
          sale: convertSale(x.firstSale?.nodes[0]),
          numberOfSales: x.firstSale.totalCount,
          hasMultiCurrency:
            parseInt(
              x.currencySales.aggregates?.distinctCount?.currencyId,
              10,
            ) > 1,
        })),
    [data],
  )

  if (!assets) return <></>
  if (!data) return <></>
  return (
    <UserProfileTemplate
      signer={signer}
      currentAccount={account}
      account={userAccount}
      currentTab="owned"
      totals={
        new Map([
          ['created', data.created?.totalCount || 0],
          ['on-sale', data.onSale?.totalCount || 0],
          ['owned', data.owned?.totalCount || 0],
        ])
      }
      loginUrlForReferral={loginUrlForReferral}
    >
      <TokenGrid<OwnershipsOrderBy>
        assets={assets}
        orderBy={{
          value: orderBy,
          choices: [
            {
              label: t('user.owned-assets.orderBy.values.createdAtDesc'),
              value: 'CREATED_AT_DESC',
            },
            {
              label: t('user.owned-assets.orderBy.values.createdAtAsc'),
              value: 'CREATED_AT_ASC',
            },
          ],
          onSort: changeOrder,
        }}
        pagination={{
          limit,
          limits,
          page,
          total: data.owned?.totalCount || 0,
          onPageChange: changePage,
          onLimitChange: changeLimit,
          result: {
            label: t('pagination.result.label'),
            caption: (props) => (
              <Trans
                ns="templates"
                i18nKey="pagination.result.caption"
                values={props}
                components={[<Text as="span" color="brand.black" />]}
              />
            ),
            pages: (props) =>
              t('pagination.result.pages', { count: props.total }),
          },
        }}
      />
    </UserProfileTemplate>
  )
}

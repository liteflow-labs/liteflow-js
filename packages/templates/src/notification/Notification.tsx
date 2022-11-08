import { Button, Heading, Icon, Stack, Text } from '@chakra-ui/react'
import { Empty, Notification, wrapServerSideProps } from '@nft/components'
import { FaBell } from '@react-icons/all-files/fa/FaBell'
import { useWeb3React } from '@web3-react/core'
import { GetServerSideProps } from 'next'
import useTranslation from 'next-translate/useTranslation'
import React, { useCallback, useEffect, useMemo, useState, VFC } from 'react'
import { useCookies } from 'react-cookie'
import {
  GetNotificationsDocument,
  GetNotificationsQuery,
  useGetNotificationsQuery,
} from '../graphql'
import useLoginRedirect from '../hooks/useLoginRedirect'
import { concatToQuery } from '../utils/concat'

export type Props = {
  address: string
}

export const server = (url: string): GetServerSideProps<Props> =>
  wrapServerSideProps<Props>(url, async (ctx, client) => {
    const address = ctx.user.address
    if (!address) return { props: { address: '' } }

    const { data, error } = await client.query<GetNotificationsQuery>({
      query: GetNotificationsDocument,
      variables: {
        cursor: null,
        address,
      },
    })
    if (error) throw error
    if (!data.notifications) return { notFound: true }
    return {
      props: {
        address,
      },
    }
  })

export const Template: VFC<
  Props & {
    userHasBeenReconnected: boolean
  }
> = ({ address, userHasBeenReconnected }) => {
  const { t } = useTranslation('templates')
  useLoginRedirect(userHasBeenReconnected)
  const { account } = useWeb3React()
  const [_, setCookies] = useCookies()
  const [loading, setLoading] = useState(false)

  const { data, fetchMore } = useGetNotificationsQuery({
    variables: {
      cursor: null,
      address,
    },
  })

  const notifications = useMemo(() => data?.notifications?.nodes || [], [data])

  const hasNextPage = useMemo(
    () => data?.notifications?.pageInfo.hasNextPage,
    [data],
  )

  const loadMore = useCallback(async () => {
    setLoading(true)
    try {
      await fetchMore({
        variables: { cursor: data?.notifications?.pageInfo.endCursor },
        updateQuery: concatToQuery('notifications'),
      })
    } finally {
      setLoading(false)
    }
  }, [data, fetchMore])

  useEffect(() => {
    if (!account) return
    setCookies(`lastNotification-${account}`, new Date().toJSON(), {
      secure: true,
      sameSite: true,
      path: '/',
    })
  }, [account, setCookies])

  return (
    <>
      <Heading as="h1" variant="title" color="brand.black">
        {t('notifications.title')}
      </Heading>
      <Stack spacing={6} mt={12}>
        {(notifications || []).length > 0 ? (
          <>
            {notifications.map((notification) => (
              <Notification key={notification.id} {...notification} />
            ))}
            {hasNextPage && (
              <Button isLoading={loading} onClick={loadMore}>
                <Text as="span" isTruncated>
                  {t('notifications.loadMore')}
                </Text>
              </Button>
            )}
          </>
        ) : (
          <Empty
            icon={<Icon as={FaBell} color="brand.500" h={9} w={9} />}
            title={t('notifications.empty.title')}
            description={t('notifications.empty.description')}
          />
        )}
      </Stack>
    </>
  )
}

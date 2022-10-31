import {
  Box,
  Flex,
  IconButton,
  Stack,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import {
  Image,
  Link,
  Pagination,
  Price,
  Select,
  wrapServerSideProps,
} from '@nft/components'
import { dateFromNow, formatAddress, useSession } from '@nft/hooks'
import { HiExternalLink } from '@react-icons/all-files/hi/HiExternalLink'
import { GetServerSideProps } from 'next'
import Trans from 'next-translate/Trans'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import React, { useCallback, useMemo, VFC } from 'react'
import invariant from 'ts-invariant'
import {
  FetchUserTradePurchasedDocument,
  FetchUserTradePurchasedQuery,
  TradesOrderBy,
  useFetchUserTradePurchasedQuery,
} from '../graphql'
import useBlockExplorer from '../hooks/useBlockExplorer'
import usePaginate from '../hooks/usePaginate'
import { convertFullUser, convertTrade } from '../utils/convert'
import { getLimit, getOffset, getOrder, getPage } from '../utils/params'
import UserProfileTemplate from './Profile'

export type Props = {
  userAddress: string
  now: string
  page: number
  limit: number
  offset: number
  orderBy: TradesOrderBy
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
  wrapServerSideProps<Props>(url, async (context, client) => {
    const userAddress = context.params?.id
      ? Array.isArray(context.params.id)
        ? context.params.id[0].toLowerCase()
        : context.params.id.toLowerCase()
      : null
    invariant(userAddress, 'userAddress is falsy')
    const limit = getLimit(context, defaultLimit)
    const page = getPage(context)
    const orderBy = getOrder<TradesOrderBy>(context, 'TIMESTAMP_DESC')
    const offset = getOffset(context, defaultLimit)
    const now = new Date()
    const { data, error } = await client.query<FetchUserTradePurchasedQuery>({
      query: FetchUserTradePurchasedDocument,
      variables: {
        limit,
        offset,
        orderBy,
        address: userAddress,
        now,
      },
    })
    if (error) throw error
    if (!data.trades) return { notFound: true }
    return {
      props: {
        page,
        limit,
        offset,
        orderBy,
        userAddress,
        now: now.toJSON(),
        meta: {
          title: data.account?.name || userAddress,
          description: data.account?.description || '',
          image: data.account?.image || '',
        },
      },
    }
  })

export const Template: VFC<
  Omit<Props, 'meta'> & {
    limits: number[]
    explorer: {
      name: string
      url: string
    }
  }
> = ({
  explorer,
  limit,
  limits,
  now,
  offset,
  orderBy,
  page,
  userAddress,
  loginUrlForReferral,
}) => {
  const { t } = useTranslation('templates')
  const { replace, pathname, query } = useRouter()
  const [changePage, changeLimit] = usePaginate()
  const { account, signer } = useSession()
  const blockExplorer = useBlockExplorer(explorer.name, explorer.url)

  const date = useMemo(() => new Date(now), [now])
  const { data } = useFetchUserTradePurchasedQuery({
    variables: {
      address: userAddress,
      limit,
      offset,
      orderBy,
      now: date,
    },
  })

  const userAccount = useMemo(
    () => convertFullUser(data?.account || null, userAddress),
    [data, userAddress],
  )

  const trades = useMemo(
    () => (data?.trades?.nodes || []).map(convertTrade),
    [data],
  )

  const changeOrder = useCallback(
    async (orderBy: any) => {
      await replace({ pathname, query: { ...query, orderBy } })
    },
    [replace, pathname, query],
  )

  return (
    <UserProfileTemplate
      signer={signer}
      currentAccount={account}
      account={userAccount}
      currentTab="trades"
      totals={
        new Map([
          ['created', data?.created?.totalCount || 0],
          ['on-sale', data?.onSale?.totalCount || 0],
          ['owned', data?.owned?.totalCount || 0],
        ])
      }
      loginUrlForReferral={loginUrlForReferral}
    >
      <Stack spacing={6}>
        <Flex
          justify={{ md: 'space-between' }}
          align={{ md: 'center' }}
          gap={4}
          direction={{ base: 'column', md: 'row' }}
        >
          <Flex as="nav" gap={2}>
            <Link href={`/users/${userAddress}/trades`}>
              <Tag
                size="lg"
                variant="outline"
                borderRadius="full"
                boxShadow="none"
                border="1px"
                borderColor="gray.200"
                _hover={{
                  bgColor: 'gray.100',
                }}
              >
                <Text as="span" variant="text-sm" color="brand.black">
                  {t('user.trade-purchased.nav.sold')}
                </Text>
              </Tag>
            </Link>
            <Link href={`/users/${userAddress}/trades/purchased`}>
              <Tag
                size="lg"
                colorScheme="brand"
                border="1px"
                borderColor="brand.500"
                borderRadius="full"
              >
                <Text as="span" variant="text-sm" color="brand.600">
                  {t('user.trade-purchased.nav.purchased')}
                </Text>
              </Tag>
            </Link>
          </Flex>
          <Box ml="auto" w={{ base: 'full', md: 'min-content' }}>
            <Select<TradesOrderBy>
              label={t('user.trade-purchased.orderBy.label')}
              name="Sort by"
              onChange={changeOrder}
              choices={[
                {
                  label: t('user.trade-purchased.orderBy.values.timestampDesc'),
                  value: 'TIMESTAMP_DESC',
                },
                {
                  label: t('user.trade-purchased.orderBy.values.timestampAsc'),
                  value: 'TIMESTAMP_ASC',
                },
                {
                  label: t('user.trade-purchased.orderBy.values.amountAsc'),
                  value: 'AMOUNT_IN_REF_ASC',
                },
                {
                  label: t('user.trade-purchased.orderBy.values.amountDesc'),
                  value: 'AMOUNT_IN_REF_DESC',
                },
              ]}
              value={orderBy}
              inlineLabel
            />
          </Box>
        </Flex>

        <TableContainer bg="white" shadow="base" rounded="lg">
          <Table>
            <Thead>
              <Tr>
                <Th>{t('user.trade-purchased.table.item')}</Th>
                <Th isNumeric>{t('user.trade-purchased.table.price')}</Th>
                <Th>{t('user.trade-purchased.table.from')}</Th>
                <Th>{t('user.trade-purchased.table.created')}</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {trades.map((item, index) => (
                <Tr fontSize="sm" key={index}>
                  <Td>
                    {item.asset ? (
                      <Flex gap={3}>
                        <Image
                          src={item.asset.image}
                          alt={item.asset.name}
                          width={40}
                          height={40}
                          layout="fixed"
                          objectFit="cover"
                          rounded="full"
                          h={10}
                          w={10}
                        />
                        <Flex
                          direction="column"
                          my="auto"
                          title={item.asset.name}
                        >
                          <Text as="span" noOfLines={1}>
                            {item.asset.name}
                          </Text>
                          {item.quantity.gt(1) && (
                            <Text as="span" variant="caption" color="gray.500">
                              {t('user.trade-purchased.purchased', {
                                value: item.quantity.toString(),
                              })}
                            </Text>
                          )}
                        </Flex>
                      </Flex>
                    ) : (
                      '-'
                    )}
                  </Td>
                  <Td isNumeric>
                    {item.currency ? (
                      <Text
                        as={Price}
                        noOfLines={1}
                        amount={item.amount}
                        currency={item.currency}
                      />
                    ) : (
                      '-'
                    )}
                  </Td>
                  <Td>{formatAddress(item.sellerAddress)}</Td>
                  <Td>{dateFromNow(item.createdAt)}</Td>
                  <Td>
                    <IconButton
                      aria-label="external link"
                      as={Link}
                      href={
                        blockExplorer.transaction(item.transactionHash) || '#'
                      }
                      isExternal
                      variant="outline"
                      colorScheme="gray"
                      rounded="full"
                    >
                      <HiExternalLink />
                    </IconButton>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>

        <Pagination
          limit={limit}
          limits={limits}
          onLimitChange={changeLimit}
          onPageChange={changePage}
          page={page}
          total={data?.trades?.totalCount || 0}
          result={{
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
          }}
        />
      </Stack>
    </UserProfileTemplate>
  )
}

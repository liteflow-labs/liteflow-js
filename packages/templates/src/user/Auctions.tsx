import { Signer } from '@ethersproject/abstract-signer'
import {
  Box,
  Flex,
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
  useToast,
} from '@chakra-ui/react'
import {
  Image,
  Link,
  Pagination,
  Price,
  SaleAuctionAction,
  SaleAuctionStatus,
  Select,
} from '@nft/components'
import { dateFromNow, formatError, useIsLoggedIn, useSession } from '@nft/hooks'
import { GetServerSideProps } from 'next'
import Trans from 'next-translate/Trans'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import React, { useCallback, useMemo, VFC } from 'react'
import invariant from 'ts-invariant'
import {
  AuctionsOrderBy,
  FetchUserAuctionsDocument,
  FetchUserAuctionsQuery,
  useFetchUserAuctionsQuery,
} from '../graphql'
import useBlockExplorer from '../hooks/useBlockExplorer'
import usePaginate from '../hooks/usePaginate'
import {
  convertAuctionFull,
  convertAuctionWithBestBid,
  convertFullUser,
} from '../utils/convert'
import { getLimit, getOffset, getOrder, getPage } from '../utils/params'
import UserProfileTemplate from './Profile'
import { wrapServerSideProps } from '../props'

export type Props = {
  userAddress: string
  now: string
  page: number
  limit: number
  offset: number
  orderBy: AuctionsOrderBy
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
    const orderBy = getOrder<AuctionsOrderBy>(context, 'CREATED_AT_DESC')
    const offset = getOffset(context, defaultLimit)
    const now = new Date()
    const { data, error } = await client.query<FetchUserAuctionsQuery>({
      query: FetchUserAuctionsDocument,
      variables: {
        limit,
        offset,
        orderBy,
        address: userAddress,
        now,
      },
    })
    if (error) throw error
    if (!data) throw new Error('data is falsy')
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
    signer: Signer | undefined
    explorer: {
      name: string
      url: string
    }
  }
> = ({
  now,
  explorer,
  limit,
  limits,
  offset,
  orderBy,
  page,
  userAddress,
  loginUrlForReferral,
  signer,
}) => {
  const { t } = useTranslation('templates')
  const { replace, pathname, query } = useRouter()
  const { account } = useSession()
  const [changePage, changeLimit] = usePaginate()
  const blockExplorer = useBlockExplorer(explorer.name, explorer.url)
  const toast = useToast()
  const ownerLoggedIn = useIsLoggedIn(userAddress)

  const date = useMemo(() => new Date(now), [now])
  const { data, refetch } = useFetchUserAuctionsQuery({
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

  const auctions = useMemo(
    () =>
      (data?.auctions?.nodes || []).map((x) => ({
        ...convertAuctionWithBestBid(x),
        ...convertAuctionFull(x),
        asset: x.asset,
        createdAt: new Date(x.createdAt),
        ownAsset:
          parseInt(x.asset.ownerships.aggregates?.sum?.quantity || '0', 10) > 0,
      })),
    [data],
  )

  const onAuctionAccepted = useCallback(async () => {
    try {
      toast({
        title: t('user.auctions.notifications.accepted'),
        status: 'success',
      })
      await refetch()
    } catch (e) {
      toast({
        title: formatError(e),
        status: 'error',
      })
    }
  }, [toast, t, refetch])

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
      currentTab="offers"
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
            <Link href={`/users/${userAddress}/offers`}>
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
                  {t('user.auctions.nav.fixed')}
                </Text>
              </Tag>
            </Link>
            <Link href={`/users/${userAddress}/offers/auction`}>
              <Tag
                size="lg"
                colorScheme="brand"
                border="1px"
                borderColor="brand.500"
                borderRadius="full"
              >
                <Text as="span" variant="text-sm" color="brand.600">
                  {t('user.auctions.nav.auction')}
                </Text>
              </Tag>
            </Link>
          </Flex>
          <Box ml="auto" w={{ base: 'full', md: 'min-content' }}>
            <Select<AuctionsOrderBy>
              label={t('user.auctions.orderBy.label')}
              name="Sort by"
              onChange={changeOrder}
              choices={[
                {
                  label: t('user.auctions.orderBy.values.createdAtDesc'),
                  value: 'CREATED_AT_DESC',
                },
                {
                  label: t('user.auctions.orderBy.values.createdAtAsc'),
                  value: 'CREATED_AT_ASC',
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
                <Th>{t('user.auctions.table.item')}</Th>
                <Th isNumeric>{t('user.auctions.table.price')}</Th>
                <Th>{t('user.auctions.table.status')}</Th>
                <Th>{t('user.auctions.table.created')}</Th>
                <Th isNumeric></Th>
              </Tr>
            </Thead>
            <Tbody>
              {auctions.map((item) => (
                <Tr fontSize="sm" key={item.id}>
                  <Td>
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
                        my="auto"
                        direction="column"
                        title={item.asset.name}
                      >
                        <Text as="span" noOfLines={1}>
                          {item.asset.name}
                        </Text>
                      </Flex>
                    </Flex>
                  </Td>
                  <Td isNumeric>
                    {item.bestBid ? (
                      <Text
                        as={Price}
                        noOfLines={1}
                        amount={item.bestBid.unitPrice}
                        currency={item.bestBid.currency}
                      />
                    ) : (
                      '-'
                    )}
                  </Td>
                  <Td>
                    <SaleAuctionStatus auction={item} bestBid={item.bestBid} />
                  </Td>
                  <Td>{dateFromNow(item.createdAt)}</Td>
                  <Td isNumeric>
                    {ownerLoggedIn && item.ownAsset && (
                      <SaleAuctionAction
                        signer={signer}
                        auction={item}
                        bestBid={item.bestBid}
                        blockExplorer={blockExplorer}
                        onAuctionAccepted={onAuctionAccepted}
                      />
                    )}
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
          total={data?.auctions?.totalCount || 0}
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

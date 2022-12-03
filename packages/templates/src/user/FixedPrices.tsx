import { Signer } from '@ethersproject/abstract-signer'
import {
  Box,
  Button,
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
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import {
  CancelOfferModal,
  Image,
  Link,
  Pagination,
  Price,
  Select,
} from '@nft/components'
import {
  CancelOfferStep,
  dateFromNow,
  formatError,
  useCancelOffer,
  useIsLoggedIn,
  useSession,
} from '@nft/hooks'
import { GetServerSideProps } from 'next'
import Trans from 'next-translate/Trans'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import React, { useCallback, useMemo, VFC } from 'react'
import invariant from 'ts-invariant'
import {
  FetchUserFixedPriceDocument,
  FetchUserFixedPriceQuery,
  OffersOrderBy,
  useFetchUserFixedPriceQuery,
} from '../graphql'
import useBlockExplorer from '../hooks/useBlockExplorer'
import usePaginate from '../hooks/usePaginate'
import { convertFullUser, convertSaleFull } from '../utils/convert'
import { getLimit, getOffset, getOrder, getPage } from '../utils/params'
import UserProfileTemplate from './Profile'
import { wrapServerSideProps } from '../props'

export type Props = {
  userAddress: string
  now: string
  page: number
  limit: number
  offset: number
  orderBy: OffersOrderBy
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
    const orderBy = getOrder<OffersOrderBy>(context, 'CREATED_AT_DESC')
    const offset = getOffset(context, defaultLimit)
    const now = new Date()
    const { data, error } = await client.query<FetchUserFixedPriceQuery>({
      query: FetchUserFixedPriceDocument,
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
  limit,
  limits,
  explorer,
  now,
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
  const [cancel, { activeStep, transactionHash }] = useCancelOffer(signer)
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const ownerLoggedIn = useIsLoggedIn(userAddress)

  const blockExplorer = useBlockExplorer(explorer.name, explorer.url)

  const date = useMemo(() => new Date(now), [now])
  const { data, refetch } = useFetchUserFixedPriceQuery({
    variables: {
      address: userAddress,
      limit,
      offset,
      orderBy,
      now: date,
    },
  })

  const handleCancelOffer = useCallback(
    async (id: string) => {
      try {
        onOpen()
        await cancel({ id })
        toast({
          title: t('user.fixed.notifications.canceled'),
          status: 'success',
        })
        await refetch()
      } catch (e) {
        toast({
          title: formatError(e),
          status: 'error',
        })
      } finally {
        onClose()
      }
    },
    [cancel, onClose, onOpen, refetch, t, toast],
  )

  const userAccount = useMemo(
    () => convertFullUser(data?.account || null, userAddress),
    [data, userAddress],
  )

  const offers = useMemo(
    () =>
      (data?.offers?.nodes || []).map((x) => ({
        ...convertSaleFull(x),
        createdAt: new Date(x.createdAt),
        asset: x.asset,
        ownAsset:
          parseInt(x.asset.ownerships.aggregates?.sum?.quantity || '0', 10) > 0,
      })),
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
                colorScheme="brand"
                border="1px"
                borderColor="brand.500"
                borderRadius="full"
              >
                <Text as="span" variant="text-sm" color="brand.600">
                  {t('user.fixed.nav.fixed')}
                </Text>
              </Tag>
            </Link>
            <Link href={`/users/${userAddress}/offers/auction`}>
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
                  {t('user.fixed.nav.auction')}
                </Text>
              </Tag>
            </Link>
          </Flex>
          <Box ml="auto" w={{ base: 'full', md: 'min-content' }}>
            <Select<OffersOrderBy>
              label={t('user.fixed.orderBy.label')}
              name="Sort by"
              onChange={changeOrder}
              choices={[
                {
                  label: t('user.fixed.orderBy.values.createdAtDesc'),
                  value: 'CREATED_AT_DESC',
                },
                {
                  label: t('user.fixed.orderBy.values.createdAtAsc'),
                  value: 'CREATED_AT_ASC',
                },
                {
                  label: t('user.fixed.orderBy.values.unitPriceAsc'),
                  value: 'UNIT_PRICE_IN_REF_ASC',
                },
                {
                  label: t('user.fixed.orderBy.values.unitPriceDesc'),
                  value: 'UNIT_PRICE_IN_REF_DESC',
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
                <Th>{t('user.fixed.table.item')}</Th>
                <Th isNumeric>{t('user.fixed.table.price')}</Th>
                <Th>{t('user.fixed.table.status')}</Th>
                <Th>{t('user.fixed.table.created')}</Th>
                <Th isNumeric></Th>
              </Tr>
            </Thead>
            <Tbody>
              {offers.map((item) => (
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
                        direction="column"
                        my="auto"
                        title={item.asset.name}
                      >
                        <Text as="span" noOfLines={1}>
                          {item.asset.name}
                        </Text>
                        {item.availableQuantity.gt(1) && (
                          <Text as="span" variant="caption" color="gray.500">
                            {t('user.fixed.available', {
                              value: item.availableQuantity.toString(),
                            })}
                          </Text>
                        )}
                      </Flex>
                    </Flex>
                  </Td>
                  <Td isNumeric>
                    <Text
                      as={Price}
                      noOfLines={1}
                      amount={item.unitPrice}
                      currency={item.currency}
                    />
                  </Td>
                  <Td>
                    {item.expiredAt && item.expiredAt <= new Date()
                      ? t('user.fixed.status.expired')
                      : t('user.fixed.status.active')}
                  </Td>
                  <Td>{dateFromNow(item.createdAt)}</Td>
                  <Td isNumeric>
                    {ownerLoggedIn && (
                      <>
                        {!item.expiredAt || item.expiredAt > new Date() ? (
                          <Button
                            variant="outline"
                            colorScheme="gray"
                            disabled={activeStep !== CancelOfferStep.INITIAL}
                            onClick={() => handleCancelOffer(item.id)}
                          >
                            <Text as="span" isTruncated>
                              {t('user.fixed.actions.cancel')}
                            </Text>
                          </Button>
                        ) : item.ownAsset ? (
                          <Button
                            as={Link}
                            href={`/tokens/${item.asset.id}/offer`}
                            variant="outline"
                            colorScheme="gray"
                          >
                            <Text as="span" isTruncated>
                              {t('user.fixed.actions.new')}
                            </Text>
                          </Button>
                        ) : (
                          '-'
                        )}
                      </>
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
          total={data?.offers?.totalCount || 0}
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

        <CancelOfferModal
          isOpen={isOpen}
          onClose={onClose}
          title={t('user.fixed.cancel.title')}
          step={activeStep}
          blockExplorer={blockExplorer}
          transactionHash={transactionHash}
        />
      </Stack>
    </UserProfileTemplate>
  )
}

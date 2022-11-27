import {
  Button,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react'
import {
  Link,
  Slider,
  TokenCard,
  TokenHeader,
  wrapServerSideProps,
} from '@nft/components'
import { useSession } from '@nft/hooks'
import { HiArrowNarrowRight } from '@react-icons/all-files/hi/HiArrowNarrowRight'
import { GetServerSideProps } from 'next'
import useTranslation from 'next-translate/useTranslation'
import React, { FC, useCallback, useEffect, useMemo } from 'react'
import {
  FetchDefaultAssetIdsDocument,
  FetchDefaultAssetIdsQuery,
  FetchHomePageDocument,
  FetchHomePageQuery,
  useFetchHomePageQuery,
} from '../graphql'
import useBlockExplorer from '../hooks/useBlockExplorer'
import useEagerConnect from '../hooks/useEagerConnect'
import useOrderById from '../hooks/useOrderById'
import {
  convertAsset,
  convertAssetWithSupplies,
  convertAuctionFull,
  convertAuctionWithBestBid,
  convertBid,
  convertOwnership,
  convertSale,
  convertSaleFull,
  convertUser,
} from '../utils/convert'

export type Props = {
  now: string
  featuredTokens: string[]
  limit: number
  tokens: string[]
  currentAccount: string | null
}

export const server = (
  url: string,
  featuredTokens: string[],
  paginationLimit: number,
  tokens?: string[],
): GetServerSideProps<Props> =>
  wrapServerSideProps<Props>(url, async (ctx, client) => {
    const now = new Date()
    let tokensToRender
    if (tokens) {
      // Randomize list of assets to display
      tokensToRender = tokens
        .sort(() => Math.random() - 0.5)
        .slice(0, paginationLimit)
    } else {
      // Fallback to default list of assets
      const res = await client.query<FetchDefaultAssetIdsQuery>({
        query: FetchDefaultAssetIdsDocument,
        variables: {
          limit: paginationLimit,
        },
      })
      tokensToRender = res.data.assets?.nodes.map((x) => x.id) || []
    }

    const { data, error } = await client.query<FetchHomePageQuery>({
      query: FetchHomePageDocument,
      variables: {
        featuredIds: featuredTokens,
        now,
        limit: paginationLimit,
        assetIds: tokensToRender,
        address: ctx.user.address || '',
      },
    })
    if (error) throw error
    if (!data) throw new Error('data is falsy')
    return {
      props: {
        now: now.toJSON(),
        limit: paginationLimit,
        featuredTokens,
        tokens: tokensToRender,
        currentAccount: ctx.user.address,
      },
    }
  })

export const Template: FC<
  Props & {
    explorer: {
      name: string
      url: string
    }
  }
> = ({ now, limit, featuredTokens, tokens, explorer, currentAccount }) => {
  const { t } = useTranslation('templates')
  const { account, signer, connectors } = useSession()
  const ready = useEagerConnect(connectors, currentAccount)
  const toast = useToast()
  const date = useMemo(() => new Date(now), [now])
  const { data, refetch, error } = useFetchHomePageQuery({
    variables: {
      featuredIds: featuredTokens,
      now: date,
      limit,
      assetIds: tokens,
      address: (ready ? account?.toLowerCase() : currentAccount) || '',
    },
  })

  useEffect(() => {
    if (!error) return
    console.error(error)
    toast({
      title: t('error.500'),
      status: 'error',
    })
  }, [error, t, toast])

  const blockExplorer = useBlockExplorer(explorer.name, explorer.url)

  const featured = useOrderById(featuredTokens, data?.featured?.nodes)
  const assets = useOrderById(tokens, data?.assets?.nodes)
  const currencies = useMemo(() => data?.currencies?.nodes || [], [data])
  const auctions = useMemo(() => data?.auctions?.nodes || [], [data])

  const reloadInfo = useCallback(async () => {
    void refetch()
  }, [refetch])

  const featuredAssets = useMemo(
    () =>
      featured?.map((asset) => (
        <TokenHeader
          key={asset.id}
          blockExplorer={blockExplorer}
          asset={convertAssetWithSupplies(asset)}
          currencies={currencies}
          auction={
            asset.auctions.nodes[0]
              ? convertAuctionFull(asset.auctions.nodes[0])
              : undefined
          }
          bestBid={
            asset.auctions.nodes[0]?.bestBid?.nodes[0]
              ? convertBid(asset.auctions.nodes[0]?.bestBid?.nodes[0])
              : undefined
          }
          sales={asset.sales.nodes.map(convertSaleFull)}
          creator={convertUser(asset.creator, asset.creator.address)}
          owners={asset.ownerships.nodes.map(convertOwnership)}
          isHomepage={true}
          signer={signer}
          currentAccount={account}
          onOfferCanceled={reloadInfo}
          onAuctionAccepted={reloadInfo}
        />
      )),
    [featured, blockExplorer, account, signer, reloadInfo, currencies],
  )

  return (
    <>
      {featuredAssets && featuredAssets.length > 0 && (
        <header>
          {featuredAssets.length === 1 ? (
            featuredAssets
          ) : (
            <Flex as={Slider}>{featuredAssets}</Flex>
          )}
        </header>
      )}

      {auctions.length > 0 && (
        <Stack spacing={6} mt={12}>
          <Heading as="h2" variant="subtitle" color="brand.black">
            {t('home.auctions')}
          </Heading>
          <Slider>
            {auctions.map((x, i) => (
              <Flex
                key={i}
                grow={0}
                shrink={0}
                basis={{
                  base: '100%',
                  sm: '50%',
                  md: '33.33%',
                  lg: '25%',
                }}
                p="10px"
              >
                <TokenCard
                  asset={convertAsset(x.asset)}
                  creator={convertUser(
                    x.asset.creator,
                    x.asset.creator.address,
                  )}
                  auction={convertAuctionWithBestBid(x)}
                  sale={undefined}
                  numberOfSales={0}
                  hasMultiCurrency={false}
                />
              </Flex>
            ))}
          </Slider>
        </Stack>
      )}

      {assets.length > 0 && (
        <Stack spacing={6} mt={12}>
          <Flex flexWrap="wrap" justify="space-between" gap={4}>
            <Heading as="h2" variant="subtitle" color="brand.black">
              {t('home.featured')}
            </Heading>
            <Link href="/explore">
              <Button
                variant="outline"
                colorScheme="gray"
                rightIcon={<Icon as={HiArrowNarrowRight} h={5} w={5} />}
                iconSpacing="10px"
              >
                <Text as="span" isTruncated>
                  {t('home.explore')}
                </Text>
              </Button>
            </Link>
          </Flex>
          <SimpleGrid spacing={6} columns={{ sm: 2, md: 3, lg: 4 }}>
            {assets.map((x, i) => (
              <Flex key={i} justify="center">
                <TokenCard
                  asset={convertAsset(x)}
                  creator={convertUser(x.creator, x.creator.address)}
                  sale={convertSale(x.firstSale.nodes[0])}
                  auction={
                    x.auctions.nodes[0]
                      ? convertAuctionWithBestBid(x.auctions.nodes[0])
                      : undefined
                  }
                  numberOfSales={x.firstSale.totalCount}
                  hasMultiCurrency={
                    parseInt(
                      x.currencySales.aggregates?.distinctCount?.currencyId,
                      10,
                    ) > 1
                  }
                />
              </Flex>
            ))}
          </SimpleGrid>
        </Stack>
      )}
    </>
  )
}

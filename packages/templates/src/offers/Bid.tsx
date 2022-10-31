import { Box, Flex, Heading, Icon, Stack, useToast } from '@chakra-ui/react'
import { BigNumber } from '@ethersproject/bignumber'
import {
  BackButton,
  Countdown,
  Image,
  OfferFormBid,
  Price,
  TokenCard,
  wrapServerSideProps,
} from '@nft/components'
import { useSession } from '@nft/hooks'
import { HiOutlineClock } from '@react-icons/all-files/hi/HiOutlineClock'
import { GetServerSideProps } from 'next'
import getT from 'next-translate/getT'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import React, { useCallback, useMemo, VFC } from 'react'
import invariant from 'ts-invariant'
import {
  BidOnAssetDocument,
  BidOnAssetQuery,
  FeesForBidDocument,
  FeesForBidQuery,
  useBidOnAssetQuery,
  useFeesForBidQuery,
} from '../graphql'
import useBlockExplorer from '../hooks/useBlockExplorer'
import useExecuteOnAccountChange from '../hooks/useExecuteOnAccountChange'
import {
  convertAsset,
  convertAuctionWithBestBid,
  convertSale,
  convertUser,
} from '../utils/convert'

export type Props = {
  assetId: string
  now: string
  meta: {
    title: string
    description: string
    image: string
  }
}

export const server = (url: string): GetServerSideProps<Props> =>
  wrapServerSideProps<Props>(url, async (ctx, client) => {
    const t = await getT(ctx.locale, 'templates')
    const assetId = ctx.params?.id
      ? Array.isArray(ctx.params.id)
        ? ctx.params.id[0]
        : ctx.params.id
      : null
    invariant(assetId, 'assetId is falsy')

    const now = new Date()
    const { data, error } = await client.query<BidOnAssetQuery>({
      query: BidOnAssetDocument,
      variables: {
        id: assetId,
        now,
      },
    })
    if (error) throw error
    if (!data.asset) return { notFound: true }
    const feeQuery = await client.query<FeesForBidQuery>({
      query: FeesForBidDocument,
      variables: { id: assetId },
    })
    if (feeQuery.error) throw error
    return {
      props: {
        assetId,
        now: now.toJSON(),
        meta: {
          title: t('offers.bid.meta.title', data.asset),
          description: t('offers.bid.meta.description', {
            name: data.asset.name,
            creator: data.asset.creator.name || data.asset.creator.address,
          }),
          image: data.asset.image,
        },
      },
    }
  })

export const Template: VFC<
  Omit<Props, 'meta'> & {
    explorer: {
      name: string
      url: string
    }
    allowTopUp: boolean
    auctionValidity: number
    offerValidity: number
    login: {
      email: boolean
      metamask: boolean
      coinbase: boolean
      walletConnect: boolean
      networkName: string
    }
  }
> = ({
  now,
  assetId,
  explorer,
  allowTopUp,
  auctionValidity,
  offerValidity,
  login,
}) => {
  const { t } = useTranslation('templates')
  const { back, push } = useRouter()
  const toast = useToast()
  const { account, signer } = useSession()

  const date = useMemo(() => new Date(now), [now])
  const { data, refetch } = useBidOnAssetQuery({
    variables: {
      id: assetId,
      now: date,
    },
  })
  useExecuteOnAccountChange(refetch)

  const fees = useFeesForBidQuery({
    variables: {
      id: assetId,
    },
  })

  const feesPerTenThousand = fees.data?.orderFees.valuePerTenThousand || 0

  const blockExplorer = useBlockExplorer(explorer.name, explorer.url)

  const asset = useMemo(() => data?.asset, [data])

  const auction = useMemo(
    () => (asset?.auctions.nodes[0] ? asset.auctions.nodes[0] : undefined),
    [asset],
  )
  const currencies = useMemo(
    () => (auction ? [auction.currency] : data?.currencies?.nodes || []),
    [auction, data],
  )

  const highestBid = useMemo(() => auction?.bestBid.nodes[0], [auction])

  const onCreated = useCallback(async () => {
    toast({
      title: t('offers.bid.notifications.created'),
      status: 'success',
    })
    await push(`/tokens/${assetId}`)
  }, [toast, t, push, assetId])

  if (!asset) return <></>
  return (
    <>
      <BackButton onClick={back} />
      <Heading as="h1" variant="title" color="brand.black" my={12}>
        {t('offers.bid.title')}
      </Heading>

      <Flex
        mt={12}
        mb={6}
        direction={{ base: 'column', md: 'row' }}
        align={{ base: 'center', md: 'flex-start' }}
        justify="stretch"
        gap={12}
      >
        <TokenCard
          asset={convertAsset(asset)}
          creator={convertUser(asset.creator, asset.creator.address)}
          auction={auction ? convertAuctionWithBestBid(auction) : undefined}
          sale={convertSale(asset.firstSale.nodes[0])}
          numberOfSales={asset.firstSale.totalCount}
          hasMultiCurrency={
            parseInt(
              asset.currencySales.aggregates?.distinctCount?.currencyId,
              10,
            ) > 1
          }
        />
        <Flex direction="column" flex="1 1 0%">
          {auction && (
            <>
              <Stack mb={highestBid ? 6 : 0} spacing={3}>
                <Heading as="h5" variant="heading3" color="gray.500">
                  {t('offers.bid.auction')}
                </Heading>
                <Flex align="center" gap={3}>
                  <Flex
                    as="span"
                    bgColor="brand.500"
                    h={8}
                    w={8}
                    align="center"
                    justify="center"
                    rounded="full"
                  >
                    <Icon as={HiOutlineClock} h={5} w={5} color="white" />
                  </Flex>
                  <Heading as="h2" variant="subtitle" color="brand.black">
                    <Countdown date={auction.endAt} />
                  </Heading>
                </Flex>
              </Stack>
              {highestBid && (
                <Stack spacing={3}>
                  <Heading as="h5" variant="heading3" color="gray.500">
                    {t('offers.bid.highestBid')}
                  </Heading>
                  <Flex align="center" gap={3}>
                    <Flex
                      align="center"
                      justify="center"
                      h={8}
                      w={8}
                      rounded="full"
                      border="1px"
                      borderColor="gray.200"
                    >
                      <Image
                        src={highestBid.currency.image}
                        alt={`${highestBid.currency.symbol} Logo`}
                        width={32}
                        height={32}
                      />
                    </Flex>
                    <Heading as="h2" variant="subtitle" color="brand.black">
                      <Price
                        amount={BigNumber.from(highestBid.unitPrice)}
                        currency={highestBid.currency}
                      />
                    </Heading>
                  </Flex>
                </Stack>
              )}
              <Box as="hr" my={8} />
            </>
          )}

          {asset.standard === 'ERC721' && (
            <OfferFormBid
              signer={signer}
              account={account}
              assetId={asset.id}
              multiple={false}
              owner={asset.ownerships.nodes[0]?.ownerAddress}
              currencies={currencies}
              blockExplorer={blockExplorer}
              onCreated={onCreated}
              auctionId={auction?.id}
              auctionValidity={auctionValidity}
              offerValidity={offerValidity}
              feesPerTenThousand={feesPerTenThousand}
              allowTopUp={allowTopUp}
              login={login}
            />
          )}
          {asset.standard === 'ERC1155' && (
            <OfferFormBid
              signer={signer}
              account={account}
              assetId={asset.id}
              multiple={true}
              supply={asset.ownerships.aggregates?.sum?.quantity || '0'}
              currencies={currencies}
              blockExplorer={blockExplorer}
              onCreated={onCreated}
              auctionId={auction?.id}
              auctionValidity={auctionValidity}
              offerValidity={offerValidity}
              feesPerTenThousand={feesPerTenThousand}
              allowTopUp={allowTopUp}
              login={login}
            />
          )}
        </Flex>
      </Flex>
    </>
  )
}

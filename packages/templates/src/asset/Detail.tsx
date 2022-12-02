import {
  AspectRatio,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Stack,
  Switch,
  Tab,
  TabList,
  Tabs,
  Text,
  Tooltip,
} from '@chakra-ui/react'
import { BigNumber } from '@ethersproject/bignumber'
import {
  BidList,
  HistoryList,
  Link as ChakraLink,
  SaleDetail,
  TokenMedia,
  TokenMetadata,
  TraitList,
  wrapServerSideProps,
} from '@nft/components'
import { useSession } from '@nft/hooks'
import { FaInfoCircle } from '@react-icons/all-files/fa/FaInfoCircle'
import { HiOutlineDotsHorizontal } from '@react-icons/all-files/hi/HiOutlineDotsHorizontal'
import { HiOutlineExternalLink } from '@react-icons/all-files/hi/HiOutlineExternalLink'
import { GetServerSideProps } from 'next'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import React, { useCallback, useMemo, useState, VFC } from 'react'
import invariant from 'ts-invariant'
import {
  FetchAssetDocument,
  FetchAssetIdFromTokenIdDocument,
  FetchAssetIdFromTokenIdQuery,
  FetchAssetIdFromTokenIdQueryVariables,
  FetchAssetQuery,
  useFetchAssetQuery,
} from '../graphql'
import useBlockExplorer from '../hooks/useBlockExplorer'
import useEagerConnect from '../hooks/useEagerConnect'
import useNow from '../hooks/useNow'
import {
  convertAuctionFull,
  convertBidFull,
  convertHistories,
  convertOwnership,
  convertSaleFull,
  convertUser,
} from '../utils/convert'

export type Props = {
  assetId: string
  now: string
  currentAccount: string | null
  meta: {
    title: string
    description: string
    image: string
  }
}

export enum AssetTabs {
  bids = 'bids',
  history = 'history',
}

export const server = (url: string): GetServerSideProps<Props> =>
  wrapServerSideProps<Props>(url, async (ctx, client) => {
    const now = new Date()
    const assetId = ctx.params?.id
      ? Array.isArray(ctx.params.id)
        ? ctx.params.id[0]
        : ctx.params.id
      : null
    invariant(assetId, 'assetId is falsy')

    // check if assetId is only a tokenId
    if (!assetId.includes('-')) {
      const { data, error } = await client.query<
        FetchAssetIdFromTokenIdQuery,
        FetchAssetIdFromTokenIdQueryVariables
      >({
        query: FetchAssetIdFromTokenIdDocument,
        variables: { tokenId: assetId },
      })
      if (error) throw error
      const fullAssetId = data.assets?.nodes.at(0)
      if (!fullAssetId) return { notFound: true }
      return {
        redirect: {
          permanent: true,
          destination: `/tokens/${fullAssetId.id}`,
        },
      }
    }

    const { data, error } = await client.query<FetchAssetQuery>({
      query: FetchAssetDocument,
      variables: {
        id: assetId,
        now,
        address: ctx.user.address || '',
      },
    })
    if (error) throw error
    if (!data.asset) return { notFound: true }
    return {
      props: {
        now: now.toJSON(),
        assetId,
        currentAccount: ctx.user.address,
        meta: {
          title: data.asset.name,
          description: data.asset.description,
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
    reportEmail: string
  }
> = ({ assetId, explorer, now: nowProp, reportEmail, currentAccount }) => {
  const { t } = useTranslation('templates')
  const { account, signer, connectors } = useSession()
  const ready = useEagerConnect(connectors, currentAccount)
  const { query } = useRouter()
  const blockExplorer = useBlockExplorer(explorer.name, explorer.url)
  const [showPreview, setShowPreview] = useState(false)

  const date = useMemo(() => new Date(nowProp), [nowProp])
  const { data, refetch } = useFetchAssetQuery({
    variables: {
      id: assetId,
      now: date,
      address: (ready ? account?.toLowerCase() : currentAccount) || '',
    },
  })

  const asset = useMemo(() => data?.asset, [data])
  const currencies = useMemo(() => data?.currencies?.nodes || [], [data])

  const isOwner = useMemo(
    () => BigNumber.from(asset?.owned.aggregates?.sum?.quantity || '0').gt('0'),
    [asset],
  )
  const ownAllSupply = useMemo(
    () =>
      BigNumber.from(asset?.owned.aggregates?.sum?.quantity || '0').gte(
        BigNumber.from(asset?.ownerships.aggregates?.sum?.quantity || '0'),
      ),
    [asset],
  )
  const isSingle = useMemo(() => asset?.standard === 'ERC721', [asset])

  const tabs = [
    {
      title: t('asset.detail.tabs.bids'),
      href: `/tokens/${assetId}?filter=bids`,
      type: AssetTabs.bids,
    },
    {
      title: t('asset.detail.tabs.history'),
      href: `/tokens/${assetId}?filter=history`,
      type: AssetTabs.history,
    },
  ]

  const traits = useMemo(
    () => asset && asset.traits.nodes.length > 0 && asset.traits.nodes,
    [asset],
  )

  const defaultIndex = query.filter
    ? tabs.findIndex((tab) => tab.type === query.filter)
    : 0

  const assetExternalURL = useMemo(() => {
    if (!asset) return ''
    return blockExplorer.token(asset.collectionAddress, asset.tokenId)
  }, [asset, blockExplorer])

  const now = useNow()
  const activeAuction = useMemo(() => {
    const auction = asset?.auctions.nodes[0]
    if (!auction) return
    // check if auction is expired
    if (new Date(auction.expireAt) <= now) return
    // check if auction has a winning offer
    if (!!auction.winningOffer?.id) return
    return auction
  }, [asset, now])

  const bids = useMemo(() => {
    if (!asset) return []
    return activeAuction
      ? activeAuction.offers.nodes.map(convertBidFull)
      : asset.bids.nodes.length > 0
      ? asset.bids.nodes.map(convertBidFull)
      : []
  }, [activeAuction, asset])

  const directSales = useMemo(
    () => asset?.sales.nodes.map(convertSaleFull) || [],
    [asset],
  )

  const auction = useMemo(
    () =>
      asset?.auctions.nodes.map((auction) => convertAuctionFull(auction))[0],
    [asset],
  )

  const bestBid = useMemo(
    () => asset?.auctions.nodes[0]?.offers.nodes.map(convertBidFull)[0],
    [asset],
  )

  const creator = useMemo(
    () =>
      asset ? convertUser(asset.creator, asset.creator.address) : undefined,
    [asset],
  )

  const owners = useMemo(
    () => asset?.ownerships.nodes.map(convertOwnership) || [],
    [asset],
  )

  const histories = useMemo(
    () => asset?.histories.nodes.map(convertHistories) || [],
    [asset],
  )

  const refresh = useCallback(async () => {
    await refetch()
  }, [refetch])

  if (!asset) return <></>
  return (
    <SimpleGrid spacing={6} columns={{ md: 2 }}>
      <AspectRatio ratio={1}>
        <Center
          flexDirection="column"
          rounded={{ md: 'xl' }}
          p={12}
          bg="brand.50"
        >
          <Box position="relative" h="full" w="full" zIndex={1}>
            <Box
              as={TokenMedia}
              image={asset.image}
              animationUrl={asset.animationUrl}
              unlockedContent={showPreview ? undefined : asset.unlockedContent}
              defaultText={asset.name}
              mx="auto"
              maxH="full"
              maxW="full"
              objectFit="contain"
              layout="fill"
              controls
            />
          </Box>
          {asset.hasUnlockableContent && (
            <Flex
              w="full"
              mt={3}
              direction={{ base: 'column', lg: 'row' }}
              justify={{
                base: 'center',
                lg: isOwner ? 'space-between' : 'center',
              }}
              align="center"
              gap={4}
            >
              <Flex align="center" gap={1.5}>
                <Heading as="h3" variant="heading3" color="brand.black">
                  {t('asset.detail.unlockable.title')}
                </Heading>
                <Tooltip
                  label={
                    <Text as="span" variant="caption" color="brand.black">
                      {t('asset.detail.unlockable.tooltip')}
                    </Text>
                  }
                  placement="top"
                  rounded="xl"
                  shadow="lg"
                  p={3}
                  bg="white"
                >
                  <span>
                    <Icon
                      as={FaInfoCircle}
                      color="gray.400"
                      h={4}
                      w={4}
                      cursor="pointer"
                    />
                  </span>
                </Tooltip>
              </Flex>
              {isOwner && (
                <Flex as={FormControl} w="auto" align="center">
                  <FormLabel mb={0} htmlFor="show-preview">
                    <Heading as="h3" variant="heading3" color="brand.black">
                      {t('asset.detail.show-preview')}
                    </Heading>
                  </FormLabel>
                  <Switch
                    id="show-preview"
                    isChecked={showPreview}
                    onChange={(event) => setShowPreview(event.target.checked)}
                  />
                </Flex>
              )}
            </Flex>
          )}
        </Center>
      </AspectRatio>
      <Flex direction="column" my="auto" gap={8} p={{ base: 6, md: 0 }}>
        <Flex justify="space-between">
          <Heading as="h1" variant="title" color="brand.black">
            {asset.name}
          </Heading>
          <Flex direction="row" align="flex-start" gap={3}>
            <Menu>
              <MenuButton
                as={IconButton}
                variant="outline"
                colorScheme="gray"
                rounded="full"
                aria-label="activator"
                icon={<Icon as={HiOutlineDotsHorizontal} w={5} h={5} />}
              />
              <MenuList>
                <ChakraLink
                  href={`mailto:${reportEmail}?subject=${encodeURI(
                    t('asset.detail.menu.report.subject'),
                  )}&body=${encodeURI(
                    t('asset.detail.menu.report.body', asset),
                  )}`}
                  isExternal
                >
                  <MenuItem>{t('asset.detail.menu.report.label')}</MenuItem>
                </ChakraLink>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        <TokenMetadata
          creator={creator}
          owners={owners}
          saleSupply={BigNumber.from(
            asset.sales.aggregates?.sum?.availableQuantity || 0,
          )}
          standard={asset.standard}
          totalSupply={BigNumber.from(
            asset.ownerships.aggregates?.sum?.quantity || '0',
          )}
        />
        <SaleDetail
          assetId={asset.id}
          blockExplorer={blockExplorer}
          currencies={currencies}
          signer={signer}
          currentAccount={account}
          isSingle={isSingle}
          isHomepage={false}
          isOwner={isOwner}
          auction={auction}
          bestBid={bestBid}
          directSales={directSales}
          ownAllSupply={ownAllSupply}
          onOfferCanceled={refresh}
          onAuctionAccepted={refresh}
        />
      </Flex>

      <Box p={6}>
        <Heading as="h4" variant="heading2" color="brand.black">
          {t('asset.detail.description')}
        </Heading>
        <Text as="p" variant="text-sm" color="gray.500" mt={3}>
          {asset.description}
        </Text>

        <Stack as="nav" mt={8} align="flex-start" spacing={3}>
          <Button
            as={Link}
            href={assetExternalURL}
            isExternal
            variant="outline"
            colorScheme="gray"
            width={48}
            justifyContent="space-between"
            rightIcon={<HiOutlineExternalLink />}
          >
            <Text as="span" isTruncated>
              {t('asset.detail.explorerLink', blockExplorer)}
            </Text>
          </Button>

          <Button
            as={Link}
            href={asset.image}
            isExternal
            variant="outline"
            colorScheme="gray"
            width={48}
            justifyContent="space-between"
            rightIcon={<HiOutlineExternalLink />}
          >
            <Text as="span" isTruncated>
              {t('asset.detail.ipfsLink')}
            </Text>
          </Button>
        </Stack>

        {traits && (
          <Box pt={8}>
            <Heading as="h4" variant="heading2" color="brand.black" pb={3}>
              {t('asset.detail.traits')}
            </Heading>
            <TraitList traits={traits} />
          </Box>
        )}
      </Box>

      <div>
        <Tabs
          isManual
          defaultIndex={defaultIndex}
          colorScheme="brand"
          overflowX="auto"
          overflowY="hidden"
        >
          <TabList>
            {tabs.map((tab, index) => (
              <ChakraLink key={index} href={tab.href} whiteSpace="nowrap">
                <Tab as="div">
                  <Text as="span" variant="subtitle1">
                    {tab.title}
                  </Text>
                </Tab>
              </ChakraLink>
            ))}
          </TabList>
        </Tabs>
        <Box h={96} overflowY="auto" py={6}>
          {(!query.filter || query.filter === AssetTabs.bids) && (
            <BidList
              bids={bids}
              signer={signer}
              account={account}
              isSingle={isSingle}
              blockExplorer={blockExplorer}
              preventAcceptation={!isOwner || !!activeAuction}
              onAccepted={refresh}
              onCanceled={refresh}
            />
          )}
          {query.filter === AssetTabs.history && (
            <HistoryList histories={histories} blockExplorer={blockExplorer} />
          )}
        </Box>
      </div>
    </SimpleGrid>
  )
}

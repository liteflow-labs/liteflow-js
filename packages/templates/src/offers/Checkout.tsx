import { Box, Flex, Heading, Stack, useToast } from '@chakra-ui/react'
import { BigNumber } from '@ethersproject/bignumber'
import {
  BackButton,
  Image,
  OfferFormCheckout,
  Price,
  TokenCard,
  UserAvatar,
  wrapServerSideProps,
} from '@nft/components'
import { useSession } from '@nft/hooks'
import { GetServerSideProps } from 'next'
import getT from 'next-translate/getT'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import React, { useCallback, useMemo, VFC } from 'react'
import invariant from 'ts-invariant'
import {
  AccountVerificationStatus,
  CheckoutDocument,
  CheckoutQuery,
  Standard,
  useCheckoutQuery,
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
  offerId: string
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
    const offerId = ctx.params?.id
      ? Array.isArray(ctx.params.id)
        ? ctx.params.id[0]
        : ctx.params.id
      : null
    invariant(offerId, 'offerId is falsy')
    const now = new Date()
    const { data, error } = await client.query<CheckoutQuery>({
      query: CheckoutDocument,
      variables: {
        id: offerId,
        now,
      },
    })
    if (error) throw error
    if (!data.offer) return { notFound: true }
    return {
      props: {
        offerId,
        now: now.toJSON(),
        meta: {
          title: t('offers.checkout.meta.title', data.offer.asset),
          description: t('offers.checkout.meta.description', {
            name: data.offer.asset.name,
            creator:
              data.offer.asset.creator.name || data.offer.asset.creator.address,
          }),
          image: data.offer.asset.image,
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
    login: {
      email: boolean
      metamask: boolean
      coinbase: boolean
      walletConnect: boolean
      networkName: string
    }
  }
> = ({ now, offerId, explorer, allowTopUp, login }) => {
  const { t } = useTranslation('templates')
  const { back, push } = useRouter()
  const toast = useToast()

  const { account, signer } = useSession()

  const blockExplorer = useBlockExplorer(explorer.name, explorer.url)

  const date = useMemo(() => new Date(now), [now])
  const { data, refetch } = useCheckoutQuery({
    variables: {
      id: offerId,
      now: date,
    },
  })
  useExecuteOnAccountChange(refetch)

  const offer = useMemo(() => data?.offer, [data])
  const asset = useMemo(() => offer?.asset, [offer])
  const priceUnit = useMemo(
    () => (offer ? BigNumber.from(offer.unitPrice) : undefined),
    [offer],
  )
  const isSingle = useMemo(() => asset?.standard === Standard.Erc721, [asset])

  const onPurchased = useCallback(async () => {
    if (!data?.offer) return
    toast({
      title: t('offers.checkout.notifications.purchased'),
      status: 'success',
    })
    await push(`/tokens/${data.offer.asset.id}`)
  }, [data, toast, t, push])

  if (!offer) return null
  if (!asset) return null
  return (
    <>
      <BackButton onClick={back} />
      <Heading as="h1" variant="title" color="brand.black" mt={12}>
        {t('offers.checkout.title')}
      </Heading>

      <Flex mt={12} mb={6} direction={{ base: 'column', md: 'row' }} gap={12}>
        <TokenCard
          asset={convertAsset(asset)}
          creator={convertUser(asset.creator, asset.creator.address)}
          sale={convertSale(asset.firstSale.nodes[0])}
          auction={
            asset.auctions.nodes[0]
              ? convertAuctionWithBestBid(asset.auctions.nodes[0])
              : undefined
          }
          numberOfSales={asset.firstSale.totalCount}
          hasMultiCurrency={
            parseInt(
              asset.currencySales.aggregates?.distinctCount?.currencyId,
              10,
            ) > 1
          }
        />
        <Flex direction="column" flex="1 1 0%">
          <Stack spacing={3} mb={3}>
            <Heading as="h5" variant="heading3" color="gray.500">
              {t('offers.checkout.from')}
            </Heading>
            <UserAvatar
              address={offer.maker.address}
              image={offer.maker.image}
              name={offer.maker.name}
              verified={
                offer.maker.verification?.status ===
                AccountVerificationStatus.Validated
              }
            />
          </Stack>

          <Stack spacing={3}>
            <Heading as="h5" variant="heading3" color="gray.500">
              {t('offers.checkout.on-sale')}
            </Heading>
            <Flex align="center" gap={3}>
              <Flex
                as="span"
                border="1px"
                borderColor="gray.200"
                h={8}
                w={8}
                align="center"
                justify="center"
                rounded="full"
              >
                <Image
                  src={offer.currency.image}
                  alt={`${offer.currency.symbol} Logo`}
                  width={32}
                  height={32}
                />
              </Flex>
              {priceUnit && (
                <Heading as="h2" variant="subtitle" color="brand.black">
                  <Price amount={priceUnit} currency={offer.currency} />
                </Heading>
              )}
              {!isSingle && (
                <Heading as="h5" variant="heading3" color="gray.500" ml={2}>
                  {t('offers.checkout.per-edition')}
                </Heading>
              )}
            </Flex>
          </Stack>
          <Box as="hr" my={8} />

          <OfferFormCheckout
            signer={signer}
            account={account}
            offer={offer}
            blockExplorer={blockExplorer}
            currency={offer.currency}
            multiple={!isSingle}
            onPurchased={onPurchased}
            allowTopUp={allowTopUp}
            login={login}
          />
        </Flex>
      </Flex>
    </>
  )
}

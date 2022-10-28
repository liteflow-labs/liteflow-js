import { Box, Flex, Heading, Icon } from '@chakra-ui/react'
import { BigNumber } from '@ethersproject/bignumber'
import { formatDate } from '@nft/hooks'
import { HiOutlineClock } from '@react-icons/all-files/hi/HiOutlineClock'
import useTranslation from 'next-translate/useTranslation'
import Image from 'next/image'
import React, { useMemo, VFC } from 'react'
import Price from '../../Price/Price'

type Props = {
  isSingle: boolean
  sales: {
    unitPrice: BigNumber
    currency: {
      id: string
      decimals: number
      image: string
      symbol: string
    }
    expiredAt: Date | null | undefined
  }[]
}

const SaleDirectSummary: VFC<Props> = ({ sales, isSingle }) => {
  const { t } = useTranslation('components')
  const salesWithUniqueCurrency = useMemo(() => {
    return sales.reduce(
      (acc, sale) =>
        acc.some((x) => x.currency.id === sale.currency.id)
          ? acc
          : [...acc, sale],
      [] as typeof sales,
    )
  }, [sales])

  const image = useMemo(() => {
    switch (sales.length) {
      case 0:
        return
      case 1: {
        const sale = sales[0]
        if (!sale.currency.image) return
        return (
          <Box
            h={8}
            w={8}
            overflow="hidden"
            rounded="full"
            border="1px"
            borderColor="inherit"
          >
            <Image
              src={sale.currency.image}
              alt={`${sale.currency.symbol} Logo`}
              width={32}
              height={32}
            />
          </Box>
        )
      }
      default: {
        return (
          <Flex _first={{ ml: 0 }}>
            {salesWithUniqueCurrency.map((x, i) => (
              <Box
                h={8}
                w={8}
                overflow="hidden"
                rounded="full"
                border="1px"
                borderColor="inherit"
                ml={i > 0 ? -2 : undefined}
              >
                <Image
                  src={x.currency.image}
                  alt={`${x.currency.symbol} Logo`}
                  width={32}
                  height={32}
                />
              </Box>
            ))}
          </Flex>
        )
      }
    }
  }, [sales, salesWithUniqueCurrency])

  const subtitle = useMemo(() => {
    switch (sales.length) {
      case 0:
        return
      case 1:
        return (
          <Price amount={sales[0].unitPrice} currency={sales[0].currency} />
        )
      default:
        return salesWithUniqueCurrency.length === 1 ? (
          <Price amount={sales[0].unitPrice} currency={sales[0].currency} />
        ) : (
          t('sales.direct.summary.offer', { count: sales.length })
        )
    }
  }, [sales, salesWithUniqueCurrency, t])

  const caption = useMemo(() => {
    switch (sales.length) {
      case 0:
        return
      case 1:
        return isSingle ? undefined : t('sales.direct.summary.per-edition')
      default:
        return salesWithUniqueCurrency.length === 1
          ? isSingle
            ? undefined
            : t('sales.direct.summary.per-edition')
          : t('sales.direct.summary.available')
    }
  }, [sales, isSingle, salesWithUniqueCurrency, t])

  const title = useMemo(
    () =>
      sales.length > 1 && salesWithUniqueCurrency.length === 1
        ? t('sales.direct.summary.on-sale-from')
        : t('sales.direct.summary.on-sale-for'),
    [sales, salesWithUniqueCurrency, t],
  )

  return (
    <Flex wrap="wrap" gap={8}>
      <Flex direction="column" gap={3}>
        <Heading as="h5" variant="heading3">
          {title}
        </Heading>
        <Flex gap={2}>
          {image}
          <Heading as="h2" variant="subtitle">
            {subtitle}
            {caption && (
              <Heading as="span" variant="heading3" ml={3}>
                {caption}
              </Heading>
            )}
          </Heading>
        </Flex>
      </Flex>
      {sales.length === 1 && sales[0].expiredAt && (
        <Flex direction="column" gap={3}>
          <Heading as="h5" variant="heading3">
            {t('sales.direct.summary.expires')}
          </Heading>
          <Flex h="full" align="center" gap={1}>
            <Icon as={HiOutlineClock} h={5} w={5} />
            <Heading as="h5" variant="heading3">
              {formatDate(sales[0].expiredAt)}
            </Heading>
          </Flex>
        </Flex>
      )}
    </Flex>
  )
}

export default SaleDirectSummary

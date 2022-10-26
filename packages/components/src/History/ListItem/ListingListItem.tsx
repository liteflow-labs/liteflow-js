import { Flex, Icon, Text } from '@chakra-ui/react'
import { BigNumber } from '@ethersproject/bignumber'
import { formatDate } from '@nft/hooks'
import { FaTag } from '@react-icons/all-files/fa/FaTag'
import { HiBadgeCheck } from '@react-icons/all-files/hi/HiBadgeCheck'
import Trans from 'next-translate/Trans'
import React, { VFC } from 'react'
import Link from '../../Link/Link'
import { ListItem } from '../../List/List'
import Price from '../../Price/Price'
import WalletAddress from '../../Wallet/Address'

type IProps = {
  date: Date
  quantity: BigNumber
  unitPrice: BigNumber
  fromAddress: string
  from: {
    name: string | null
    image: string | null
    verified: boolean
  } | null
  currency: {
    decimals: number
    symbol: string
  } | null
}

const ListingListItem: VFC<IProps> = ({
  currency,
  fromAddress,
  from,
  quantity,
  date,
  unitPrice,
}) => {
  return (
    <ListItem
      image={<Icon as={FaTag} h={5} w={5} color="gray.400" />}
      label={
        <Trans
          ns="components"
          i18nKey="history.listing.listed"
          values={{ count: quantity.toNumber() }}
          components={[
            <Text as="span" color="brand.black" fontWeight="medium" />,
            currency ? (
              <Text
                as={Price}
                color="brand.black"
                fontWeight="medium"
                amount={unitPrice}
                currency={currency}
              />
            ) : (
              <span>-</span>
            ),
          ]}
        />
      }
      subtitle={
        <Trans
          ns="components"
          i18nKey="history.listing.by"
          components={[
            <Flex
              display="inline-flex"
              align="center"
              gap={1.5}
              as={Link}
              href={`/users/${fromAddress}`}
            >
              <Text
                as="span"
                title={from?.name || fromAddress}
                color="brand.black"
                fontWeight="medium"
              >
                {from?.name || <WalletAddress address={fromAddress} isShort />}
              </Text>
              {from?.verified && (
                <Icon as={HiBadgeCheck} color="brand.500" h={4} w={4} />
              )}
            </Flex>,
          ]}
        />
      }
      caption={
        <Text as="span" color="gray.400">
          {formatDate(date)}
        </Text>
      }
    />
  )
}

export default ListingListItem

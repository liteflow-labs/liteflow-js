import { Text } from '@chakra-ui/react'
import { formatAddress } from '@nft/hooks'
import Trans from 'next-translate/Trans'
import React from 'react'
import Price from '../../Price/Price'

export type IProps = {
  offer: {
    amount: string
    unitPrice: string
    currency: {
      decimals: number
      symbol: string
    }
    asset: {
      id: string
      image: string
      name: string
    }
  }
  trade: {
    quantity: string
    buyerAddress: string
    buyer: {
      username: string | null
    } | null
  } | null
}

export default function OfferPurchased({ offer, trade }: IProps): {
  link: string
  image: string
  children: JSX.Element
} {
  return {
    link: `/tokens/${offer.asset.id}`,
    image: offer.asset.image,
    children: trade ? (
      <Trans
        ns="components"
        i18nKey="notification.offer.purchased"
        components={[
          <Text as="span" fontWeight="bold" />,
          <Text as="span" fontWeight="bold" />,
          <Text as="span" fontWeight="bold" />,
          <Text as="span" fontWeight="bold">
            <Price amount={offer.unitPrice} currency={offer.currency} />
          </Text>,
        ]}
        values={{
          count: parseInt(trade.quantity, 10),
          name: offer.asset.name,
          account: trade.buyer?.username || formatAddress(trade.buyerAddress),
        }}
      />
    ) : (
      <Trans
        ns="components"
        i18nKey="notification.offer.purchased.short"
        components={[
          <Text as="span" fontWeight="bold" />,
          <Text as="span" fontWeight="bold">
            <Price amount={offer.unitPrice} currency={offer.currency} />
          </Text>,
        ]}
        values={{ name: offer.asset.name }}
      />
    ),
  }
}

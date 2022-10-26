import { Text } from '@chakra-ui/react'
import Trans from 'next-translate/Trans'
import React from 'react'
import Price from '../../Price/Price'

export type IProps = {
  offer: {
    unitPrice: string
    quantity: string
    asset: {
      id: string
      image: string
      name: string
    }
    currency: {
      decimals: number
      symbol: string
    }
  }
}

export default function BidAccepted({ offer }: IProps): {
  link: string
  image: string
  children: JSX.Element
} {
  return {
    link: `/tokens/${offer.asset.id}`,
    image: offer.asset.image,
    children: (
      <Trans
        ns="components"
        i18nKey="notification.bid.accepted"
        components={[
          <Text as="span" fontWeight="bold" />,
          <Text as="span" fontWeight="bold" />,
          <Text as="span" fontWeight="bold">
            <Price amount={offer.unitPrice} currency={offer.currency} />
          </Text>,
        ]}
        values={{ count: parseInt(offer.quantity, 10), name: offer.asset.name }}
      />
    ),
  }
}

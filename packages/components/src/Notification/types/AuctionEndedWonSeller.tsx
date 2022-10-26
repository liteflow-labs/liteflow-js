import { Text } from '@chakra-ui/react'
import Trans from 'next-translate/Trans'
import React from 'react'
import Price from '../../Price/Price'

export type IProps = {
  auction: {
    asset: {
      id: string
      image: string
      name: string
    }
  }
  offer: {
    amount: string
    currency: {
      decimals: number
      symbol: string
    }
  }
}

export default function AuctionEndedWonSeller({ auction, offer }: IProps): {
  link: string
  image: string
  children: JSX.Element
} {
  return {
    link: `/tokens/${auction.asset.id}`,
    image: auction.asset.image,
    children: (
      <Trans
        ns="components"
        i18nKey="notification.auction.ended.won-seller"
        components={[
          <Text as="span" fontWeight="bold" />,
          <Text as="span" fontWeight="bold">
            <Price amount={offer.amount} currency={offer.currency} />
          </Text>,
        ]}
        values={{ name: auction.asset.name }}
      />
    ),
  }
}

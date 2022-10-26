import { Text } from '@chakra-ui/react'
import Trans from 'next-translate/Trans'
import React from 'react'

export type IProps = {
  auction: {
    asset: {
      id: string
      image: string
      name: string
    }
  }
}

export default function AuctionEndedReservePriceSeller({ auction }: IProps): {
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
        i18nKey="notification.auction.ended.reserve-price-seller"
        components={[<Text as="span" fontWeight="bold" />]}
        values={{ name: auction.asset.name }}
      />
    ),
  }
}

import { Text } from '@chakra-ui/react'
import Trans from 'next-translate/Trans'
import React from 'react'

export type IProps = {
  offer: {
    asset: {
      id: string
      image: string
      name: string
    }
  }
}

export default function OfferExpired({ offer }: IProps): {
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
        i18nKey="notification.offer.expired"
        components={[<Text as="span" fontWeight="bold" />]}
        values={{ name: offer.asset.name }}
      />
    ),
  }
}

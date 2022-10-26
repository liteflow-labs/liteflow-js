import { Text } from '@chakra-ui/react'
import { formatAddress } from '@nft/hooks'
import Trans from 'next-translate/Trans'
import React from 'react'

export type IProps = {
  refereeAccount: {
    address: string
    username: string | null
    image: string | null
  }
}

export default function ReferralRefereeRegistered({ refereeAccount }: IProps): {
  link: string
  userImage: string | null
  userAddress: string
  children: JSX.Element
} {
  return {
    link: `/users/${refereeAccount.address}`,
    userImage: refereeAccount.image,
    userAddress: formatAddress(refereeAccount.address),
    children: (
      <Trans
        ns="components"
        i18nKey="notification.referral-referee-registered"
        components={[<Text as="span" fontWeight="bold" />]}
        values={{
          username:
            refereeAccount.username || formatAddress(refereeAccount.address),
        }}
      />
    ),
  }
}

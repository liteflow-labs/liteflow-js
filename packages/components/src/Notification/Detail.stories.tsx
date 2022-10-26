import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { AccountVerificationStatus, NotificationAction } from '../graphql'
import Detail from './Detail'

export default {
  title: 'Templates/Notification/Detail',
  component: Detail,
} as ComponentMeta<typeof Detail>

const Template: ComponentStory<typeof Detail> = (args) => <Detail {...args} />

const data = {
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hour ago
  accountVerification: {
    status: AccountVerificationStatus.Validated,
    account: {
      address: '0xfa1e52eb55a08e04c497d004bb7bd8d9ebcba9d3',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmWFQhvK3yXbDjPMnccfkpYiyiEP3DYRH7XYBJBE8CwV3E',
    },
  },
  auction: {
    asset: {
      id: '58362971627494992624046520962426828227416842488216963416548209195496280168580',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmdHBtAkP1e71zsqY85GZjee9FRvoxmgoYgR6ms33sFNQj',
      name: 'Cosmic view',
    },
  },
  offer: {
    amount: '4000',
    unitPrice: '4000',
    quantity: '1',
    asset: {
      id: '58362971627494992624046520962426828227416842488216975742177493416310123956549',
      image:
        'https://liteflow.mypinata.cloud/ipfs/Qmb6Kq8MpZpQT54XtgDnYmgM9qYd2TRnc2rM7KoLQcPADd',
      name: 'Great view',
    },
    currency: {
      decimals: 6,
      symbol: 'USDC',
    },
  },
}

export const AccountVerificationValidated = Template.bind({})
AccountVerificationValidated.args = {
  ...data,
  action: NotificationAction.AccountVerificationValidated,
}

export const AuctionBidCreated = Template.bind({})
AuctionBidCreated.args = {
  ...data,
  action: NotificationAction.AuctionBidCreated,
}

export const AuctionBidExpired = Template.bind({})
AuctionBidExpired.args = {
  ...data,
  action: NotificationAction.AuctionBidExpired,
}

export const AuctionEndedNoBids = Template.bind({})
AuctionEndedNoBids.args = {
  ...data,
  action: NotificationAction.AuctionEndedNobids,
}

export const AuctionEndedReservePriceBuyer = Template.bind({})
AuctionEndedReservePriceBuyer.args = {
  ...data,
  action: NotificationAction.AuctionEndedReservepriceBuyer,
}

export const AuctionEndedReservePriceSeller = Template.bind({})
AuctionEndedReservePriceSeller.args = {
  ...data,
  action: NotificationAction.AuctionEndedReservepriceSeller,
}

export const AuctionEndedWonBuyer = Template.bind({})
AuctionEndedWonBuyer.args = {
  ...data,
  action: NotificationAction.AuctionEndedWonBuyer,
}

export const AuctionEndedWonSeller = Template.bind({})
AuctionEndedWonSeller.args = {
  ...data,
  action: NotificationAction.AuctionEndedWonSeller,
}

export const AuctionExpired = Template.bind({})
AuctionExpired.args = {
  ...data,
  action: NotificationAction.AuctionExpired,
}

export const AuctionExpireSoon = Template.bind({})
AuctionExpireSoon.args = {
  ...data,
  action: NotificationAction.AuctionExpireSoon,
}

export const OpenBidExpiredSingleEdition = Template.bind({})
OpenBidExpiredSingleEdition.args = {
  ...data,
  action: NotificationAction.BidExpired,
}

export const OpenBidExpiredMultipleEdition = Template.bind({})
OpenBidExpiredMultipleEdition.args = {
  ...data,
  offer: {
    ...data.offer,
    unitPrice: '2000',
    quantity: '3',
  },
  action: NotificationAction.BidExpired,
}

export const DirectSaleExpired = Template.bind({})
DirectSaleExpired.args = {
  ...data,
  action: NotificationAction.OfferExpired,
}

export const BidAccepted = Template.bind({})
BidAccepted.args = {
  ...data,
  action: NotificationAction.BidAccepted,
}

export const BidCreatedSingle = Template.bind({})
BidCreatedSingle.args = {
  ...data,
  action: NotificationAction.BidCreated,
}

export const BidCreatedMultiple = Template.bind({})
BidCreatedMultiple.args = {
  ...data,
  offer: {
    ...data.offer,
    unitPrice: '2000',
    quantity: '3',
  },
  action: NotificationAction.BidCreated,
}

export const OfferPurchasedSingle = Template.bind({})
OfferPurchasedSingle.args = {
  ...data,
  action: NotificationAction.OfferPurchased,
}

export const OfferPurchasedMultiple = Template.bind({})
OfferPurchasedMultiple.args = {
  ...data,
  trade: {
    buyer: {
      username: 'Super buyer',
    },
    buyerAddress: '0xad367b82aacefed065d9a1f5ca53b2221780eb4f',
    quantity: '4',
  },
  action: NotificationAction.OfferPurchased,
}

export const OfferPurchasedMultipleFallback = Template.bind({})
OfferPurchasedMultipleFallback.args = {
  ...data,
  action: NotificationAction.OfferPurchased,
}

export const ReferralRefereeRegistered = Template.bind({})
ReferralRefereeRegistered.args = {
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hour ago
  action: NotificationAction.ReferralRefereeRegistered,
  refereeAccount: {
    address: '0xad367b82aacefed065d9a1f5ca53b2221780eb4f',
    username: 'Patrick',
    image: null,
  },
}

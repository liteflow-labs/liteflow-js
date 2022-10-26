import { VoidSigner } from '@ethersproject/abstract-signer'
import { BigNumber } from '@ethersproject/bignumber'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Detail from './Detail'

export default {
  title: 'Templates/Sales/Detail/Default',
  component: Detail,
} as ComponentMeta<typeof Detail>

const Template: ComponentStory<typeof Detail> = (args) => <Detail {...args} />

export const Default = Template.bind({})
Default.args = {
  assetId: '1',
  isSingle: true,
  isHomepage: false,
  currencies: [],
  onAuctionAccepted: async (id) => console.log(`auction accepted ${id}`),
  onOfferCanceled: async (id) => console.log(`offer canceled ${id}`),
}

export const LoggedIn = Template.bind({})
LoggedIn.args = {
  ...Default.args,
  signer: new VoidSigner('0x0000000000000000000000000000000000000000'),
  currentAccount: '0x0000000000000000000000000000000000000000',
}

export const Auction = Template.bind({})
Auction.args = {
  ...LoggedIn.args,
  auction: {
    id: '1',
    winningOffer: undefined,
    endAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    expireAt: new Date('2022-12-12T10:17:57.205'),
    reserveAmount: BigNumber.from(1).mul(BigNumber.from(10).pow(18)),
    currency: {
      image:
        'https://nft.liteflow.com/_next/image?url=https%3A%2F%2Fliteflow.mypinata.cloud%2Fipfs%2FQmWdK1GCQpPVcbfJNJPy32j5E7FsnQ3oRSKq3gJgRVWgP1&w=32&q=75',
      decimals: 18,
      symbol: 'USDC',
    },
  },
}

export const AuctionAsOwner = Template.bind({})
AuctionAsOwner.args = {
  ...Auction.args,
  isOwner: true,
  ownAllSupply: true,
}

export const AuctionWithBestBid = Template.bind({})
AuctionWithBestBid.args = {
  ...Auction.args,
  bestBid: {
    unitPrice: BigNumber.from(1).mul(BigNumber.from(10).pow(18)),
    amount: BigNumber.from(1).mul(BigNumber.from(10).pow(18)),
    maker: {
      address: '0xb5a15932be6caeef5d21ac704300bd45e10ff92d',
      name: 'Antho Buyer',
      image: undefined,
    },
    currency: {
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmWdK1GCQpPVcbfJNJPy32j5E7FsnQ3oRSKq3gJgRVWgP1',
      decimals: 18,
      symbol: 'USDC',
    },
  },
}

export const DirectSale = Template.bind({})
DirectSale.args = {
  ...LoggedIn.args,
  directSales: [
    {
      unitPrice: BigNumber.from(1).mul(BigNumber.from(10).pow(18)),
      currency: {
        id: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
        decimals: 18,
        symbol: 'USDC',
        image:
          'https://liteflow.mypinata.cloud/ipfs/QmWdK1GCQpPVcbfJNJPy32j5E7FsnQ3oRSKq3gJgRVWgP1',
      },
      id: '1',
      maker: {
        address: '0xb5a15932be6caeef5d21ac704300bd45e10ff92d',
        name: 'Antho Buyer',
        image: undefined,
        verified: true,
      },
      availableQuantity: BigNumber.from(1),
      expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  ],
}

export const DirectSaleForMultiple = Template.bind({})
DirectSaleForMultiple.args = {
  ...DirectSale.args,
  isSingle: false,
}

export const DirectSaleForMultipleWithAllSupplyOwned = Template.bind({})
DirectSaleForMultipleWithAllSupplyOwned.args = {
  ...DirectSaleForMultiple.args,
  ownAllSupply: true,
}

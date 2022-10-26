import { BigNumber } from '@ethersproject/bignumber'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import SaleAuctionInProgress from './Inprogress'

export default {
  title: 'Templates/Sales/Auction/Inprogress/Inprogress',
  component: SaleAuctionInProgress,
} as ComponentMeta<typeof SaleAuctionInProgress>

const Template: ComponentStory<typeof SaleAuctionInProgress> = (args) => (
  <SaleAuctionInProgress {...args} />
)

export const Default = Template.bind({})
Default.args = {
  auction: {
    endAt: new Date(Date.now() + 10 * 60 * 60 * 1000),
    currency: {
      image:
        'https://nft.liteflow.com/_next/image?url=https%3A%2F%2Fliteflow.mypinata.cloud%2Fipfs%2FQmWdK1GCQpPVcbfJNJPy32j5E7FsnQ3oRSKq3gJgRVWgP1&w=32&q=75',
      symbol: 'USDC',
    },
  },
}

export const WithBid = Template.bind({})
WithBid.args = {
  ...Default.args,
  bestBid: {
    unitPrice: BigNumber.from('200').mul(BigNumber.from('10').pow(18)),
    currency: {
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmWdK1GCQpPVcbfJNJPy32j5E7FsnQ3oRSKq3gJgRVWgP1',
      decimals: 18,
      symbol: 'USDC',
    },
  },
}

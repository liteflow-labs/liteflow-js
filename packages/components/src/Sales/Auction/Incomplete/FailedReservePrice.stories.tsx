import { BigNumber } from '@ethersproject/bignumber'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import AuctionEndedFailedReservePrice from './FailedReservePrice'

export default {
  title: 'Templates/Sales/Auction/Incomplete/Failed Reserve Price',
  component: AuctionEndedFailedReservePrice,
} as ComponentMeta<typeof AuctionEndedFailedReservePrice>

const Template: ComponentStory<typeof AuctionEndedFailedReservePrice> = (
  args,
) => <AuctionEndedFailedReservePrice {...args} />

export const Default = Template.bind({})
Default.args = {
  bestBid: {
    maker: {
      address: '0xb5a15932be6caeef5d21ac704300bd45e10ff92d',
      name: 'Antho Buyer',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmWFQhvK3yXbDjPMnccfkpYiyiEP3DYRH7XYBJBE8CwV3E',
    },
    unitPrice: BigNumber.from('200').mul(BigNumber.from('10').pow(18)),
    currency: {
      decimals: 18,
      symbol: 'USDC',
    },
  },
  isOwner: false,
}

export const AsOwner = Template.bind({})
AsOwner.args = {
  ...Default.args,
  isOwner: true,
}

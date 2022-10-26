import { BigNumber } from '@ethersproject/bignumber'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import SaleAuctionIncompleteSuccess from './Successfully'

export default {
  title: 'Templates/Sales/Auction/Incomplete/Successfully',
  component: SaleAuctionIncompleteSuccess,
} as ComponentMeta<typeof SaleAuctionIncompleteSuccess>

const Template: ComponentStory<typeof SaleAuctionIncompleteSuccess> = (
  args,
) => <SaleAuctionIncompleteSuccess {...args} />

export const Default = Template.bind({})
Default.args = {
  auction: {
    expireAt: new Date(Date.now() + 10 * 60 * 60 * 1000),
  },
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

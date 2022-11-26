import { BigNumber } from '@ethersproject/bignumber'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Card from './Card'

export default {
  title: 'Templates/Token/Card',
  component: Card,
} as ComponentMeta<typeof Card>

const Template: ComponentStory<typeof Card> = (args) => <Card {...args} />

export const AuctionCard = Template.bind({})
AuctionCard.args = {
  asset: {
    standard: 'ERC721',
    id: '1',
    name: 'My NFT',
    animationUrl: undefined,
    image:
      'https://liteflow.mypinata.cloud/ipfs/QmNxNpwuqentg7U4kLdYD5U1BJRTNA8FJT3zVnyAaquHnj',
    unlockedContent: null,
  },
  auction: {
    endAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    bestBid: {
      unitPrice: BigNumber.from('1').mul(BigNumber.from(10).pow(18)),
      currency: {
        decimals: 18,
        symbol: 'USDC',
      },
    },
  },
  sale: undefined,
  creator: {
    address: '0x4b595014f7b45789c3f4e79324ae6d8090a6c8b5',
    name: 'Antho Creator',
    verified: false,
    image:
      'https://liteflow.mypinata.cloud/ipfs/QmWFQhvK3yXbDjPMnccfkpYiyiEP3DYRH7XYBJBE8CwV3E',
  },
}

export const DirectCard = Template.bind({})
DirectCard.args = {
  asset: AuctionCard.args.asset,
  creator: AuctionCard.args.creator,
  auction: undefined,
  sale: {
    unitPrice: BigNumber.from('1').mul(BigNumber.from(10).pow(18)),
    currency: {
      decimals: 18,
      symbol: 'USDC',
    },
  },
}

export const OpenCard = Template.bind({})
OpenCard.args = {
  asset: AuctionCard.args.asset,
  creator: AuctionCard.args.creator,
  auction: undefined,
  sale: undefined,
}

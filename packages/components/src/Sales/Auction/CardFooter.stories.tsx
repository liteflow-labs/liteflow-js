import { BigNumber } from '@ethersproject/bignumber'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import CardFooter from './CardFooter'

export default {
  title: 'Templates/Sales/Auction/CardFooter',
  component: CardFooter,
} as ComponentMeta<typeof CardFooter>

const Template: ComponentStory<typeof CardFooter> = (args) => (
  <CardFooter {...args} />
)

export const WithBid = Template.bind({})
WithBid.args = {
  endAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  bestBid: {
    unitPrice: BigNumber.from('200').mul(BigNumber.from(10).pow(18)),
    currency: {
      decimals: 18,
      symbol: 'USDC',
    },
  },
  href: '/',
}

export const WithoutBid = Template.bind({})
WithoutBid.args = {
  endAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  href: '/',
}

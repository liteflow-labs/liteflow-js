import { BigNumber } from '@ethersproject/bignumber'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import CardFooter from './CardFooter'

export default {
  title: 'Templates/Sales/Direct/CardFooter',
  component: CardFooter,
} as ComponentMeta<typeof CardFooter>

const Template: ComponentStory<typeof CardFooter> = (args) => (
  <CardFooter {...args} />
)

export const Default = Template.bind({})
Default.args = {
  unitPrice: BigNumber.from('200').mul(BigNumber.from(10).pow(18)),
  currency: {
    decimals: 18,
    symbol: 'USDC',
  },
  numberOfSales: 1,
  href: '/',
}

export const Multiple = Template.bind({})
Multiple.args = {
  ...Default.args,
  numberOfSales: 4,
  href: '/',
}

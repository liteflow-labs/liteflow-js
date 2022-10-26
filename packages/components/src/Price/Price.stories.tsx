import { BigNumber } from '@ethersproject/bignumber'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Price from './Price'

export default {
  title: 'Templates/Price/Price',
  component: Price,
} as ComponentMeta<typeof Price>

const Template: ComponentStory<typeof Price> = (args) => <Price {...args} />

export const Default = Template.bind({})
Default.args = {
  amount: BigNumber.from('100').mul(BigNumber.from(10).pow(18)),
  currency: {
    decimals: 18,
    symbol: 'USDC',
  },
}

export const WithDecimals = Template.bind({})
WithDecimals.args = {
  amount: BigNumber.from('5438').mul(BigNumber.from(10).pow(0)),
  currency: {
    decimals: 18,
    symbol: 'USDC',
  },
  averageFrom: 1000,
}

export const WithAverageThousands = Template.bind({})
WithAverageThousands.args = {
  amount: BigNumber.from('124812').mul(BigNumber.from(10).pow(18)),
  currency: {
    decimals: 18,
    symbol: 'USDC',
  },
  averageFrom: 1000,
}

export const WithAverageThousandsNoDecimals = Template.bind({})
WithAverageThousandsNoDecimals.args = {
  amount: BigNumber.from('1000').mul(BigNumber.from(10).pow(18)),
  currency: {
    decimals: 18,
    symbol: 'USDC',
  },
  averageFrom: 1000,
}

export const WithAverageMillions = Template.bind({})
WithAverageMillions.args = {
  amount: BigNumber.from('1456434').mul(BigNumber.from(10).pow(18)),
  currency: {
    decimals: 18,
    symbol: 'USDC',
  },
  averageFrom: 1000000,
}

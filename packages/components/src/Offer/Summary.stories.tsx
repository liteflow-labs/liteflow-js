import { BigNumber } from '@ethersproject/bignumber'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Summary from './Summary'

export default {
  title: 'Templates/Offer/Summary',
  component: Summary,
} as ComponentMeta<typeof Summary>

const Template: ComponentStory<typeof Summary> = (args) => <Summary {...args} />

export const Default = Template.bind({})
Default.args = {
  currency: {
    decimals: 18,
    symbol: 'USDC',
  },
  isSingle: true,
  price: BigNumber.from('400').mul(BigNumber.from(10).pow(18)),
  quantity: BigNumber.from(200),
}

export const Multiple = Template.bind({})
Multiple.args = {
  ...Default.args,
  isSingle: false,
}

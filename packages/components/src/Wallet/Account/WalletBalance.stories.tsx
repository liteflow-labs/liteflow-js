import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import WalletBalance from './WalletBalance'

export default {
  title: 'Templates/Wallet/WalletBalance',
  component: WalletBalance,
} as ComponentMeta<typeof WalletBalance>

const Template: ComponentStory<typeof WalletBalance> = (args) => (
  <WalletBalance {...args} />
)

export const Default = Template.bind({})
Default.args = {
  account: '0xaa6510ac710e97d2a6a280658b5f641da79891fe',
  currency: {
    decimals: 6,
    id: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
    symbol: 'USDC',
  },
}

import { VoidSigner } from '@ethersproject/abstract-signer'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Balance from './Balance'

export default {
  title: 'Templates/User/Balance',
  component: Balance,
} as ComponentMeta<typeof Balance>

const Template: ComponentStory<typeof Balance> = (args) => <Balance {...args} />

export const Default = Template.bind({})
Default.args = {
  signer: new VoidSigner('0x4b595014f7b45789c3f4e79324ae6d8090a6c8b5'),
  account: '0x4b595014f7b45789c3f4e79324ae6d8090a6c8b5',
  currency: {
    id: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
    decimals: 18,
    symbol: 'USDC',
  },
  allowTopUp: false,
}

export const AllowTopUp = Template.bind({})
AllowTopUp.args = {
  ...Default.args,
  allowTopUp: true,
}

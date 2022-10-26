import { VoidSigner } from '@ethersproject/abstract-signer'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Checkout from './Checkout'

export default {
  title: 'Templates/Offer/Form/Checkout',
  component: Checkout,
} as ComponentMeta<typeof Checkout>

const Template: ComponentStory<typeof Checkout> = (args) => (
  <Checkout {...args} />
)

export const Default = Template.bind({})
Default.args = {
  allowTopUp: true,
  offer: {
    id: '1',
    unitPrice: '2500000000',
    availableQuantity: '10',
  },
  currency: {
    id: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
    decimals: 18,
    symbol: 'USDC',
  },
  multiple: false,
  onPurchased: () => console.log('purchased'),
  login: {
    email: true,
    metamask: true,
    coinbase: true,
    walletConnect: true,
    networkName: 'Ropsten',
  },
}

export const LoggedIn = Template.bind({})
LoggedIn.args = {
  ...Default.args,
  signer: new VoidSigner('0x0'),
  account: '0x0',
}

export const Multiple = Template.bind({})
Multiple.args = {
  ...Default.args,
  multiple: true,
}

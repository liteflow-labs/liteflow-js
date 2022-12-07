import { EmailConnector } from '@nft/email-connector'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
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
    email: new EmailConnector({
      apiKey: 'xxx',
      options: { network: { chainId: 1, rpcUrl: 'xxx' } },
    }),
    injected: new InjectedConnector({}),
    coinbase: new WalletLinkConnector({ appName: 'xxx', url: 'xxx' }),
    walletConnect: new WalletConnectConnector({}),
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

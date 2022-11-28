import { EmailConnector } from '@nft/email-connector'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import React, { ComponentMeta, ComponentStory } from '@storybook/react'
import Login from './Login'

export default {
  title: 'Templates/Modals/Login',
  component: Login,
} as ComponentMeta<typeof Login>

const Template: ComponentStory<typeof Login> = (args) => <Login {...args} />

export const Default = Template.bind({})
Default.args = {
  isOpen: true,
  email: new EmailConnector({
    apiKey: 'xxx',
    options: { network: { chainId: 1, rpcUrl: 'xxx' } },
  }),
  injected: new InjectedConnector({}),
  coinbase: new WalletLinkConnector({ appName: 'xxx', url: 'xxx' }),
  walletConnect: new WalletConnectConnector({}),
  networkName: 'Mainnet',
}

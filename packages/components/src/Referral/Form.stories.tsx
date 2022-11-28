import { EmailConnector } from '@nft/email-connector'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Form from './Form'

export default {
  title: 'Templates/Referral/Form',
  component: Form,
} as ComponentMeta<typeof Form>

const Template: ComponentStory<typeof Form> = (args) => <Form {...args} />

export const Default = Template.bind({})

Default.args = {
  login: {
    email: new EmailConnector({
      apiKey: 'xxx',
      options: { network: { chainId: 1, rpcUrl: 'xxx' } },
    }),
    injected: new InjectedConnector({}),
    coinbase: new WalletLinkConnector({ appName: 'xxx', url: 'xxx' }),
    walletConnect: new WalletConnectConnector({}),
    networkName: 'test',
  },
  loginUrl: 'http://localhost:3000/login',
}

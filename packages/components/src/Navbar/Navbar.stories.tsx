import { EmailConnector } from '@nft/email-connector'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Navbar from './Navbar'

export default {
  title: 'Templates/Navbar/Navbar',
  component: Navbar,
} as ComponentMeta<typeof Navbar>

const Template: ComponentStory<typeof Navbar> = (args) => <Navbar {...args} />

export const Default = Template.bind({})
Default.args = {
  allowTopUp: false,
  router: {
    asPath: '/',
    query: {},
    push: async () => true,
    isReady: true,
    events: {
      on: (...args) => console.log('on', ...args),
      off: (...args) => console.log('off', ...args),
      emit: (...args) => console.log('emit', ...args),
    },
  },
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
  multiLang: {
    locale: 'en',
    pathname: '/',
    choices: [
      { label: 'En', value: 'en' },
      { label: '日本語', value: 'ja' },
      { label: '中文', value: 'zh-cn' },
    ],
  },
}

export const AllowTopUp = Template.bind({})
AllowTopUp.args = {
  ...Default.args,
  allowTopUp: true,
}

export const DisableMinting = Template.bind({})
DisableMinting.args = {
  ...Default.args,
  disableMinting: true,
}

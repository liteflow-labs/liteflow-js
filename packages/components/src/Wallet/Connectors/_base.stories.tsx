import { ComponentMeta, ComponentStory } from '@storybook/react'
import { AbstractConnector } from '@web3-react/abstract-connector'
import React from 'react'
import { IconCoinbase } from './Coinbase'
import { IconMetamask } from './Metamask'
import { IconWalletConnect } from './WalletConnect'
import Base from './_base'

export default {
  title: 'Templates/Wallet/Connectors',
  component: Base,
} as ComponentMeta<typeof Base>

const Template: ComponentStory<typeof Base> = (args) => <Base {...args} />

class DumbConnector extends AbstractConnector {
  public getProviderName() {
    return 'dummy'
  }

  public async activate() {
    return Promise.resolve({})
  }

  public async getProvider() {
    return Promise.resolve()
  }

  public async getChainId() {
    return Promise.resolve(1)
  }

  public async getAccount() {
    return Promise.resolve('0x0')
  }

  public async isActivated() {
    return Promise.resolve()
  }

  public async deactivate() {
    return Promise.resolve()
  }
}

export const Coinbase = Template.bind({})
Coinbase.args = {
  connector: new DumbConnector(),
  icon: IconCoinbase,
  name: 'Coinbase',
  onError: (error?: Error) => console.log(error),
  activate: async () => console.log('authenticated'),
}

export const Metamask = Template.bind({})
Metamask.args = {
  connector: new DumbConnector(),
  icon: IconMetamask,
  name: 'Metamask',
  onError: (error?: Error) => console.log(error),
  activate: async () => console.log('authenticated'),
}

export const WalletConnect = Template.bind({})
WalletConnect.args = {
  connector: new DumbConnector(),
  icon: IconWalletConnect,
  name: 'WalletConnect',
  onError: (error?: Error) => console.log(error),
  activate: async () => console.log('authenticated'),
}

export const Loading = Template.bind({})
Loading.args = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore This is to force the loading state
  connector: null,
  icon: IconCoinbase,
  name: 'Loading',
  onError: (error?: Error) => console.log(error),
  activate: async () => console.log('authenticated'),
}

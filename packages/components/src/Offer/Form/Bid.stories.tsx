import { EmailConnector } from '@nft/email-connector'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { VoidSigner } from '@ethersproject/abstract-signer'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Bid from './Bid'

export default {
  title: 'Templates/Offer/Form/Bid',
  component: Bid,
} as ComponentMeta<typeof Bid>

const Template: ComponentStory<typeof Bid> = (args) => <Bid {...args} />

export const Default = Template.bind({})
Default.args = {
  currencies: [
    {
      id: '1',
      name: 'USDC',
      image:
        'https://nft.liteflow.com/_next/image?url=https%3A%2F%2Fliteflow.mypinata.cloud%2Fipfs%2FQmWdK1GCQpPVcbfJNJPy32j5E7FsnQ3oRSKq3gJgRVWgP1&w=32&q=75',
      decimals: 18,
      symbol: 'USDC',
    },
  ],
  assetId: '1',
  onCreated: async (offerId: string) => console.log('onAccepted: ', offerId),
  offerValidity: 2419200,
  auctionValidity: 1209600,
  feesPerTenThousand: 250,
  allowTopUp: false,
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

export const WithAuction = Template.bind({})
WithAuction.args = {
  ...Default.args,
  auctionId: '1',
}

export const MultiCurrency = Template.bind({})
MultiCurrency.args = {
  ...Default.args,
  currencies: [
    {
      id: '1',
      name: 'Liteflow',
      image:
        'https://nft.liteflow.com/_next/image?url=https%3A%2F%2Fliteflow.mypinata.cloud%2Fipfs%2FQmWdK1GCQpPVcbfJNJPy32j5E7FsnQ3oRSKq3gJgRVWgP1&w=32&q=75',
      decimals: 18,
      symbol: 'LTF',
    },
    {
      id: '2',
      name: 'USDC',
      image:
        'https://nft.liteflow.com/_next/image?url=https%3A%2F%2Fliteflow.mypinata.cloud%2Fipfs%2FQmWdK1GCQpPVcbfJNJPy32j5E7FsnQ3oRSKq3gJgRVWgP1&w=32&q=75',
      decimals: 18,
      symbol: 'USDC',
    },
  ],
}

export const LoggedIn = Template.bind({})
LoggedIn.args = {
  ...Default.args,
  signer: new VoidSigner('0x0'),
  account: '0x0',
}

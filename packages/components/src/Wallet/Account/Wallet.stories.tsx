import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Wallet from './Wallet'

export default {
  title: 'Templates/Wallet/Wallet',
  component: Wallet,
} as ComponentMeta<typeof Wallet>

const Template: ComponentStory<typeof Wallet> = (args) => <Wallet {...args} />

export const Default = Template.bind({})
Default.args = {
  account: '0xaa6510ac710e97d2a6a280658b5f641da79891fe',
  currencies: [
    {
      decimals: 6,
      id: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmWdK1GCQpPVcbfJNJPy32j5E7FsnQ3oRSKq3gJgRVWgP1',
      name: 'USDC',
      symbol: 'USDC',
    },
    {
      decimals: 6,
      id: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmWdK1GCQpPVcbfJNJPy32j5E7FsnQ3oRSKq3gJgRVWgP1',
      name: 'USDC',
      symbol: 'USDC',
    },
    {
      decimals: 6,
      id: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmWdK1GCQpPVcbfJNJPy32j5E7FsnQ3oRSKq3gJgRVWgP1',
      name: 'USDC',
      symbol: 'USDC',
    },
    {
      decimals: 6,
      id: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmWdK1GCQpPVcbfJNJPy32j5E7FsnQ3oRSKq3gJgRVWgP1',
      name: 'USDC',
      symbol: 'USDC',
    },
  ],
  networkName: 'BSC Testnet',
}

import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import WalletBalanceList from './WalletBalanceList'

export default {
  title: 'Templates/Wallet/WalletBalanceList',
  component: WalletBalanceList,
} as ComponentMeta<typeof WalletBalanceList>

const Template: ComponentStory<typeof WalletBalanceList> = (args) => (
  <WalletBalanceList {...args} />
)

const currencies = [
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
]

export const Default = Template.bind({})
Default.args = {
  account: '0xaa6510ac710e97d2a6a280658b5f641da79891fe',
  currencies: currencies,
}

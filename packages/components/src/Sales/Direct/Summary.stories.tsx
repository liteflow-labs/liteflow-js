import { BigNumber } from '@ethersproject/bignumber'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Summary from './Summary'

export default {
  title: 'Templates/Sales/Direct/Summary',
  component: Summary,
} as ComponentMeta<typeof Summary>

const Template: ComponentStory<typeof Summary> = (args) => <Summary {...args} />

export const Default = Template.bind({})
Default.args = {
  sales: [
    {
      expiredAt: undefined,
      unitPrice: BigNumber.from('200').mul(BigNumber.from(10).pow(18)),
      currency: {
        id: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
        image:
          'https://liteflow.mypinata.cloud/ipfs/QmWdK1GCQpPVcbfJNJPy32j5E7FsnQ3oRSKq3gJgRVWgP1',
        decimals: 18,
        symbol: 'USDC',
      },
    },
  ],
  isSingle: true,
}

export const IsMultiple = Template.bind({})
IsMultiple.args = {
  ...Default.args,
  isSingle: false,
}

export const SingleExpired = Template.bind({})
SingleExpired.args = {
  ...Default.args,
  sales: [
    {
      expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      unitPrice: BigNumber.from('200').mul(BigNumber.from(10).pow(18)),
      currency: {
        id: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
        image:
          'https://liteflow.mypinata.cloud/ipfs/QmWdK1GCQpPVcbfJNJPy32j5E7FsnQ3oRSKq3gJgRVWgP1',
        decimals: 18,
        symbol: 'USDC',
      },
    },
  ],
}

export const MultipleSales = Template.bind({})
MultipleSales.args = {
  ...IsMultiple.args,
  sales: [
    {
      expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      unitPrice: BigNumber.from('200').mul(BigNumber.from(10).pow(18)),
      currency: {
        id: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
        image:
          'https://liteflow.mypinata.cloud/ipfs/QmWdK1GCQpPVcbfJNJPy32j5E7FsnQ3oRSKq3gJgRVWgP1',
        decimals: 18,
        symbol: 'USDC',
      },
    },
    {
      expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      unitPrice: BigNumber.from('250').mul(BigNumber.from(10).pow(18)),
      currency: {
        id: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
        image:
          'https://liteflow.mypinata.cloud/ipfs/QmWdK1GCQpPVcbfJNJPy32j5E7FsnQ3oRSKq3gJgRVWgP1',
        decimals: 18,
        symbol: 'USDC',
      },
    },
  ],
}

export const MultipleCurrencies = Template.bind({})
MultipleCurrencies.args = {
  ...IsMultiple.args,
  sales: [
    {
      expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      unitPrice: BigNumber.from('200').mul(BigNumber.from(10).pow(18)),
      currency: {
        id: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
        image:
          'https://liteflow.mypinata.cloud/ipfs/QmWdK1GCQpPVcbfJNJPy32j5E7FsnQ3oRSKq3gJgRVWgP1',
        decimals: 18,
        symbol: 'USDC',
      },
    },
    {
      expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      unitPrice: BigNumber.from('250').mul(BigNumber.from(10).pow(18)),
      currency: {
        id: '0x17865c6e87b9f70255377e024ace6630c1eaa37f',
        image:
          'https://liteflow.mypinata.cloud/ipfs/QmRfuRH7DHBqFeJnkzhvehM56a9Ym6vCHPM1Jssm5fjTKv',
        decimals: 18,
        symbol: 'BUSD',
      },
    },
  ],
}

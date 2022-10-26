import { VoidSigner } from '@ethersproject/abstract-signer'
import { BigNumber } from '@ethersproject/bignumber'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import BidList from './BidList'

export default {
  title: 'Templates/Bid/List',
  component: BidList,
} as ComponentMeta<typeof BidList>

const Template: ComponentStory<typeof BidList> = (args) => <BidList {...args} />

const bids = [
  {
    id: '1',
    unitPrice: BigNumber.from('1').mul(BigNumber.from(10).pow(18)),
    availableQuantity: BigNumber.from('1'),
    maker: {
      address: '0x4b595014f7b45789c3f4e79324ae6d8090a6c8b5',
      name: 'Antho Creator',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmWFQhvK3yXbDjPMnccfkpYiyiEP3DYRH7XYBJBE8CwV3E',
      verified: true,
    },
    createdAt: new Date('2022-02-20T16:42:31.119304+00:00'),
    expiredAt: new Date('2022-03-20T16:42:31.119304+00:00'),
    currency: {
      id: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
      decimals: 18,
      symbol: 'USDC',
    },
  },
  {
    id: '2',
    unitPrice: BigNumber.from('3').mul(BigNumber.from(10).pow(18)),
    availableQuantity: BigNumber.from('1'),
    maker: {
      address: '0x0000000000000000000000000000000000000000',
      image: undefined,
      name: 'Mr nobody',
      verified: false,
    },
    createdAt: new Date('2022-02-20T16:42:31.119304+00:00'),
    expiredAt: new Date('2022-03-20T16:42:31.119304+00:00'),
    currency: {
      id: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
      decimals: 18,
      symbol: 'USDC',
    },
  },
]

const multiCurrencyBids = [
  ...bids,
  {
    id: '3',
    unitPrice: BigNumber.from('10').mul(BigNumber.from(10).pow(18)),
    availableQuantity: BigNumber.from('1'),
    maker: {
      address: '0x4b595014f7b45789c3f4e79324ae6d8090a6c8b5',
      name: 'Antho Creator',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmWFQhvK3yXbDjPMnccfkpYiyiEP3DYRH7XYBJBE8CwV3E',
      verified: true,
    },
    createdAt: new Date('2022-02-10T10:12:31.119304+00:00'),
    expiredAt: new Date('2022-03-10T10:12:31.119304+00:00'),
    currency: {
      id: '0x07865c6e87b9f70255377e024ace6630c1eaa37a',
      decimals: 18,
      symbol: 'LTF',
    },
  },
]

export const Default = Template.bind({})
Default.args = {
  bids,
  isSingle: true,
  onAccepted: async (id: string) => console.log('onAccepted: ', id),
  onCanceled: async (id: string) => console.log('onCanceled: ', id),
}

export const MultipleBid = Template.bind({})
MultipleBid.args = {
  ...Default.args,
  bids,
  isSingle: false,
}

export const AsAssetOwner = Template.bind({})
AsAssetOwner.args = {
  ...Default.args,
  signer: new VoidSigner('0x0000000000000000000000000000000000000001'),
  account: '0x0000000000000000000000000000000000000001',
  preventAcceptation: false,
}

export const AsBidder = Template.bind({})
AsBidder.args = {
  ...Default.args,
  preventAcceptation: true,
  signer: new VoidSigner('0x4b595014f7b45789c3f4e79324ae6d8090a6c8b5'),
  account: '0x4b595014f7b45789c3f4e79324ae6d8090a6c8b5',
}

export const MultiCurrency = Template.bind({})
MultiCurrency.args = {
  ...Default.args,
  bids: multiCurrencyBids,
  preventAcceptation: true,
}

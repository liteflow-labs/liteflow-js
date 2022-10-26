import { VoidSigner } from '@ethersproject/abstract-signer'
import { BigNumber } from '@ethersproject/bignumber'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Bid from './Bid'

export default {
  title: 'Templates/Bid/Bid',
  component: Bid,
} as ComponentMeta<typeof Bid>

const Template: ComponentStory<typeof Bid> = (args) => <Bid {...args} />

export const Default = Template.bind({})
Default.args = {
  bid: {
    id: '5bc5c307-fb59-4ff2-a351-c301e48f2d1d',
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
      decimals: 18,
      symbol: 'USDC',
    },
  },
  isSingle: true,
  onAccepted: async (id: string) => console.log('onAccepted: ', id),
  onCanceled: async (id: string) => console.log('onCanceled: ', id),
}

export const MultipleBid = Template.bind({})
MultipleBid.args = {
  ...Default.args,
  bid: {
    id: '5bc5c307-fb59-4ff2-a351-c301e48f2d1d',
    unitPrice: BigNumber.from('1').mul(BigNumber.from(10).pow(18)),
    availableQuantity: BigNumber.from('20'),
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
      decimals: 18,
      symbol: 'USDC',
    },
  },
  isSingle: false,
}

export const AsAssetOwner = Template.bind({})
AsAssetOwner.args = {
  ...Default.args,
  signer: new VoidSigner('0x0000000000000000000000000000000000000000'),
  account: '0x0000000000000000000000000000000000000000',
  preventAcceptation: false,
}

export const AsBidder = Template.bind({})
AsBidder.args = {
  ...Default.args,
  preventAcceptation: true,
  signer: new VoidSigner(Default.args.bid?.maker.address || ''),
  account: Default.args.bid?.maker.address,
}

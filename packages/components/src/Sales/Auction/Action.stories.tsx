import { VoidSigner } from '@ethersproject/abstract-signer'
import { BigNumber } from '@ethersproject/bignumber'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Action from './Action'

export default {
  title: 'Templates/Sales/Auction/Action',
  component: Action,
} as ComponentMeta<typeof Action>

const Template: ComponentStory<typeof Action> = (args) => <Action {...args} />

export const Default = Template.bind({})
Default.args = {
  signer: new VoidSigner('0x0000000000000000000000000000000000000000'),
  auction: {
    id: '1',
    expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    endAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
    reserveAmount: BigNumber.from(1).mul(BigNumber.from(10).pow(18)),
    winningOffer: undefined,
    asset: {
      id: '1',
    },
  },
  bestBid: {
    amount: BigNumber.from(1).mul(BigNumber.from(10).pow(18)),
  },
  blockExplorer: {
    name: 'Etherscan',
    token: () => `token`,
    transaction: () => `transaction`,
  },
  onAuctionAccepted: async (id) => console.log(`auction accepted ${id}`),
}

import { BigNumber } from '@ethersproject/bignumber'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Header from './Header'

export default {
  title: 'Templates/Token/Header',
  component: Header,
} as ComponentMeta<typeof Header>

const Template: ComponentStory<typeof Header> = (args) => <Header {...args} />

export const Default = Template.bind({})
Default.args = {
  asset: {
    id: '1',
    image:
      'https://liteflow.mypinata.cloud/ipfs/QmNxNpwuqentg7U4kLdYD5U1BJRTNA8FJT3zVnyAaquHnj',
    name: 'Cryptamus®',
    saleSupply: BigNumber.from(1),
    totalSupply: BigNumber.from(1),
    standard: 'ERC721',
    animationUrl: undefined,
    unlockedContent: null,
    owned: BigNumber.from(1),
  },
  auction: undefined,
  bestBid: undefined,
  creator: {
    address: '0x0000000000000000000000000000000000000000',
    image:
      'https://liteflow.mypinata.cloud/ipfs/QmNxNpwuqentg7U4kLdYD5U1BJRTNA8FJT3zVnyAaquHnj',
    name: 'Cryptamus®',
    verified: false,
  },
  signer: undefined,
  currentAccount: undefined,
  isHomepage: false,
  onAuctionAccepted: async (id) => console.log('accepted', id),
  onOfferCanceled: async (id) => console.log('canceled', id),
  sales: [],
  owners: [
    {
      address: '0x0000000000000000000000000000000000000000',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmNxNpwuqentg7U4kLdYD5U1BJRTNA8FJT3zVnyAaquHnj',
      name: 'Cryptamus®',
      verified: false,
      quantity: '1',
    },
  ],
  currencies: [],
}

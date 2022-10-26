import { VoidSigner } from '@ethersproject/abstract-signer'
import { BigNumber } from '@ethersproject/bignumber'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Info from './Info'

export default {
  title: 'Templates/Sales/Auction/Info',
  component: Info,
} as ComponentMeta<typeof Info>

const Template: ComponentStory<typeof Info> = (args) => <Info {...args} />

export const Default = Template.bind({})
Default.args = {
  assetId: '1',
  auction: {
    id: '1',
    reserveAmount: BigNumber.from(1).mul(BigNumber.from(10).pow(18)),
    currency: {
      decimals: 18,
      symbol: 'USDC',
      image:
        'https://nft.liteflow.com/_next/image?url=https%3A%2F%2Fliteflow.mypinata.cloud%2Fipfs%2FQmWdK1GCQpPVcbfJNJPy32j5E7FsnQ3oRSKq3gJgRVWgP1&w=32&q=75',
    },
  },
  onAuctionAccepted: async (id) => console.log(`auction accepted ${id}`),
}

export const InProgress = Template.bind({})
InProgress.args = {
  ...Default.args,
  inProgress: true,
}

export const InProgressOwner = Template.bind({})
InProgressOwner.args = {
  ...InProgress.args,
  signer: new VoidSigner('0x0000000000000000000000000000000000000000'),
  isOwner: true,
}

export const EndsWithNoBids = Template.bind({})
EndsWithNoBids.args = {
  ...Default.args,
  endedWithNoBids: true,
}

export const EndsWithNoBidsOwner = Template.bind({})
EndsWithNoBidsOwner.args = {
  ...EndsWithNoBids.args,
  signer: new VoidSigner('0x0000000000000000000000000000000000000000'),
  isOwner: true,
}

export const EndsWithNoReserve = Template.bind({})
EndsWithNoReserve.args = {
  ...Default.args,
  endedWithNoReserve: true,
}

export const EndsWithNoReserveOwner = Template.bind({})
EndsWithNoReserveOwner.args = {
  ...EndsWithNoReserve.args,
  signer: new VoidSigner('0x0000000000000000000000000000000000000000'),
  isOwner: true,
}

export const EndsWithReserve = Template.bind({})
EndsWithReserve.args = {
  ...Default.args,
  endedWithReserve: true,
}

export const EndsWithReserveOwner = Template.bind({})
EndsWithReserveOwner.args = {
  ...EndsWithReserve.args,
  signer: new VoidSigner('0x0000000000000000000000000000000000000000'),
  isOwner: true,
}

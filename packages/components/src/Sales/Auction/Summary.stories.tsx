import { BigNumber } from '@ethersproject/bignumber'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Summary from './Summary'

export default {
  title: 'Templates/Sales/Auction/Summary',
  component: Summary,
} as ComponentMeta<typeof Summary>

const Template: ComponentStory<typeof Summary> = (args) => <Summary {...args} />

export const Default = Template.bind({})
Default.args = {
  auction: {
    expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    endAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
    currency: {
      decimals: 18,
      symbol: 'USDC',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmWdK1GCQpPVcbfJNJPy32j5E7FsnQ3oRSKq3gJgRVWgP1',
    },
  },
  bestBid: {
    unitPrice: BigNumber.from(2).mul(BigNumber.from(10).pow(18)),
    currency: {
      decimals: 18,
      symbol: 'USDC',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmWdK1GCQpPVcbfJNJPy32j5E7FsnQ3oRSKq3gJgRVWgP1',
    },
    maker: {
      address: '0x0000000000000000000000000000000000000000',
      name: 'Mr nobody',
      image: undefined,
    },
  },
}

export const InProgress = Template.bind({})
InProgress.args = {
  ...Default.args,
  inProgress: true,
}

export const InProgressAsOwner = Template.bind({})
InProgressAsOwner.args = {
  ...InProgress.args,
  isOwner: true,
}

export const EndedWithNoBids = Template.bind({})
EndedWithNoBids.args = {
  ...Default.args,
  endedWithNoBids: true,
}

export const EndedWithNoBidsAsOwner = Template.bind({})
EndedWithNoBidsAsOwner.args = {
  ...EndedWithNoBids.args,
  isOwner: true,
}

export const EndedWithNoReserve = Template.bind({})
EndedWithNoReserve.args = {
  ...Default.args,
  endedWithNoReserve: true,
}

export const EndedWithNoReserveAsOwner = Template.bind({})
EndedWithNoReserveAsOwner.args = {
  ...EndedWithNoReserve.args,
  isOwner: true,
}

export const EndedWithReserve = Template.bind({})
EndedWithReserve.args = {
  ...Default.args,
  endedWithReserve: true,
}

export const EndedWithReserveAsOwner = Template.bind({})
EndedWithReserveAsOwner.args = {
  ...EndedWithReserve.args,
  isOwner: true,
}

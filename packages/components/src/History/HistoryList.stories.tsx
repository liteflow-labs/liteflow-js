import { BigNumber } from '@ethersproject/bignumber'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { AssetHistoryAction } from '../graphql'
import HistoryList from './HistoryList'

export default {
  title: 'Templates/History/HistoryList',
  component: HistoryList,
} as ComponentMeta<typeof HistoryList>

const Template: ComponentStory<typeof HistoryList> = (args) => (
  <HistoryList {...args} />
)

const historySingleEdition = {
  date: new Date('2022-03-24T11:40:51+00:00'),
  unitPrice: BigNumber.from('4000'),
  quantity: BigNumber.from('1'),
  fromAddress: '0x8108457554bc5822dc55b8adaa421ffeb970e09d',
  from: {
    name: 'ismail',
    image:
      'https://liteflow.mypinata.cloud/ipfs/QmdnqWugD5m54uU1RUWYr5y6VosWUJvEnJyUcRu49sWtM1',
    verified: true,
  },
  toAddress: '0x13e3b8cd7a3eba2aa430518704e09e02032f7c11',
  to: {
    name: 'ismail not verified',
    image:
      'https://liteflow.mypinata.cloud/ipfs/QmSm12YSZY8XvdUSP4XjJGxZ4s1RHwHLp1sLqvdgPv8ctj',
    verified: false,
  },
  transactionHash: 'xxx',
  currency: {
    decimals: 6,
    symbol: 'USDC',
  },
}

const historyMultipleEdition = {
  ...historySingleEdition,
  unitPrice: BigNumber.from('4000'),
  quantity: BigNumber.from('2'),
}

const blockExplorer = {
  name: 'Etherscan',
  token: () => `token`,
  transaction: () => `transaction`,
}

export const PurchaseSingle = Template.bind({})
PurchaseSingle.args = {
  histories: [{ action: AssetHistoryAction.Purchase, ...historySingleEdition }],
  blockExplorer,
}

export const PurchaseMultiple = Template.bind({})
PurchaseMultiple.args = {
  histories: [
    { action: AssetHistoryAction.Purchase, ...historyMultipleEdition },
  ],
  blockExplorer,
}

export const MintSingle = Template.bind({})
MintSingle.args = {
  histories: [
    {
      action: null,
      ...historySingleEdition,
      fromAddress: '0x0000000000000000000000000000000000000000',
    },
  ],
  blockExplorer,
}

export const MintMultiple = Template.bind({})
MintMultiple.args = {
  histories: [
    {
      action: null,
      ...historyMultipleEdition,
      fromAddress: '0x0000000000000000000000000000000000000000',
    },
  ],
  blockExplorer,
}

export const ListingSingle = Template.bind({})
ListingSingle.args = {
  histories: [
    {
      action: AssetHistoryAction.Listing,
      ...historySingleEdition,
      transactionHash: null,
    },
  ],
}

export const ListingMultiple = Template.bind({})
ListingMultiple.args = {
  histories: [
    {
      action: AssetHistoryAction.Listing,
      ...historyMultipleEdition,
      transactionHash: null,
    },
  ],
}

export const TransferSingle = Template.bind({})
TransferSingle.args = {
  histories: [{ action: AssetHistoryAction.Transfer, ...historySingleEdition }],
  blockExplorer,
}

export const TransferMultiple = Template.bind({})
TransferMultiple.args = {
  histories: [
    { action: AssetHistoryAction.Transfer, ...historyMultipleEdition },
  ],
  blockExplorer,
}

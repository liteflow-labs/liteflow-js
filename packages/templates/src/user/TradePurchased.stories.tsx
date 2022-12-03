import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import {
  FetchUserTradePurchasedDocument,
  FetchUserTradePurchasedQueryVariables,
} from '../graphql'
import * as UserTradePurchased from './TradePurchased'

export default {
  title: 'Pages/User/TradePurchased',
  component: UserTradePurchased.Template,
} as ComponentMeta<typeof UserTradePurchased.Template>

const Template: ComponentStory<typeof UserTradePurchased.Template> = (args) => (
  <UserTradePurchased.Template {...args} />
)

export const Default = Template.bind({})
Default.args = {
  now: '2022-05-02T23:03:00.000Z',
  userAddress: '0x6da89d36ba7cd6c371629b0724c2e17abf4049ee',
  limit: 12,
  offset: 0,
  orderBy: 'TIMESTAMP_DESC',
  limits: [12, 24, 36, 48],
  page: 1,
  explorer: {
    name: 'Etherscan',
    url: 'https://etherscan.io',
  },
}

Default.parameters = {
  apolloClient: {
    mocks: [
      {
        request: {
          query: FetchUserTradePurchasedDocument,
          variables: {
            address: Default.args.userAddress,
            limit: Default.args.limit,
            offset: Default.args.offset,
            orderBy: Default.args.orderBy,
            now: new Date(Default.args.now || ''),
          } as FetchUserTradePurchasedQueryVariables,
        },
        result: require('./TradePurchased.default.mock.json'),
      },
    ],
  },
}

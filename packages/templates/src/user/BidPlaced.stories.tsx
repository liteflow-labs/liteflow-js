import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import {
  FetchUserBidsPlacedDocument,
  FetchUserBidsPlacedQueryVariables,
  OfferOpenBuysOrderBy,
} from '../graphql'
import * as UserBidPlaced from './BidPlaced'

export default {
  title: 'Pages/User/BidPlaced',
  component: UserBidPlaced.Template,
} as ComponentMeta<typeof UserBidPlaced.Template>

const Template: ComponentStory<typeof UserBidPlaced.Template> = (args) => (
  <UserBidPlaced.Template {...args} />
)

export const Default = Template.bind({})
Default.args = {
  now: '2022-05-02T23:03:00.000Z',
  userAddress: '0x6da89d36ba7cd6c371629b0724c2e17abf4049ee',
  limit: 12,
  offset: 0,
  orderBy: OfferOpenBuysOrderBy.CreatedAtDesc,
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
          query: FetchUserBidsPlacedDocument,
          variables: {
            address: Default.args.userAddress,
            limit: Default.args.limit,
            offset: Default.args.offset,
            orderBy: Default.args.orderBy,
            now: new Date(Default.args.now || ''),
          } as FetchUserBidsPlacedQueryVariables,
        },
        result: require('./BidPlaced.default.mock.json'),
      },
    ],
  },
}

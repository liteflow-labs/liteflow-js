import { SessionContext } from '@nft/hooks'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { withReactContext } from 'storybook-react-context'
import {
  FetchUserTradeSoldDocument,
  FetchUserTradeSoldQueryVariables,
  TradesOrderBy,
} from '../graphql'
import * as UserTradeSold from './TradeSold'

export default {
  title: 'Pages/User/TradeSold',
  component: UserTradeSold.Template,
  decorators: [
    withReactContext({
      Context: SessionContext,
      initialState: {
        account: '0x6da89d36ba7cd6c371629b0724c2e17abf4049ee',
        ready: true,
      },
    }),
  ],
} as ComponentMeta<typeof UserTradeSold.Template>

const Template: ComponentStory<typeof UserTradeSold.Template> = (args) => (
  <UserTradeSold.Template {...args} />
)

export const Default = Template.bind({})
Default.args = {
  now: '2022-05-02T23:03:00.000Z',
  userAddress: '0x6da89d36ba7cd6c371629b0724c2e17abf4049ee',
  limit: 12,
  offset: 0,
  orderBy: TradesOrderBy.TimestampDesc,
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
          query: FetchUserTradeSoldDocument,
          variables: {
            address: Default.args.userAddress,
            limit: Default.args.limit,
            offset: Default.args.offset,
            orderBy: Default.args.orderBy,
            now: new Date(Default.args.now || ''),
          } as FetchUserTradeSoldQueryVariables,
        },
        result: require('./TradeSold.default.mock.json'),
      },
    ],
  },
}

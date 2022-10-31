import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import {
  FetchOnSaleAssetsDocument,
  FetchOnSaleAssetsQueryVariables,
} from '../graphql'
import * as UserOnSaleAssets from './OnSaleAssets'

export default {
  title: 'Pages/User/OnSaleAssets',
  component: UserOnSaleAssets.Template,
} as ComponentMeta<typeof UserOnSaleAssets.Template>

const Template: ComponentStory<typeof UserOnSaleAssets.Template> = (args) => (
  <UserOnSaleAssets.Template {...args} />
)

export const Default = Template.bind({})
Default.args = {
  now: '2022-05-02T23:03:00.000Z',
  userAddress: '0x6da89d36ba7cd6c371629b0724c2e17abf4049ee',
  limit: 12,
  offset: 0,
  orderBy: 'CREATED_AT_DESC',
  limits: [12, 24, 36, 48],
  page: 1,
}

Default.parameters = {
  apolloClient: {
    mocks: [
      {
        request: {
          query: FetchOnSaleAssetsDocument,
          variables: {
            address: Default.args.userAddress,
            limit: Default.args.limit,
            offset: Default.args.offset,
            orderBy: Default.args.orderBy,
            now: new Date(Default.args.now || ''),
          } as FetchOnSaleAssetsQueryVariables,
        },
        result: require('./OnSaleAssets.default.mock.json'),
      },
    ],
  },
}

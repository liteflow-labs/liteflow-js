import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import {
  FetchOwnedAssetsDocument,
  FetchOwnedAssetsQueryVariables,
} from '../graphql'
import * as UserOwnedAssets from './OwnedAssets'

export default {
  title: 'Pages/User/OwnedAssets',
  component: UserOwnedAssets.Template,
} as ComponentMeta<typeof UserOwnedAssets.Template>

const Template: ComponentStory<typeof UserOwnedAssets.Template> = (args) => (
  <UserOwnedAssets.Template {...args} />
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
          query: FetchOwnedAssetsDocument,
          variables: {
            address: Default.args.userAddress,
            limit: Default.args.limit,
            offset: Default.args.offset,
            orderBy: Default.args.orderBy,
            now: new Date(Default.args.now || ''),
          } as FetchOwnedAssetsQueryVariables,
        },
        result: require('./OwnedAssets.default.mock.json'),
      },
    ],
  },
}

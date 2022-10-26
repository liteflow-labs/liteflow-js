import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import {
  AssetsOrderBy,
  FetchCreatedAssetsDocument,
  FetchCreatedAssetsQueryVariables,
} from '../graphql'
import * as UserCreatedAssets from './CreatedAssets'

export default {
  title: 'Pages/User/CreatedAssets',
  component: UserCreatedAssets.Template,
} as ComponentMeta<typeof UserCreatedAssets.Template>

const Template: ComponentStory<typeof UserCreatedAssets.Template> = (args) => (
  <UserCreatedAssets.Template {...args} />
)

export const Default = Template.bind({})
Default.args = {
  now: '2022-05-02T23:03:00.000Z',
  userAddress: '0x6da89d36ba7cd6c371629b0724c2e17abf4049ee',
  limit: 12,
  offset: 0,
  orderBy: AssetsOrderBy.CreatedAtDesc,
  limits: [12, 24, 36, 48],
  page: 1,
}

Default.parameters = {
  apolloClient: {
    mocks: [
      {
        request: {
          query: FetchCreatedAssetsDocument,
          variables: {
            address: Default.args.userAddress,
            limit: Default.args.limit,
            offset: Default.args.offset,
            orderBy: Default.args.orderBy,
            now: new Date(Default.args.now || ''),
          } as FetchCreatedAssetsQueryVariables,
        },
        result: require('./CreatedAssets.default.mock.json'),
      },
    ],
  },
}

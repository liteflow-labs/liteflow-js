import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { AssetsOrderBy, FetchAllErc721And1155Document } from '../graphql'
import * as Explorer from './Explorer'

export default {
  title: 'Pages/Home/Explorer',
  component: Explorer.Template,
} as ComponentMeta<typeof Explorer.Template>

const Template: ComponentStory<typeof Explorer.Template> = (args) => (
  <Explorer.Template {...args} />
)

export const Default = Template.bind({})
Default.args = {
  now: '2022-05-22T04:53:29.881Z',
  limit: 10,
  page: 1,
  offset: 0,
  queryFilter: [],
  limits: [12, 24, 36, 48],
  filter: {
    minPrice: null,
    maxPrice: null,
    categories: null,
    collections: null,
    offers: [],
    currencyId: null,
  },
  orderBy: AssetsOrderBy.CreatedAtDesc,
  search: null,
  traits: {
    Category: ['Category 1', 'Category 2'],
  },
}

Default.parameters = {
  apolloClient: {
    mocks: [
      {
        request: {
          query: FetchAllErc721And1155Document,
          variables: {
            now: new Date(Default.args.now || ''),
            limit: Default.args.limit,
            offset: Default.args.offset,
            orderBy: Default.args.orderBy,
            filter: Default.args.queryFilter,
          },
        },
        result: require('./Explorer.default.mock.json'),
      },
    ],
  },
}

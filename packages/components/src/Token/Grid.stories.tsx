import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { OwnershipsOrderBy, Standard } from '../graphql'
import type { IProp as PaginationProps } from '../Pagination/Pagination'
import Grid from './Grid'

export default {
  title: 'Templates/Token/Grid',
  component: Grid,
} as ComponentMeta<typeof Grid>

const Template: ComponentStory<typeof Grid> = (args) => <Grid {...args} />

const assets = [
  {
    standard: Standard.Erc721,
    id: '1',
    name: 'My NFT',
    animationUrl: undefined,
    unlockedContent: null,
    image:
      'https://liteflow.mypinata.cloud/ipfs/QmNxNpwuqentg7U4kLdYD5U1BJRTNA8FJT3zVnyAaquHnj',
    creator: {
      address: '0x4b595014f7b45789c3f4e79324ae6d8090a6c8b5',
      name: 'Antho Creator',
      verified: false,
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmWFQhvK3yXbDjPMnccfkpYiyiEP3DYRH7XYBJBE8CwV3E',
    },
    numberOfSales: 0,
    auction: undefined,
    sale: undefined,
    hasMultiCurrency: false,
  },
  {
    standard: Standard.Erc721,
    id: '1',
    name: 'My NFT',
    animationUrl: undefined,
    unlockedContent: null,
    image:
      'https://liteflow.mypinata.cloud/ipfs/QmNxNpwuqentg7U4kLdYD5U1BJRTNA8FJT3zVnyAaquHnj',
    creator: {
      address: '0x4b595014f7b45789c3f4e79324ae6d8090a6c8b5',
      name: 'Antho Creator',
      verified: false,
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmWFQhvK3yXbDjPMnccfkpYiyiEP3DYRH7XYBJBE8CwV3E',
    },
    numberOfSales: 0,
    auction: undefined,
    sale: undefined,
    hasMultiCurrency: false,
  },
  {
    standard: Standard.Erc721,
    id: '1',
    name: 'My NFT',
    animationUrl: undefined,
    unlockedContent: null,
    image:
      'https://liteflow.mypinata.cloud/ipfs/QmNxNpwuqentg7U4kLdYD5U1BJRTNA8FJT3zVnyAaquHnj',
    creator: {
      address: '0x4b595014f7b45789c3f4e79324ae6d8090a6c8b5',
      name: 'Antho Creator',
      verified: false,
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmWFQhvK3yXbDjPMnccfkpYiyiEP3DYRH7XYBJBE8CwV3E',
    },
    numberOfSales: 0,
    auction: undefined,
    sale: undefined,
    hasMultiCurrency: false,
  },
]

const orderBy = {
  choices: [
    { label: 'Date: Newest', value: OwnershipsOrderBy.CreatedAtDesc },
    { label: 'Date: Oldest', value: OwnershipsOrderBy.CreatedAtAsc },
  ],
  onSort: async (x: any) => console.log(x),
  value: OwnershipsOrderBy.CreatedAtDesc,
}

const pagination: PaginationProps = {
  limit: 12,
  limits: [12, 24, 36, 48],
  page: 1,
  total: assets.length,
  onPageChange: console.log,
  onLimitChange: console.log,
  result: {
    label: 'Results',
    caption: ({ from, to, total }) => `${from}-${to} of ${total}`,
    pages: ({ total }) => `of ${total} pages`,
  },
}

export const Default = Template.bind({})
Default.args = {
  assets,
  orderBy,
  pagination,
}

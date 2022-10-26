import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { FetchAssetDocument, FetchAssetQueryVariables } from '../graphql'
import * as AssetDetail from './Detail'

export default {
  title: 'Pages/Asset/Detail',
  component: AssetDetail.Template,
} as ComponentMeta<typeof AssetDetail.Template>

const Template: ComponentStory<typeof AssetDetail.Template> = (args) => (
  <AssetDetail.Template {...args} />
)

export const Default = Template.bind({})
Default.args = {
  assetId:
    '97-0xaade84b6a5f76c0a5f7ae91e65197329eb23763f-49600015852111813047896604022884353921118519942981476140015855675123490232454',
  now: '2022-06-04T22:23:23.000Z',
  explorer: {
    name: 'Etherscan',
    url: 'https://etherscan.io/',
  },
  reportEmail: 'report@email.com',
  currentAccount: '',
}

Default.parameters = {
  apolloClient: {
    mocks: [
      {
        request: {
          query: FetchAssetDocument,
          variables: {
            id: Default.args.assetId,
            now: new Date(Default.args.now || ''),
            address: '',
          } as FetchAssetQueryVariables,
        },
        result: require('./Detail.default.mock.json'),
      },
    ],
  },
}

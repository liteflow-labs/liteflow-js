import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { OfferForAssetDocument, OfferForAssetQueryVariables } from '../graphql'
import * as OfferForm from './Form'

export default {
  title: 'Pages/Offers/Form',
  component: OfferForm.Template,
} as ComponentMeta<typeof OfferForm.Template>

const Template: ComponentStory<typeof OfferForm.Template> = (args) => (
  <OfferForm.Template {...args} />
)

export const Default = Template.bind({})
Default.args = {
  assetId:
    '97-0xaade84b6a5f76c0a5f7ae91e65197329eb23763f-49600015852111813047896604022884353921118519942981476140015855675123490232454',
  explorer: {
    name: 'Etherscan',
    url: 'https://etherscan.io',
  },
  now: '2022-06-04T00:46:00.000Z',
  auctionValidity: 1209600,
  offerValidity: 2419200,
}

Default.parameters = {
  apolloClient: {
    mocks: [
      {
        request: {
          query: OfferForAssetDocument,
          variables: {
            now: new Date(Default.args.now || ''),
            id: Default.args.assetId,
            address: '',
          } as OfferForAssetQueryVariables,
        },
        result: require('./Form.default.mock.json'),
      },
    ],
  },
}

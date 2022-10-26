import { SessionContext } from '@nft/hooks'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { withReactContext } from 'storybook-react-context'
import { BidOnAssetDocument, BidOnAssetQueryVariables } from '../graphql'
import * as Bid from './Bid'

export default {
  title: 'Pages/Offers/Bid',
  component: Bid.Template,
  decorators: [
    withReactContext({
      Context: SessionContext,
      initialState: {
        account: '0x6da89d36ba7cd6c371629b0724c2e17abf4049ee',
        ready: true,
      },
    }),
  ],
} as ComponentMeta<typeof Bid.Template>

const Template: ComponentStory<typeof Bid.Template> = (args) => (
  <Bid.Template {...args} />
)

export const Default = Template.bind({})
Default.args = {
  assetId:
    '49600015852111813047896604022884353921118519942981476140015855675123490232454',
  explorer: {
    name: 'Etherscan',
    url: 'https://etherscan.io/',
  },
  now: '2022-06-04T00:28:00.000Z',
  offerValidity: 2419200,
  allowTopUp: false,
  auctionValidity: 1209600,
  login: {
    email: true,
    metamask: true,
    coinbase: true,
    walletConnect: true,
    networkName: 'Ropsten',
  },
}

Default.parameters = {
  apolloClient: {
    mocks: [
      {
        request: {
          query: BidOnAssetDocument,
          variables: {
            now: new Date(Default.args.now || ''),
            id: Default.args.assetId,
          } as BidOnAssetQueryVariables,
        },
        result: require('./Bid.default.mock.json'),
      },
    ],
  },
}

export const AllowTopUp = Template.bind({})
AllowTopUp.args = {
  ...Default.args,
  allowTopUp: true,
}
AllowTopUp.parameters = Default.parameters

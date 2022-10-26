import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { CheckoutDocument } from '../graphql'
import * as Checkout from './Checkout'

export default {
  title: 'Pages/Offers/Checkout',
  component: Checkout.Template,
} as ComponentMeta<typeof Checkout.Template>

const Template: ComponentStory<typeof Checkout.Template> = (args) => (
  <Checkout.Template {...args} />
)

export const Default = Template.bind({})
Default.args = {
  now: '2022-05-02T23:03:00.000Z',
  allowTopUp: false,
  explorer: {
    name: 'Etherscan',
    url: 'https://etherscan.io',
  },
  offerId: '02404aad-f713-4d5f-93fb-9023c32763ab',
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
          query: CheckoutDocument,
          variables: {
            now: new Date(Default.args.now || ''),
            id: Default.args.offerId,
          },
        },
        result: require('./Checkout.default.mock.json'),
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

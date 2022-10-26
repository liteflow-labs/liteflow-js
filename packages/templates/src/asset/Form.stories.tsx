import { SessionContext } from '@nft/hooks'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { withReactContext } from 'storybook-react-context'
import { FetchAccountDocument } from '../graphql'
import * as AssetForm from './Form'

export default {
  title: 'Pages/Asset/Form',
  component: AssetForm.Template,
  decorators: [
    withReactContext({
      Context: SessionContext,
      initialState: {
        account: '0x6da89d36ba7cd6c371629b0724c2e17abf4049ee',
        ready: true,
      },
    }),
  ],
  parameters: {
    apolloClient: {
      mocks: [
        {
          request: {
            query: FetchAccountDocument,
            variables: {
              account: '0x6da89d36ba7cd6c371629b0724c2e17abf4049ee',
            },
          },
          result: require('./Form.default.mock.json'),
        },
      ],
    },
  },
} as ComponentMeta<typeof AssetForm.Template>

const Template: ComponentStory<typeof AssetForm.Template> = (args) => (
  <AssetForm.Template {...args} />
)

export const IsSingle = Template.bind({})
IsSingle.args = {
  multiple: false,
  explorer: {
    name: 'Etherscan',
    url: 'https://etherscan.io/',
  },
  uploadUrl: 'xxxx',
  login: {
    email: true,
    metamask: true,
    coinbase: true,
    walletConnect: true,
    networkName: 'Ropsten',
  },
  traits: {
    Category: ['Category 1', 'Category 2'],
  },
}

export const IsMultiple = Template.bind({})
IsMultiple.args = {
  ...IsSingle.args,
  multiple: true,
}

export const IsRestricted = Template.bind({})
IsRestricted.args = {
  ...IsSingle.args,
  restrictMintToVerifiedAccount: true,
  reportEmail: 'contact@liteflow.com',
}

import { SessionContext } from '@nft/hooks'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { withReactContext } from 'storybook-react-context'
import { WalletCurrenciesDocument } from '../graphql'
import * as UserWallet from './Wallet'

export default {
  title: 'Pages/Users/Wallet',
  component: UserWallet.Template,
} as ComponentMeta<typeof UserWallet.Template>

const Template: ComponentStory<typeof UserWallet.Template> = (args) => (
  <UserWallet.Template {...args} />
)

export const Default = Template.bind({})
Default.args = {
  networkName: 'Ropsten',
}

Default.decorators = [
  withReactContext({
    Context: SessionContext,
    initialState: {
      account: '0x6da89d36ba7cd6c371629b0724c2e17abf4049ee',
      ready: true,
    },
  }),
]

Default.parameters = {
  apolloClient: {
    mocks: [
      {
        request: {
          query: WalletCurrenciesDocument,
        },
        result: require('./Wallet.default.mock.json'),
      },
    ],
  },
}

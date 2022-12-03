import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
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

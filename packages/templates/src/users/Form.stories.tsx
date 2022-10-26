import { SessionContext } from '@nft/hooks'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { withReactContext } from 'storybook-react-context'
import { GetAccountDocument } from '../graphql'
import * as UserForm from './Form'

export default {
  title: 'Pages/Users/Form',
  component: UserForm.Template,
} as ComponentMeta<typeof UserForm.Template>

const Template: ComponentStory<typeof UserForm.Template> = (args) => (
  <UserForm.Template {...args} />
)

export const Default = Template.bind({})
Default.args = {
  uploadUrl: 'xxx',
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
          query: GetAccountDocument,
          variables: {
            address: '0x6da89d36ba7cd6c371629b0724c2e17abf4049ee',
          },
        },
        result: require('./Form.default.mock.json'),
      },
    ],
  },
}

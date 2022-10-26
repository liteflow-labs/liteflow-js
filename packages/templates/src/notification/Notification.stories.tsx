import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { GetNotificationsDocument } from '../graphql'
import * as Notification from './Notification'

export default {
  title: 'Pages/Notification/Notification',
  component: Notification.Template,
} as ComponentMeta<typeof Notification.Template>

const Template: ComponentStory<typeof Notification.Template> = (args) => (
  <Notification.Template {...args} />
)

export const Default = Template.bind({})
Default.args = {
  address: '0x0000000000000000000000000000000000000000',
}

Default.parameters = {
  apolloClient: {
    mocks: [
      {
        request: {
          query: GetNotificationsDocument,
          variables: {
            address: Default.args.address,
          },
        },
        result: require('./Notification.default.mock.json'),
      },
    ],
  },
}

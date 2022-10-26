import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Form from './Form'

export default {
  title: 'Templates/Referral/Form',
  component: Form,
} as ComponentMeta<typeof Form>

const Template: ComponentStory<typeof Form> = (args) => <Form {...args} />

export const Default = Template.bind({})

Default.args = {
  login: {
    coinbase: false,
    email: false,
    metamask: true,
    walletConnect: false,
    networkName: 'test',
  },
  loginUrl: 'http://localhost:3000/login',
}

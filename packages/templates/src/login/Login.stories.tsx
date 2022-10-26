import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import * as Login from './Login'

export default {
  title: 'Pages/Login/Login',
  component: Login.Template,
} as ComponentMeta<typeof Login.Template>

const Template: ComponentStory<typeof Login.Template> = (args) => (
  <Login.Template {...args} />
)

export const Default = Template.bind({})
Default.args = {
  email: false,
  metamask: false,
  walletConnect: false,
  coinbase: false,
  networkName: 'Ropsten',
}

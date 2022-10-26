import React, { ComponentMeta, ComponentStory } from '@storybook/react'
import Login from './Login'

export default {
  title: 'Templates/Modals/Login',
  component: Login,
} as ComponentMeta<typeof Login>

const Template: ComponentStory<typeof Login> = (args) => <Login {...args} />

export const Default = Template.bind({})
Default.args = {
  isOpen: true,
  email: true,
  metamask: true,
  coinbase: true,
  walletConnect: true,
  networkName: 'BSC Mainnet',
}

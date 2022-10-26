import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { Template as Referral } from './Referral'

export default {
  title: 'Pages/Referral/Referral',
  component: Referral,
} as ComponentMeta<typeof Referral>

const Template: ComponentStory<typeof Referral> = (args) => (
  <Referral {...args} />
)

export const Default = Template.bind({})
Default.args = {
  platformName: 'test',
  login: {
    metamask: true,
    coinbase: false,
    email: false,
    walletConnect: false,
    networkName: 'test',
  },
  loginUrl: 'http://localhost:3000/login',
  percentage: {
    base: 10,
  },
}

import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import WalletAddress from './Address'

export default {
  title: 'Templates/Wallet/Wallet Address',
  component: WalletAddress,
} as ComponentMeta<typeof WalletAddress>

const Template: ComponentStory<typeof WalletAddress> = (args) => (
  <WalletAddress {...args} />
)

export const Default = Template.bind({})
Default.args = {
  address: '0x4b595014f7b45789c3f4e79324ae6d8090a6c8b5',
  isShort: true,
  isCopyable: false,
}

export const WithCopy = Template.bind({})
WithCopy.args = {
  ...Default.args,
  isCopyable: true,
}

export const Long = Template.bind({})
Long.args = {
  ...Default.args,
  isShort: false,
}

export const LongWithCopy = Template.bind({})
LongWithCopy.args = {
  ...Long.args,
  isCopyable: true,
}

import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Avatar from './Avatar'

export default {
  title: 'Templates/User/Avatar',
  component: Avatar,
} as ComponentMeta<typeof Avatar>

const Template: ComponentStory<typeof Avatar> = (args) => <Avatar {...args} />

export const Default = Template.bind({})
Default.args = {
  address: '0x4b595014f7b45789c3f4e79324ae6d8090a6c8b5',
  name: 'Antho Creator',
  image:
    'https://liteflow.mypinata.cloud/ipfs/QmWFQhvK3yXbDjPMnccfkpYiyiEP3DYRH7XYBJBE8CwV3E',
}

export const Verified = Template.bind({})
Verified.args = {
  ...Default.args,
  verified: true,
}

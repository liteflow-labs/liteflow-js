import { VoidSigner } from '@ethersproject/abstract-signer'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Info from './Info'

export default {
  title: 'Templates/User/Profile/Info',
  component: Info,
} as ComponentMeta<typeof Info>

const Template: ComponentStory<typeof Info> = (args) => <Info {...args} />

export const Empty = Template.bind({})
Empty.args = {
  signer: new VoidSigner('0x4b595014f7b45789c3f4e79324ae6d8090a6c8b5'),
  address: '0x4b595014f7b45789c3f4e79324ae6d8090a6c8b5',
  name: '',
  description: '',
  twitter: '',
  instagram: '',
  website: '',
}

export const Filled = Template.bind({})
Filled.args = {
  signer: new VoidSigner('0x4b595014f7b45789c3f4e79324ae6d8090a6c8b5'),
  address: '0x4b595014f7b45789c3f4e79324ae6d8090a6c8b5',
  name: 'Antho Creator',
  description: 'description',
  twitter: 'antho1404',
  instagram: 'instagram',
  website: 'liteflow.com',
}

export const Verified = Template.bind({})
Verified.args = {
  ...Filled.args,
  verified: true,
}

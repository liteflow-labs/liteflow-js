import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Image from './Image'

export default {
  title: 'Templates/Wallet/Image',
  component: Image,
} as ComponentMeta<typeof Image>

const Template: ComponentStory<typeof Image> = (args) => <Image {...args} />

export const Default = Template.bind({})
Default.args = {
  address: '0x4b595014f7b45789c3f4e79324ae6d8090a6c8b5',
  image:
    'https://liteflow.mypinata.cloud/ipfs/QmWFQhvK3yXbDjPMnccfkpYiyiEP3DYRH7XYBJBE8CwV3E',
  size: 32,
}

export const Generated = Template.bind({})
Generated.args = {
  address: '0x4b595014f7b45789c3f4e79324ae6d8090a6c8b5',
  size: 32,
}

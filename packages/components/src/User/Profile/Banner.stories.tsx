import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Banner from './Banner'

export default {
  title: 'Templates/User/Profile/Banner',
  component: Banner,
} as ComponentMeta<typeof Banner>

const Template: ComponentStory<typeof Banner> = (args) => <Banner {...args} />

export const Default = Template.bind({})
Default.args = {
  address: '0x4b595014f7b45789c3f4e79324ae6d8090a6c8b5',
  name: 'Antho Creator',
  cover:
    'https://liteflow.mypinata.cloud/ipfs/QmePsHESD3TBRp2PxVks5ipRAktKfePGqDB2bJzZQD2xqz',
  image:
    'https://liteflow.mypinata.cloud/ipfs/QmWFQhvK3yXbDjPMnccfkpYiyiEP3DYRH7XYBJBE8CwV3E',
}

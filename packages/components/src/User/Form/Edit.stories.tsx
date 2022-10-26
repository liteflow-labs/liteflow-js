import { VoidSigner } from '@ethersproject/abstract-signer'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Edit from './Edit'

export default {
  title: 'Templates/User/Form/Edit',
  component: Edit,
} as ComponentMeta<typeof Edit>

const Template: ComponentStory<typeof Edit> = (args) => <Edit {...args} />

export const Empty = Template.bind({})
Empty.args = {
  signer: new VoidSigner('0x0000000000000000000000000000000000000000'),
  account: {
    name: null,
    description: null,
    email: null,
    twitter: null,
    instagram: null,
    website: null,
    image: null,
    cover: null,
  },
  uploadUrl: 'xxxx',
  onUpdated: () => console.log('onUpdated'),
}

export const Filled = Template.bind({})
Filled.args = {
  ...Empty.args,
  account: {
    name: 'Antho Creator',
    cover:
      'https://liteflow.mypinata.cloud/ipfs/QmePsHESD3TBRp2PxVks5ipRAktKfePGqDB2bJzZQD2xqz',
    description: '',
    twitter: 'antho1404',
    instagram: '',
    website: 'liteflow.com',
    image:
      'https://liteflow.mypinata.cloud/ipfs/QmWFQhvK3yXbDjPMnccfkpYiyiEP3DYRH7XYBJBE8CwV3E',
    email: 'test@test.com',
  },
}

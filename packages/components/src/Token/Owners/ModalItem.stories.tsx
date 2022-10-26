import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import OwnersModalItem from './ModalItem'

export default {
  title: 'Templates/Token/Owners/Modal Item',
  component: OwnersModalItem,
} as ComponentMeta<typeof OwnersModalItem>

const Template: ComponentStory<typeof OwnersModalItem> = (args) => (
  <OwnersModalItem {...args} />
)

export const Default = Template.bind({})
Default.args = {
  address: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
  name: 'GENSHIRO.io',
  image:
    'https://liteflow.mypinata.cloud/ipfs/QmXBPcYmam3gT1dURz66CMXoB4K6kJWTyiw488JmJPxEMt/genshiro_io.png',
  verified: false,
  quantity: '5',
}

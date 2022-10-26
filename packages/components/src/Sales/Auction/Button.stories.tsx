import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Button from './Button'

export default {
  title: 'Templates/Sales/Auction/Button',
  component: Button,
} as ComponentMeta<typeof Button>

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />

export const Default = Template.bind({})
Default.args = {
  assetId: '1',
  isOwner: false,
  isHomepage: false,
  isEnded: false,
}

export const V1 = Template.bind({})
V1.args = {
  assetId: '1',
  isOwner: false,
  isHomepage: false,
  isEnded: true,
}

export const V2 = Template.bind({})
V2.args = {
  assetId: '1',
  isOwner: false,
  isHomepage: true,
  isEnded: false,
}

export const V3 = Template.bind({})
V3.args = {
  assetId: '1',
  isOwner: false,
  isHomepage: true,
  isEnded: true,
}

export const V4 = Template.bind({})
V4.args = {
  assetId: '1',
  isOwner: true,
  isHomepage: false,
  isEnded: false,
}

export const V5 = Template.bind({})
V5.args = {
  assetId: '1',
  isOwner: true,
  isHomepage: false,
  isEnded: true,
}

export const V6 = Template.bind({})
V6.args = {
  assetId: '1',
  isOwner: true,
  isHomepage: true,
  isEnded: false,
}

export const V7 = Template.bind({})
V7.args = {
  assetId: '1',
  isOwner: true,
  isHomepage: true,
  isEnded: true,
}

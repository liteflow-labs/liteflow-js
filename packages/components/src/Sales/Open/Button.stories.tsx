import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Button from './Button'

export default {
  title: 'Templates/Sales/Open/Button',
  component: Button,
} as ComponentMeta<typeof Button>

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />

export const Default = Template.bind({})
Default.args = {
  assetId: '1',
  isHomepage: false,
  ownAllSupply: false,
}

export const V1 = Template.bind({})
V1.args = {
  assetId: '1',
  isHomepage: false,
  ownAllSupply: true,
}

export const V2 = Template.bind({})
V2.args = {
  assetId: '1',
  isHomepage: true,
  ownAllSupply: false,
}

export const V3 = Template.bind({})
V3.args = {
  assetId: '1',
  isHomepage: true,
  ownAllSupply: true,
}

import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Info from './Info'

export default {
  title: 'Templates/Sales/Open/Info',
  component: Info,
} as ComponentMeta<typeof Info>

const Template: ComponentStory<typeof Info> = (args) => <Info {...args} />

export const Default = Template.bind({})
Default.args = {
  assetId: '1',
  isHomepage: false,
  isOwner: false,
}

export const AsOwner = Template.bind({})
AsOwner.args = {
  assetId: '1',
  isHomepage: false,
  isOwner: true,
}

export const FromHomepage = Template.bind({})
FromHomepage.args = {
  assetId: '1',
  isHomepage: true,
  isOwner: false,
}

import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Empty from './Empty'

export default {
  title: 'Templates/Empty/Empty',
  component: Empty,
} as ComponentMeta<typeof Empty>

const Template: ComponentStory<typeof Empty> = (args) => <Empty {...args} />

export const WithButton = Template.bind({})
WithButton.args = {
  title: 'No Collectibles Found',
  description: 'Browse the marketplace to find more collectibles',
  button: 'Browse Marketplace',
  href: '/explore',
}

export const WithoutButton = Template.bind({})
WithoutButton.args = {
  title: 'No Collectibles Found',
  description: 'Browse the marketplace to find more collectibles',
}

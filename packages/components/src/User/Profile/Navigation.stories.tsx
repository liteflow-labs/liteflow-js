import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Navigation from './Navigation'

export default {
  title: 'Templates/User/Profile/Navigation',
  component: Navigation,
} as ComponentMeta<typeof Navigation>

const Template: ComponentStory<typeof Navigation> = (args) => (
  <Navigation {...args} />
)

export const Default = Template.bind({})
Default.args = {
  currentTab: 'on-sale',
  totals: new Map([
    ['on-sale', 1],
    ['owned', 2],
  ]),
}

export const WithPrivateTabs = Template.bind({})
WithPrivateTabs.args = {
  ...Default.args,
  showPrivateTabs: true,
}

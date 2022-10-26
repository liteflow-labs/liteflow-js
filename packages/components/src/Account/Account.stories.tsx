import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Account from './Account'

export default {
  title: 'Templates/Account/Account',
  component: Account,
} as ComponentMeta<typeof Account>

const Template: ComponentStory<typeof Account> = (args) => <Account {...args} />

export const Default = Template.bind({})
Default.args = {
  currentTab: 'wallet',
  children: <div>This is a sample page for viewing UI only.</div>,
}

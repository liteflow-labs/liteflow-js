import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Countdown from './Countdown'

export default {
  title: 'Templates/Countdown/Countdown',
  component: Countdown,
  argTypes: {
    date: {
      defaultValue: new Date(Date.now() + 1000 * 60 * 60 * 6), // 6 hour countdown
      control: 'date',
    },
  },
} as ComponentMeta<typeof Countdown>

const Template: ComponentStory<typeof Countdown> = (args) => (
  <Countdown {...args} />
)

export const Default = Template.bind({})

import { AiOutlineDollarCircle } from '@react-icons/all-files/ai/AiOutlineDollarCircle'
import { HiOutlineClock } from '@react-icons/all-files/hi/HiOutlineClock'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Radio from './Radio'

export default {
  title: 'Templates/Radio/Radio',
  component: Radio,
} as ComponentMeta<typeof Radio>

const Template: ComponentStory<typeof Radio> = (args) => <Radio {...args} />

export const Default = Template.bind({})
Default.args = {
  choice: {
    value: 'FIXED_PRICE',
    label: 'Fixed price',
    icon: AiOutlineDollarCircle,
  },
}

export const Checked = Template.bind({})
Checked.args = {
  choice: {
    value: 'FIXED_PRICE',
    label: 'Fixed price',
    icon: AiOutlineDollarCircle,
  },
  isChecked: true,
}

export const Disabled = Template.bind({})
Disabled.args = {
  choice: {
    value: 'TIMED_AUCTION',
    label: 'Timed auction',
    icon: HiOutlineClock,
    disabled: true,
  },
}

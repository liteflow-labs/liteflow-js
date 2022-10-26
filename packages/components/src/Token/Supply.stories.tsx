import { BigNumber } from '@ethersproject/bignumber'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Supply from './Supply'

export default {
  title: 'Templates/Token/Supply',
  component: Supply,
} as ComponentMeta<typeof Supply>

const Template: ComponentStory<typeof Supply> = (args) => <Supply {...args} />

export const Default = Template.bind({})
Default.args = {
  current: BigNumber.from('1'),
  total: BigNumber.from('20'),
  small: false,
}

export const Small = Template.bind({})
Small.args = {
  ...Default.args,
  small: true,
}

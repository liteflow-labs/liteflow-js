import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import BackButton from './BackButton'

export default {
  title: 'Templates/Navbar/BackButton',
  component: BackButton,
} as ComponentMeta<typeof BackButton>

const Template: ComponentStory<typeof BackButton> = (args) => (
  <BackButton {...args} />
)

export const Default = Template.bind({})
Default.args = {
  onClick: () => console.log('back'),
}

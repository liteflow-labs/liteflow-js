import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import CardFooter from './CardFooter'

export default {
  title: 'Templates/Sales/Open/CardFooter',
  component: CardFooter,
} as ComponentMeta<typeof CardFooter>

const Template: ComponentStory<typeof CardFooter> = (args) => (
  <CardFooter {...args} />
)

export const Default = Template.bind({})
Default.args = {
  href: '/',
}

import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import * as TypeSelector from './TypeSelector'

export default {
  title: 'Pages/Asset/TypeSelector',
  component: TypeSelector.Template,
} as ComponentMeta<typeof TypeSelector.Template>

const Template: ComponentStory<typeof TypeSelector.Template> = (args) => (
  <TypeSelector.Template {...args} />
)

export const Default = Template.bind({})

export const IsRestricted = Template.bind({})
IsRestricted.args = {
  restrictMintToVerifiedAccount: true,
  reportEmail: 'contact@liteflow.com',
}

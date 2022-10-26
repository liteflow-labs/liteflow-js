import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import Dropzone from './Dropzone'

export default {
  title: 'Templates/Dropzone/Dropzone',
  component: Dropzone,
} as ComponentMeta<typeof Dropzone>

type FormData = {
  file: File
}

const Template: ComponentStory<typeof Dropzone> = (args) => {
  const { control } = useForm<FormData>()
  return (
    <Dropzone {...args} control={control}>
      {({ hasPreview }) => (hasPreview ? 'Replace file' : 'Choose file')}
    </Dropzone>
  )
}

export const Default = Template.bind({})
Default.args = {
  label: 'Upload file',
  hint: 'JPG, PNG, GIF, WEBP. Max 10mb.',
  name: 'file',
  maxSize: 10000000,
  required: true,
}

export const Rounded = Template.bind({})
Rounded.args = {
  ...Default.args,
  rounded: true,
}

export const WithPlaceholder = Template.bind({})
WithPlaceholder.args = {
  ...Default.args,
  withPlaceholder: true,
}

export const RoundedWithPlaceholder = Template.bind({})
RoundedWithPlaceholder.args = {
  ...Rounded.args,
  withPlaceholder: true,
}

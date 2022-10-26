import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import Select from './Select'

export default {
  title: 'Templates/Select/Select',
  component: Select,
} as ComponentMeta<typeof Select>

type FormData = {
  category: string
}

const choices = [
  { label: 'Art', value: 'art' },
  { label: 'Photography', value: 'photography' },
  { label: 'Currency', value: 'currency' },
  { label: 'DeFi', value: 'defi' },
  { label: 'Games', value: 'games' },
]

const Template: ComponentStory<typeof Select> = (args) => {
  const {
    control,
    formState: { isSubmitting },
    watch,
  } = useForm<FormData>()
  const value = watch('category')
  return (
    <Select {...args} control={control} disabled={isSubmitting} value={value} />
  )
}

export const Default = Template.bind({})
Default.args = {
  label: 'Category',
  name: 'category',
  choices: choices,
  placeholder: 'Select a category',
}

export const WithLabelInfo = Template.bind({})
WithLabelInfo.args = {
  ...Default.args,
  labelInfo: 'Category Info',
}

export const WithInlineLabel = Template.bind({})
WithInlineLabel.args = {
  ...Default.args,
  inlineLabel: true,
}

export const WithCaption = Template.bind({})
WithCaption.args = {
  ...Default.args,
  choices: choices.map((x) => ({ ...x, caption: 'Caption' })),
}

export const WithImage = Template.bind({})
WithImage.args = {
  ...Default.args,
  choices: choices.map((x) => ({
    ...x,
    image:
      'https://liteflow.mypinata.cloud/ipfs/QmWdK1GCQpPVcbfJNJPy32j5E7FsnQ3oRSKq3gJgRVWgP1',
  })),
}

export const WithFixedWidth = Template.bind({})
WithFixedWidth.args = {
  ...Default.args,
  selectWidth: '300px',
  choices: choices.map((x) => ({
    ...x,
  })),
}

export const WithHint = Template.bind({})
WithHint.args = {
  ...Default.args,
  hint: 'This is a hint.',
  choices: choices.map((x) => ({
    ...x,
  })),
}

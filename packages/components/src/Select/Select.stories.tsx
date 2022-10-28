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

export const WithManyChoicesAndMaxHeight = Template.bind({})
WithManyChoicesAndMaxHeight.args = {
  ...Default.args,
  dropdownMaxHeight: '360px',
  choices: [
    ...choices,
    { label: 'Extra choice #1', value: 'extra-choice-1' },
    { label: 'Extra choice #2', value: 'extra-choice-2' },
    { label: 'Extra choice #3', value: 'extra-choice-3' },
    { label: 'Extra choice #4', value: 'extra-choice-4' },
    { label: 'Extra choice #5', value: 'extra-choice-5' },
    { label: 'Extra choice #6', value: 'extra-choice-6' },
    { label: 'Extra choice #7', value: 'extra-choice-7' },
    { label: 'Extra choice #8', value: 'extra-choice-8' },
    { label: 'Extra choice #9', value: 'extra-choice-9' },
    { label: 'Extra choice #10', value: 'extra-choice-10' },
    { label: 'Extra choice #11', value: 'extra-choice-11' },
    { label: 'Extra choice #12', value: 'extra-choice-12' },
    { label: 'Extra choice #13', value: 'extra-choice-13' },
    { label: 'Extra choice #14', value: 'extra-choice-14' },
    { label: 'Extra choice #15', value: 'extra-choice-15' },
    { label: 'Extra choice #16', value: 'extra-choice-16' },
    { label: 'Extra choice #17', value: 'extra-choice-17' },
    { label: 'Extra choice #18', value: 'extra-choice-18' },
    { label: 'Extra choice #19', value: 'extra-choice-19' },
    { label: 'Extra choice #20', value: 'extra-choice-20' },
  ].map((x) => ({
    ...x,
  })),
}

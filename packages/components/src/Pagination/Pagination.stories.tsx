import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Pagination from './Pagination'

export default {
  title: 'Templates/Pagination/Pagination',
  component: Pagination,
} as ComponentMeta<typeof Pagination>

const Template: ComponentStory<typeof Pagination> = (args) => (
  <Pagination {...args} />
)

export const Default = Template.bind({})
Default.args = {
  limit: 10,
  limits: [10, 20, 30, 40],
  page: 1,
  total: 100,
  onPageChange: (e) => alert(e),
  onLimitChange: (e) => alert(e),
  result: {
    label: 'Results per page',
    caption: ({ from, to, total }) => `${from} - ${to} of ${total}`,
    pages: ({ total }) => `of ${total} pages`,
  },
}

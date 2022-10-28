import { Box, Button, Text } from '@chakra-ui/react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import List, { ListItem } from './List'

export default {
  title: 'Templates/List/List',
  component: List,
  subcomponents: { ListItem },
} as ComponentMeta<typeof List>

const Template: ComponentStory<typeof List> = (args) => (
  <List {...args}>
    <ListItem image={<Box h={10} w={10} rounded="full" />} label="label" />
    <ListItem
      image={<Box h={10} w={10} rounded="full" />}
      label="label"
      subtitle="subtitle"
    />
    <ListItem
      image={<Box h={10} w={10} rounded="full" />}
      label="label"
      subtitle="subtitle"
      caption="caption"
    />
    <ListItem
      image={<Box h={10} w={10} rounded="full" />}
      label="label"
      subtitle="subtitle"
      caption="caption"
      action={
        <Button>
          <Text as="span" isTruncated>
            button
          </Text>
        </Button>
      }
    />
    <ListItem
      image={<Box h={10} w={10} rounded="full" />}
      label="label 5"
      subtitle="subtitle"
      caption="caption"
      action={
        <Button variant="outline" colorScheme="gray">
          <Text as="span" isTruncated>
            button
          </Text>
        </Button>
      }
    />
  </List>
)

export const Default = Template.bind({})

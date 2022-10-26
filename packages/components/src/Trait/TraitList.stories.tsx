import { Box } from '@chakra-ui/react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import TraitList from './TraitList'

export default {
  title: 'Templates/Trait/TraitList',
  component: TraitList,
} as ComponentMeta<typeof TraitList>

const Template: ComponentStory<typeof TraitList> = (args) => (
  <TraitList {...args} />
)

export const Default = Template.bind({})
Default.args = {
  traits: [
    {
      type: 'Category',
      value: 'Blanko',
    },
    {
      type: 'Collection',
      value: '2022',
    },
    {
      type: 'Season',
      value: 'Early Access',
    },
    {
      type: 'Medium',
      value: 'Digital Painting',
    },
    {
      type: 'Technique',
      value: 'Evolution',
    },
    {
      type: 'Skin',
      value: 'Poseidon Blue Skin Jacket',
    },
    {
      type: 'Breeding Availability',
      value: '21/04/2022, 22:22 EST',
    },
  ],
}

export const WithRarity = Template.bind({})
WithRarity.args = {
  traits: [
    {
      type: 'Category',
      value: 'Blanko',
      rarity: '0.0001%',
    },
    {
      type: 'Collection',
      value: '2022',
      rarity: '24.5%',
    },
    {
      type: 'Season',
      value: 'Early Access',
      rarity: 'Unique',
    },
    {
      type: 'Medium',
      value: 'Digital Painting',
      rarity: '34.2389%',
    },
    {
      type: 'Technique',
      value: 'Evolution',
      rarity: '5.6%',
    },
    {
      type: 'Skin',
      value: 'Poseidon Blue Skin Jacket',
      rarity: '1.86%',
    },
    {
      type: 'Breeding Availability',
      value: '21/04/2022, 22:22 EST',
      rarity: '3.598%',
    },
  ],
}

export const Truncated = Template.bind({})
Truncated.args = {
  ...Default.args,
}
Truncated.decorators = [
  (Story) => (
    <Box maxW="548px">
      <Story />
    </Box>
  ),
]

import { AspectRatio, Box } from '@chakra-ui/react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import Image from 'next/image'
import React from 'react'
import Slider from './Slider'

export default {
  title: 'Templates/Slider/Slider',
  component: Slider,
} as ComponentMeta<typeof Slider>

const Template: ComponentStory<typeof Slider> = (args) => <Slider {...args} />

const items = [
  'https://picsum.photos/id/10/300/300',
  'https://picsum.photos/id/20/300/300',
  'https://picsum.photos/id/30/300/300',
  'https://picsum.photos/id/40/300/300',
  'https://picsum.photos/id/50/300/300',
  'https://picsum.photos/id/60/300/300',
  'https://picsum.photos/id/70/300/300',
]

const SliderItem = ({ src, idx }: { src: string; idx: number }) => (
  <Box
    p={3}
    flex={{
      base: '0 0 100%',
      sm: '0 0 50%',
      md: '0 0 33.33%',
      lg: '0 0 25%',
    }}
  >
    <AspectRatio ratio={1} position="relative">
      <Image src={src} alt={`Image-${idx}`} layout="fill" />
    </AspectRatio>
  </Box>
)

export const Default = Template.bind({})
Default.args = {
  children: items.map((x, i) => <SliderItem src={x} key={i} idx={i} />),
}

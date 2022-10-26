import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import TokenMedia from './Media'

export default {
  title: 'Templates/Token/Media',
  component: TokenMedia,
} as ComponentMeta<typeof TokenMedia>

const Template: ComponentStory<typeof TokenMedia> = (args) => (
  <TokenMedia {...args} />
)

export const Animation = Template.bind({})
Animation.args = {
  width: '256px',
  animationUrl:
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  defaultText: 'animation',
}

export const Image = Template.bind({})
Image.args = {
  width: 256,
  height: 256,
  objectFit: 'cover',
  layout: 'fixed',
  animationUrl: '',
  image:
    'https://liteflow.mypinata.cloud/ipfs/QmWdK1GCQpPVcbfJNJPy32j5E7FsnQ3oRSKq3gJgRVWgP1',
  defaultText: 'image',
}

import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Footer from './Footer'

export default {
  title: 'Templates/Footer/Footer',
  component: Footer,
} as ComponentMeta<typeof Footer>

const links = [
  { href: 'https://liteflow.com', label: 'About' },
  { href: 'https://liteflow.com/#nft', label: 'NFT Solution' },
  {
    href: 'https://calendly.com/anthony-estebe/liteflow-nft-marketplace',
    label: 'Schedule a demo',
  },
  { href: '/explore', label: 'Explore' },
  { href: '#', label: 'Activity' },
  { href: '#', label: 'Support' },
  { href: '#', label: 'Terms' },
  { href: '#', label: 'Privacy' },
  { href: 'https://facebook.com', label: 'Facebook' },
  { href: 'https://instagram.com', label: 'Instagram' },
  { href: 'https://twitter.com', label: 'Twitter' },
  { href: 'https://github.com', label: 'Github' },
  { href: 'https://dribbble.com', label: 'Dribble' },
]

const Template: ComponentStory<typeof Footer> = (args) => <Footer {...args} />

export const Default = Template.bind({})
Default.args = {
  name: 'Liteflow',
  links: links,
}

export const WithBrandNote = Template.bind({})
WithBrandNote.args = {
  name: 'Liteflow',
  links: links,
  showBrandNote: true,
}

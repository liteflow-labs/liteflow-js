import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Profile from './Profile'

export default {
  title: 'Pages/User/Profile',
  component: Profile,
} as ComponentMeta<typeof Profile>

const Template: ComponentStory<typeof Profile> = (args) => <Profile {...args} />

export const Default = Template.bind({})
Default.args = {
  account: {
    address: '0x8108457554bc5822dc55b8adaa421ffeb970e09d',
    name: 'ismail',
    cover: null,
    description: '',
    twitter: '@iToyran',
    instagram: '@ismailtoyrn',
    website: '',
    image:
      'https://liteflow.mypinata.cloud/ipfs/QmdnqWugD5m54uU1RUWYr5y6VosWUJvEnJyUcRu49sWtM1',
    verified: true,
  },
  currentTab: 'on-sale',
  totals: new Map([
    ['created', 16],
    ['on-sale', 4],
    ['owned', 14],
  ]),
}

export const Connected = Template.bind({})
Connected.args = {
  ...Default.args,
  currentAccount: '0x8108457554bc5822dc55b8adaa421ffeb970e09d',
}

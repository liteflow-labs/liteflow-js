import { VoidSigner } from '@ethersproject/abstract-signer'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Create from './Create'

export default {
  title: 'Templates/Token/Form/Create',
  component: Create,
} as ComponentMeta<typeof Create>

const Template: ComponentStory<typeof Create> = (args) => <Create {...args} />

const categories = [
  { title: 'Art', id: 'art' },
  { title: 'Photography', id: 'photography' },
  { title: 'Currency', id: 'currency' },
  { title: 'DeFi', id: 'defi' },
  { title: 'Games', id: 'games' },
]

export const IsSingle = Template.bind({})
IsSingle.args = {
  signer: new VoidSigner('0x0000000000000000000000000000000000000000'),
  collection: {
    address: '0x',
    standard: 'ERC721',
  },
  categories: categories,
  blockExplorer: {
    name: 'Etherscan',
    token: () => `token`,
    transaction: () => `transaction`,
  },
  uploadUrl: 'xxx',
  login: {
    email: true,
    metamask: true,
    coinbase: true,
    walletConnect: true,
    networkName: 'Ropsten',
  },
  maxRoyalties: 30,
  onCreated: () => console.log('onCreated'),
  onInputChange: () => console.log('onInputChange'),
}

export const IsMultiple = Template.bind({})
IsMultiple.args = {
  ...IsSingle.args,
  collection: {
    address: '0x',
    standard: 'ERC1155',
  },
}

export const IsSingleUnlockable = Template.bind({})
IsSingleUnlockable.args = {
  ...IsSingle.args,
  activateUnlockableContent: true,
}

export const IsMultipleUnlockable = Template.bind({})
IsMultipleUnlockable.args = {
  ...IsMultiple.args,
  activateUnlockableContent: true,
}

import { VoidSigner } from '@ethersproject/abstract-signer'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Form from './Form'

export default {
  title: 'Templates/Sales/Auction/Form',
  component: Form,
} as ComponentMeta<typeof Form>

const Template: ComponentStory<typeof Form> = (args) => <Form {...args} />

export const Default = Template.bind({})
Default.args = {
  signer: new VoidSigner('0x0000000000000000000000000000000000000000'),
  assetId: '1',
  currencies: [
    {
      id: '1',
      name: 'USDC',
      image:
        'https://nft.liteflow.com/_next/image?url=https%3A%2F%2Fliteflow.mypinata.cloud%2Fipfs%2FQmWdK1GCQpPVcbfJNJPy32j5E7FsnQ3oRSKq3gJgRVWgP1&w=32&q=75',
      decimals: 18,
      symbol: 'USDC',
    },
  ],
  auctionValidity: 1209600,
  onCreated: () => console.log('onCreated'),
}

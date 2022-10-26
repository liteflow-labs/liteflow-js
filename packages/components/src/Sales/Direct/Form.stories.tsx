import { VoidSigner } from '@ethersproject/abstract-signer'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { Standard } from '../../graphql'
import Form from './Form'

export default {
  title: 'Templates/Sales/Direct/Form',
  component: Form,
} as ComponentMeta<typeof Form>

const Template: ComponentStory<typeof Form> = (args) => <Form {...args} />

export const IsSingle = Template.bind({})
IsSingle.args = {
  asset: {
    id: '1',
    standard: Standard.Erc721,
  },
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
  signer: new VoidSigner('0x0000000000000000000000000000000000000000'),
  feesPerTenThousand: 250,
  royaltiesPerTenThousand: 1000,
  isCreator: false,
  offerValidity: 2419200,
  onCreated: () => console.log('onCreated'),
}

export const IsMultiple = Template.bind({})
IsMultiple.args = {
  asset: {
    id: '1',
    standard: Standard.Erc1155,
  },
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
  signer: new VoidSigner('0x0000000000000000000000000000000000000000'),
  feesPerTenThousand: 250,
  royaltiesPerTenThousand: 1000,
  isCreator: false,
  offerValidity: 2419200,
  onCreated: () => console.log('onCreated'),
}

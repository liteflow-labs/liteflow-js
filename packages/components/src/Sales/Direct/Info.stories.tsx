import { VoidSigner } from '@ethersproject/abstract-signer'
import { BigNumber } from '@ethersproject/bignumber'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Info from './Info'

export default {
  title: 'Templates/Sales/Direct/Info',
  component: Info,
} as ComponentMeta<typeof Info>

const Template: ComponentStory<typeof Info> = (args) => <Info {...args} />

export const Default = Template.bind({})
Default.args = {
  assetId: '1',
  sales: [
    {
      id: '1',
      expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 day later
      maker: {
        address: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
      },
      unitPrice: BigNumber.from('200').mul(BigNumber.from(10).pow(18)),
      currency: {
        decimals: 18,
        symbol: 'USDC',
      },
    },
    {
      id: '2',
      expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 day later
      maker: {
        address: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
      },
      unitPrice: BigNumber.from('400').mul(BigNumber.from(10).pow(18)),
      currency: {
        decimals: 18,
        symbol: 'USDC',
      },
    },
  ],
  isHomepage: false,
  isOwner: false,
  onOfferCanceled: async () => console.log('offer canceled'),
}

export const Connected = Template.bind({})
Connected.args = {
  ...Default.args,
  signer: new VoidSigner('0x0000000000000000000000000000000000000000'),
  currentAccount: '0x0000000000000000000000000000000000000000',
}

export const ConnectedAsSeller = Template.bind({})
ConnectedAsSeller.args = {
  ...Default.args,
  signer: new VoidSigner('0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54'),
  currentAccount: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
}

import { VoidSigner } from '@ethersproject/abstract-signer'
import { BigNumber } from '@ethersproject/bignumber'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Button from './Button'

export default {
  title: 'Templates/Sales/Direct/Button',
  component: Button,
} as ComponentMeta<typeof Button>

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />

export const Default = Template.bind({})
Default.args = {
  assetId: '1',
  sales: [
    {
      id: '1',
      unitPrice: BigNumber.from(200).mul(BigNumber.from(10).pow(18)),
      currency: {
        id: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
        decimals: 18,
        symbol: 'USDC',
      },
      maker: {
        name: 'Current user',
        address: '0x0000000000000000000000000000000000000000',
        image: undefined,
        verified: false,
      },
      availableQuantity: BigNumber.from(1),
      expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  ],
}

export const LoggedIn = Template.bind({})
LoggedIn.args = {
  ...Default.args,
  signer: new VoidSigner('0x0000000000000000000000000000000000000000'),
  currentAccount: '0x0000000000000000000000000000000000000001',
}

export const HomePageWithFullOwnership = Template.bind({})
HomePageWithFullOwnership.args = {
  ...LoggedIn.args,
  isHomepage: true,
  ownAllSupply: true,
}

export const WithAllSupplyOwned = Template.bind({})
WithAllSupplyOwned.args = {
  ...LoggedIn.args,
  ownAllSupply: true,
}

export const MultipleOffers = Template.bind({})
MultipleOffers.args = {
  ...Default.args,
  signer: new VoidSigner('0x0000000000000000000000000000000000000000'),
  currentAccount: '0x0000000000000000000000000000000000000000',
  sales: [
    {
      id: '1',
      unitPrice: BigNumber.from(200).mul(BigNumber.from(10).pow(18)),
      currency: {
        id: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
        decimals: 18,
        symbol: 'USDC',
      },
      maker: {
        name: 'Current user',
        address: '0x0000000000000000000000000000000000000000',
        image: undefined,
        verified: false,
      },
      availableQuantity: BigNumber.from(1),
      expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
    {
      id: '2',
      unitPrice: BigNumber.from(250).mul(BigNumber.from(10).pow(18)),
      currency: {
        id: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
        decimals: 18,
        symbol: 'USDC',
      },
      maker: {
        name: 'Someone else',
        address: '0x0000000000000000000000000000000000000001',
        image: undefined,
        verified: false,
      },
      availableQuantity: BigNumber.from(1),
      expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  ],
}

export const MultipleOffersWithAllSupplyOwned = Template.bind({})
MultipleOffersWithAllSupplyOwned.args = {
  ...MultipleOffers.args,
  ownAllSupply: true,
}

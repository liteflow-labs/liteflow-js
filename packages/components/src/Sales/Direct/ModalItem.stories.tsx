import { VoidSigner } from '@ethersproject/abstract-signer'
import { BigNumber } from '@ethersproject/bignumber'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import ModalItem from './ModalItem'

export default {
  title: 'Templates/Sales/Direct/Item',
  component: ModalItem,
} as ComponentMeta<typeof ModalItem>

const Template: ComponentStory<typeof ModalItem> = (args) => (
  <ModalItem {...args} />
)

export const Default = Template.bind({})
Default.args = {
  blockExplorer: {
    name: 'Etherscan',
    token: () => `token`,
    transaction: () => `transaction`,
  },
  sale: {
    id: '3e22e37c-743b-4273-bc95-45452f2dd88f',
    unitPrice: BigNumber.from('200').mul(BigNumber.from('10').pow(18)),
    currency: {
      decimals: 18,
      symbol: 'USDC',
    },
    expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 day later
    availableQuantity: BigNumber.from('10'),
    maker: {
      address: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
      image: undefined,
      name: 'GENSHIRO.io',
      verified: true,
    },
  },
}

export const AsCurrentAccount = Template.bind({})
AsCurrentAccount.args = {
  ...Default.args,
  signer: new VoidSigner(Default.args.sale?.maker.address || ''),
  currentAccount: Default.args.sale?.maker.address,
}

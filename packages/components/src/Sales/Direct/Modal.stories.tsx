import { VoidSigner } from '@ethersproject/abstract-signer'
import { BigNumber } from '@ethersproject/bignumber'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Modal from './Modal'

export default {
  title: 'Templates/Sales/Direct/Modal',
  component: Modal,
} as ComponentMeta<typeof Modal>

const sales = [
  {
    id: '1',
    unitPrice: BigNumber.from('200').mul(BigNumber.from('10').pow(18)),
    maker: {
      address: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
      image: undefined,
      name: 'GENSHIRO.io',
      verified: true,
    },
    currency: {
      id: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
      decimals: 18,
      symbol: 'USDC',
    },
    availableQuantity: BigNumber.from('10'),
    expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 day later
  },
  {
    id: '2',
    unitPrice: BigNumber.from('300').mul(BigNumber.from('10').pow(18)),
    expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 day later
    maker: {
      address: '0x0000000000000000000000000000000000000000',
      image: undefined,
      name: 'Mr Nobody',
      verified: false,
    },
    currency: {
      id: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
      decimals: 18,
      symbol: 'USDC',
    },
    availableQuantity: BigNumber.from('5'),
  },
]

const salesWithMultiCurrencies = [
  ...sales,
  {
    id: '3',
    unitPrice: BigNumber.from('12').mul(BigNumber.from('10').pow(18)),
    expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 day later}],
    maker: {
      address: '0x003a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
      image: undefined,
      name: 'Someone else',
      verified: false,
    },
    currency: {
      id: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
      decimals: 18,
      symbol: 'LTF',
    },
    availableQuantity: BigNumber.from('2'),
  },
]

const Template: ComponentStory<typeof Modal> = (args) => <Modal {...args} />

export const Default = Template.bind({})
Default.args = {
  blockExplorer: {
    name: 'Etherscan',
    token: () => `token`,
    transaction: () => `transaction`,
  },
  sales,
}

export const AsCurrentAccount = Template.bind({})
AsCurrentAccount.args = {
  ...Default.args,
  signer: new VoidSigner(Default.args?.sales?.[0].maker.address || ''),
  currentAccount: Default.args?.sales?.[0].maker.address,
}

export const WithMultiCurrencies = Template.bind({})
WithMultiCurrencies.args = {
  ...Default.args,
  sales: salesWithMultiCurrencies,
}

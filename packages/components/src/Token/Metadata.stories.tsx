import { BigNumber } from '@ethersproject/bignumber'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Metadata from './Metadata'

export default {
  title: 'Templates/Token/Metadata',
  component: Metadata,
} as ComponentMeta<typeof Metadata>

const Template: ComponentStory<typeof Metadata> = (args) => (
  <Metadata {...args} />
)

export const Erc721 = Template.bind({})
Erc721.args = {
  standard: 'ERC721',
  creator: {
    address: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
    name: 'GENSHIRO.io',
    image:
      'https://liteflow.mypinata.cloud/ipfs/QmXBPcYmam3gT1dURz66CMXoB4K6kJWTyiw488JmJPxEMt/genshiro_io.png',
    verified: false,
  },
  owners: [
    {
      address: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
      name: 'GENSHIRO.io',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmXBPcYmam3gT1dURz66CMXoB4K6kJWTyiw488JmJPxEMt/genshiro_io.png',
      verified: false,
      quantity: '1',
    },
  ],
  saleSupply: BigNumber.from('1'),
  totalSupply: BigNumber.from('1'),
}

export const Erc1155SingleOwner = Template.bind({})
Erc1155SingleOwner.args = {
  standard: 'ERC1155',
  creator: {
    address: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
    name: 'GENSHIRO.io',
    image:
      'https://liteflow.mypinata.cloud/ipfs/QmXBPcYmam3gT1dURz66CMXoB4K6kJWTyiw488JmJPxEMt/genshiro_io.png',
    verified: false,
  },
  owners: [
    {
      address: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
      name: 'GENSHIRO.io',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmXBPcYmam3gT1dURz66CMXoB4K6kJWTyiw488JmJPxEMt/genshiro_io.png',
      verified: false,
      quantity: '5',
    },
  ],
  saleSupply: BigNumber.from('10'),
  totalSupply: BigNumber.from('100'),
}

export const Erc1155MultipleOwner = Template.bind({})
Erc1155MultipleOwner.args = {
  standard: 'ERC1155',
  creator: {
    address: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
    name: 'GENSHIRO.io',
    image:
      'https://liteflow.mypinata.cloud/ipfs/QmXBPcYmam3gT1dURz66CMXoB4K6kJWTyiw488JmJPxEMt/genshiro_io.png',
    verified: false,
  },
  owners: [
    {
      address: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
      name: 'GENSHIRO.io',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmXBPcYmam3gT1dURz66CMXoB4K6kJWTyiw488JmJPxEMt/genshiro_io.png',
      verified: false,
      quantity: '5',
    },
    {
      address: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
      name: 'GENSHIRO.io 2',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmXBPcYmam3gT1dURz66CMXoB4K6kJWTyiw488JmJPxEMt/genshiro_io.png',
      verified: true,
      quantity: '15',
    },
  ],
  saleSupply: BigNumber.from('10'),
  totalSupply: BigNumber.from('100'),
}

export const Erc1155MultipleOwnerMoreThanFive = Template.bind({})
Erc1155MultipleOwnerMoreThanFive.args = {
  standard: 'ERC1155',
  creator: {
    address: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
    name: 'GENSHIRO.io',
    image:
      'https://liteflow.mypinata.cloud/ipfs/QmXBPcYmam3gT1dURz66CMXoB4K6kJWTyiw488JmJPxEMt/genshiro_io.png',
    verified: false,
  },
  owners: [
    {
      address: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
      name: 'GENSHIRO.io',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmXBPcYmam3gT1dURz66CMXoB4K6kJWTyiw488JmJPxEMt/genshiro_io.png',
      verified: false,
      quantity: '5',
    },
    {
      address: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
      name: 'GENSHIRO.io 2',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmXBPcYmam3gT1dURz66CMXoB4K6kJWTyiw488JmJPxEMt/genshiro_io.png',
      verified: true,
      quantity: '15',
    },
    {
      address: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
      name: 'GENSHIRO.io',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmXBPcYmam3gT1dURz66CMXoB4K6kJWTyiw488JmJPxEMt/genshiro_io.png',
      verified: false,
      quantity: '5',
    },
    {
      address: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
      name: 'GENSHIRO.io 2',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmXBPcYmam3gT1dURz66CMXoB4K6kJWTyiw488JmJPxEMt/genshiro_io.png',
      verified: true,
      quantity: '15',
    },
    {
      address: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
      name: 'GENSHIRO.io',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmXBPcYmam3gT1dURz66CMXoB4K6kJWTyiw488JmJPxEMt/genshiro_io.png',
      verified: false,
      quantity: '5',
    },
    {
      address: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
      name: 'GENSHIRO.io 2',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmXBPcYmam3gT1dURz66CMXoB4K6kJWTyiw488JmJPxEMt/genshiro_io.png',
      verified: true,
      quantity: '15',
    },
    {
      address: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
      name: 'GENSHIRO.io',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmXBPcYmam3gT1dURz66CMXoB4K6kJWTyiw488JmJPxEMt/genshiro_io.png',
      verified: false,
      quantity: '5',
    },
    {
      address: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
      name: 'GENSHIRO.io 2',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmXBPcYmam3gT1dURz66CMXoB4K6kJWTyiw488JmJPxEMt/genshiro_io.png',
      verified: true,
      quantity: '15',
    },
  ],
  saleSupply: BigNumber.from('10'),
  totalSupply: BigNumber.from('100'),
}

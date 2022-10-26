import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import OwnersModal from './Modal'

export default {
  title: 'Templates/Token/Owners/Modal',
  component: OwnersModal,
} as ComponentMeta<typeof OwnersModal>

const Template: ComponentStory<typeof OwnersModal> = (args) => (
  <OwnersModal {...args} />
)

export const Default = Template.bind({})
Default.args = {
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
}

export const fiveOwner = Template.bind({})
fiveOwner.args = {
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
  ],
}

export const Overflow = Template.bind({})
Overflow.args = {
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
}

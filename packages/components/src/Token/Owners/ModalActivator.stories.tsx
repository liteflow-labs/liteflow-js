import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import OwnersModalActivator from './ModalActivator'

export default {
  title: 'Templates/Token/Owners/Modal Activator',
  component: OwnersModalActivator,
} as ComponentMeta<typeof OwnersModalActivator>

const Template: ComponentStory<typeof OwnersModalActivator> = (args) => (
  <OwnersModalActivator {...args} />
)

export const Default = Template.bind({})
Default.args = {
  owners: [
    {
      address: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmXBPcYmam3gT1dURz66CMXoB4K6kJWTyiw488JmJPxEMt/genshiro_io.png',
      name: 'GENSHIRO.io',
    },
    {
      address: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmXBPcYmam3gT1dURz66CMXoB4K6kJWTyiw488JmJPxEMt/genshiro_io.png',
      name: 'GENSHIRO.io',
    },
  ],
}

export const fiveOwner = Template.bind({})
fiveOwner.args = {
  owners: [
    {
      address: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmXBPcYmam3gT1dURz66CMXoB4K6kJWTyiw488JmJPxEMt/genshiro_io.png',
      name: 'GENSHIRO.io',
    },
    {
      address: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmXBPcYmam3gT1dURz66CMXoB4K6kJWTyiw488JmJPxEMt/genshiro_io.png',
      name: 'GENSHIRO.io',
    },
    {
      address: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmXBPcYmam3gT1dURz66CMXoB4K6kJWTyiw488JmJPxEMt/genshiro_io.png',
      name: 'GENSHIRO.io',
    },
    {
      address: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmXBPcYmam3gT1dURz66CMXoB4K6kJWTyiw488JmJPxEMt/genshiro_io.png',
      name: 'GENSHIRO.io',
    },
    {
      address: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmXBPcYmam3gT1dURz66CMXoB4K6kJWTyiw488JmJPxEMt/genshiro_io.png',
      name: 'GENSHIRO.io',
    },
  ],
}

export const moreThanFiveOwner = Template.bind({})
moreThanFiveOwner.args = {
  owners: [
    {
      address: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmXBPcYmam3gT1dURz66CMXoB4K6kJWTyiw488JmJPxEMt/genshiro_io.png',
      name: 'GENSHIRO.io',
    },
    {
      address: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmXBPcYmam3gT1dURz66CMXoB4K6kJWTyiw488JmJPxEMt/genshiro_io.png',
      name: 'GENSHIRO.io',
    },
    {
      address: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmXBPcYmam3gT1dURz66CMXoB4K6kJWTyiw488JmJPxEMt/genshiro_io.png',
      name: 'GENSHIRO.io',
    },
    {
      address: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmXBPcYmam3gT1dURz66CMXoB4K6kJWTyiw488JmJPxEMt/genshiro_io.png',
      name: 'GENSHIRO.io',
    },
    {
      address: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmXBPcYmam3gT1dURz66CMXoB4K6kJWTyiw488JmJPxEMt/genshiro_io.png',
      name: 'GENSHIRO.io',
    },
    {
      address: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmXBPcYmam3gT1dURz66CMXoB4K6kJWTyiw488JmJPxEMt/genshiro_io.png',
      name: 'GENSHIRO.io',
    },
    {
      address: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmXBPcYmam3gT1dURz66CMXoB4K6kJWTyiw488JmJPxEMt/genshiro_io.png',
      name: 'GENSHIRO.io',
    },
    {
      address: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmXBPcYmam3gT1dURz66CMXoB4K6kJWTyiw488JmJPxEMt/genshiro_io.png',
      name: 'GENSHIRO.io',
    },
    {
      address: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmXBPcYmam3gT1dURz66CMXoB4K6kJWTyiw488JmJPxEMt/genshiro_io.png',
      name: 'GENSHIRO.io',
    },
    {
      address: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmXBPcYmam3gT1dURz66CMXoB4K6kJWTyiw488JmJPxEMt/genshiro_io.png',
      name: 'GENSHIRO.io',
    },
    {
      address: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmXBPcYmam3gT1dURz66CMXoB4K6kJWTyiw488JmJPxEMt/genshiro_io.png',
      name: 'GENSHIRO.io',
    },
    {
      address: '0x0043a24fe3e2de5ec5c3ab0efd35b746a28b4f54',
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmXBPcYmam3gT1dURz66CMXoB4K6kJWTyiw488JmJPxEMt/genshiro_io.png',
      name: 'GENSHIRO.io',
    },
  ],
}

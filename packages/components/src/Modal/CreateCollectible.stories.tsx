import { CreateNftStep } from '@nft/hooks'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import CreateCollectible from './CreateCollectible'

export default {
  title: 'Templates/Modals/Create Collectible',
  component: CreateCollectible,
} as ComponentMeta<typeof CreateCollectible>

const Template: ComponentStory<typeof CreateCollectible> = (args) => (
  <CreateCollectible {...args} />
)

export const Upload = Template.bind({})
Upload.args = {
  isOpen: true,
  title: 'Create a Collectible',
  step: CreateNftStep.UPLOAD,
  blockExplorer: {
    name: 'Etherscan',
    token: () => `token`,
    transaction: () => `transaction`,
  },
}

export const TransactionSignature = Template.bind({})
TransactionSignature.args = {
  ...Upload.args,
  step: CreateNftStep.TRANSACTION_SIGNATURE,
}

export const TransactionPending = Template.bind({})
TransactionPending.args = {
  ...Upload.args,
  step: CreateNftStep.TRANSACTION_PENDING,
  transactionHash: 'xxx',
}

export const Ownership = Template.bind({})
Ownership.args = {
  ...Upload.args,
  step: CreateNftStep.OWNERSHIP,
  transactionHash: 'xxx',
}

export const LazyMintUpload = Template.bind({})
LazyMintUpload.args = {
  ...Upload.args,
  step: CreateNftStep.UPLOAD,
  isLazyMint: true,
}

export const LazyMintSignature = Template.bind({})
LazyMintSignature.args = {
  ...Upload.args,
  step: CreateNftStep.LAZYMINT_SIGNATURE,
  isLazyMint: true,
}

export const LazyMintPending = Template.bind({})
LazyMintPending.args = {
  ...Upload.args,
  step: CreateNftStep.LAZYMINT_PENDING,
  isLazyMint: true,
}

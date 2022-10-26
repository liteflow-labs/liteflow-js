import { CreateOfferStep } from '@nft/hooks'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import CreateOffer from './CreateOffer'

export default {
  title: 'Templates/Modals/Create Offer',
  component: CreateOffer,
} as ComponentMeta<typeof CreateOffer>

const Template: ComponentStory<typeof CreateOffer> = (args) => (
  <CreateOffer {...args} />
)

export const ApprovalSignature = Template.bind({})
ApprovalSignature.args = {
  isOpen: true,
  title: 'Place a bid',
  step: CreateOfferStep.APPROVAL_SIGNATURE,
  blockExplorer: {
    name: 'Etherscan',
    token: () => `token`,
    transaction: () => `transaction`,
  },
}

export const ApprovalPending = Template.bind({})
ApprovalPending.args = {
  ...ApprovalSignature.args,
  step: CreateOfferStep.APPROVAL_PENDING,
}

export const Signature = Template.bind({})
Signature.args = {
  ...ApprovalSignature.args,
  step: CreateOfferStep.SIGNATURE,
  transactionHash: 'xxx',
}

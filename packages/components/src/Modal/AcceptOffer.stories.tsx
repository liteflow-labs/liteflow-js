import { AcceptOfferStep } from '@nft/hooks'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import AcceptOffer from './AcceptOffer'

export default {
  title: 'Templates/Modals/Accept Offer',
  component: AcceptOffer,
} as ComponentMeta<typeof AcceptOffer>

const Template: ComponentStory<typeof AcceptOffer> = (args) => (
  <AcceptOffer {...args} />
)

export const ApprovalSignature = Template.bind({})
ApprovalSignature.args = {
  isOpen: true,
  title: 'Accept a bid',
  step: AcceptOfferStep.APPROVAL_SIGNATURE,
  blockExplorer: {
    name: 'Etherscan',
    token: () => `token`,
    transaction: () => `transaction`,
  },
}

export const ApprovalPending = Template.bind({})
ApprovalPending.args = {
  ...ApprovalSignature.args,
  step: AcceptOfferStep.APPROVAL_PENDING,
}

export const TransactionSignature = Template.bind({})
TransactionSignature.args = {
  ...ApprovalSignature.args,
  step: AcceptOfferStep.TRANSACTION_SIGNATURE,
}

export const TransactionPending = Template.bind({})
TransactionPending.args = {
  ...ApprovalSignature.args,
  step: AcceptOfferStep.TRANSACTION_PENDING,
  transactionHash: 'xxx',
}

export const Ownership = Template.bind({})
Ownership.args = {
  ...ApprovalSignature.args,
  step: AcceptOfferStep.OWNERSHIP,
  transactionHash: 'xxx',
}

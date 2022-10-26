import { AcceptAuctionStep } from '@nft/hooks'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import AcceptAuction from './AcceptAuction'

export default {
  title: 'Templates/Modals/Accept Auction',
  component: AcceptAuction,
} as ComponentMeta<typeof AcceptAuction>

const Template: ComponentStory<typeof AcceptAuction> = (args) => (
  <AcceptAuction {...args} />
)

export const ResolveBestBid = Template.bind({})
ResolveBestBid.args = {
  isOpen: true,
  title: 'Confirm the sale',
  step: AcceptAuctionStep.RESOLVE_BEST_BID,
  blockExplorer: {
    name: 'Etherscan',
    token: () => `token`,
    transaction: () => `transaction`,
  },
}

export const ApprovalSignature = Template.bind({})
ApprovalSignature.args = {
  ...ResolveBestBid.args,
  step: AcceptAuctionStep.APPROVAL_SIGNATURE,
}

export const ApprovalPending = Template.bind({})
ApprovalPending.args = {
  ...ResolveBestBid.args,
  step: AcceptAuctionStep.APPROVAL_PENDING,
}

export const TransactionSignature = Template.bind({})
TransactionSignature.args = {
  ...ResolveBestBid.args,
  step: AcceptAuctionStep.TRANSACTION_SIGNATURE,
}

export const TransactionPending = Template.bind({})
TransactionPending.args = {
  ...ResolveBestBid.args,
  step: AcceptAuctionStep.TRANSACTION_PENDING,
  transactionHash: 'xxx',
}

export const Ownership = Template.bind({})
Ownership.args = {
  ...ResolveBestBid.args,
  step: AcceptAuctionStep.OWNERSHIP,
  transactionHash: 'xxx',
}

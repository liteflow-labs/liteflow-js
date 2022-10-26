import { CancelOfferStep } from '@nft/hooks'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import CancelOffer from './CancelOffer'

export default {
  title: 'Templates/Modals/Cancel Offer',
  component: CancelOffer,
} as ComponentMeta<typeof CancelOffer>

const Template: ComponentStory<typeof CancelOffer> = (args) => (
  <CancelOffer {...args} />
)

export const TransactionSignature = Template.bind({})
TransactionSignature.args = {
  isOpen: true,
  title: 'Cancel Offer',
  step: CancelOfferStep.TRANSACTION_SIGNATURE,
  blockExplorer: {
    name: 'Etherscan',
    token: () => `token`,
    transaction: () => `transaction`,
  },
}

export const TransactionPending = Template.bind({})
TransactionPending.args = {
  ...TransactionSignature.args,
  step: CancelOfferStep.TRANSACTION_PENDING,
  transactionHash: 'xxx',
}

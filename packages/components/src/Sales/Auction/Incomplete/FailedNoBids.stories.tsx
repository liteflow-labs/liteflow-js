import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import SaleAuctionIncompleteNoBids from './FailedNoBids'

export default {
  title: 'Templates/Sales/Auction/Incomplete/Failed No Bids',
  component: SaleAuctionIncompleteNoBids,
} as ComponentMeta<typeof SaleAuctionIncompleteNoBids>

const Template: ComponentStory<typeof SaleAuctionIncompleteNoBids> = (args) => (
  <SaleAuctionIncompleteNoBids {...args} />
)

export const Default = Template.bind({})
Default.args = {
  isOwner: false,
}

export const AsOwner = Template.bind({})
AsOwner.args = {
  isOwner: true,
}

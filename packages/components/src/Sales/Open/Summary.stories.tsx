import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import Summary from './Summary'

export default {
  title: 'Templates/Sales/Open/Summary',
  component: Summary,
} as ComponentMeta<typeof Summary>

const Template: ComponentStory<typeof Summary> = (args) => <Summary {...args} />

export const Default = Template.bind({})
Default.args = {
  currencies: [],
}

export const MultiCurrency = Template.bind({})
MultiCurrency.args = {
  currencies: [
    {
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmWdK1GCQpPVcbfJNJPy32j5E7FsnQ3oRSKq3gJgRVWgP1',
    },
    {
      image:
        'https://liteflow.mypinata.cloud/ipfs/QmRfuRH7DHBqFeJnkzhvehM56a9Ym6vCHPM1Jssm5fjTKv',
    },
  ],
}

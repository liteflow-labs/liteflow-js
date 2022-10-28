import { Text } from '@chakra-ui/react'
import { BigNumber } from '@ethersproject/bignumber'
import useTranslation from 'next-translate/useTranslation'
import React, { VFC } from 'react'
import invariant from 'ts-invariant'
import { AssetHistoryAction } from '../graphql'
import List from '../List/List'
import {
  ListingListItem,
  MintListItem,
  PurchaseListItem,
  TransferListItem,
} from './ListItem'
import LazyMintListItem from './ListItem/LazyMintListItem'

type IProps = {
  histories: {
    action: AssetHistoryAction | null
    date: Date
    quantity: BigNumber
    unitPrice: BigNumber | null
    fromAddress: string
    from: {
      name: string | null
      image: string | null
      verified: boolean
    } | null
    toAddress: string | null
    to: {
      name: string | null
      image: string | null
      verified: boolean
    } | null
    transactionHash: string | null
    currency: {
      decimals: number
      symbol: string
    } | null
  }[]
  blockExplorer: BlockExplorer
}

const HistoryList: VFC<IProps> = ({ histories, blockExplorer }) => {
  const { t } = useTranslation('components')
  const ListItem = (history: IProps['histories'][0]) => {
    switch (history.action) {
      case AssetHistoryAction.Listing:
        invariant(history.unitPrice, 'unitPrice is required')
        return (
          <ListingListItem
            {...history}
            currency={history.currency}
            unitPrice={history.unitPrice}
          />
        )

      case AssetHistoryAction.Purchase:
        invariant(history.unitPrice, 'unitPrice is required')
        invariant(history.toAddress, 'toAddress is required')
        return (
          <PurchaseListItem
            {...history}
            currency={history.currency}
            unitPrice={history.unitPrice}
            toAddress={history.toAddress}
            blockExplorer={blockExplorer}
          />
        )

      case AssetHistoryAction.Transfer:
        invariant(history.toAddress, 'toAddress is required')
        if (
          history.fromAddress === '0x0000000000000000000000000000000000000000'
        ) {
          return (
            <MintListItem
              {...history}
              blockExplorer={blockExplorer}
              toAddress={history.toAddress}
            />
          )
        }
        return (
          <TransferListItem
            {...history}
            toAddress={history.toAddress}
            blockExplorer={blockExplorer}
          />
        )

      case AssetHistoryAction.Lazymint:
        return <LazyMintListItem {...history} />
    }
  }
  if (histories.length === 0)
    return (
      <Text as="p" variant="text">
        {t('history.none')}
      </Text>
    )
  return <List>{histories.map((history) => ListItem(history))}</List>
}

export default HistoryList

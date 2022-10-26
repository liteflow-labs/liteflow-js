import { Text } from '@chakra-ui/react'
import { Signer } from '@ethersproject/abstract-signer'
import useTranslation from 'next-translate/useTranslation'
import React, { VFC } from 'react'
import List from '../List/List'
import type { Props as BidProps } from './Bid'
import Bid from './Bid'

type Props = {
  bids: (BidProps['bid'] & { currency: { id: string } })[]
  signer: Signer | undefined
  account: string | null | undefined
  isSingle: boolean
  blockExplorer: BlockExplorer
  preventAcceptation: boolean
  onAccepted: (id: string) => Promise<void>
  onCanceled: (id: string) => Promise<void>
}

const BidList: VFC<Props> = ({
  bids,
  signer,
  account,
  isSingle,
  blockExplorer,
  preventAcceptation,
  onAccepted,
  onCanceled,
}) => {
  const { t } = useTranslation('components')
  if (bids.length === 0)
    return (
      <Text as="p" variant="text" color="gray.500">
        {t('bid.list.none')}
      </Text>
    )
  return (
    <List>
      {bids.map((bid, i) => (
        <>
          {i > 0 && bids[i - 1].currency.id !== bid.currency.id && <hr />}
          <Bid
            bid={bid}
            key={bid.id}
            signer={signer}
            account={account}
            preventAcceptation={preventAcceptation}
            blockExplorer={blockExplorer}
            onAccepted={onAccepted}
            onCanceled={onCanceled}
            isSingle={isSingle}
          />
        </>
      ))}
    </List>
  )
}

export default BidList

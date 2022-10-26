import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { useEffect, useMemo, useState } from 'react'

type TimelineStatus = {
  inProgress: boolean
  ended: boolean
  endedAndWaitingForTransfer: boolean
}

type SuccessStatus = {
  hasBids: boolean
  bellowReservePrice: boolean
  reservePriceMatches: boolean
}

export default function useAuctionStatus(
  auction?: {
    endAt: string | Date
    expireAt: string | Date
    reserveAmount: BigNumberish
    winningOffer: { id: string } | null | undefined
  },
  bestBid?: {
    amount: BigNumberish
  },
): TimelineStatus & SuccessStatus {
  const [now, setNow] = useState(new Date())

  // auction is still on going, can receive new bids
  const inProgress = useMemo(() => {
    if (!auction) return false
    return new Date(auction.endAt) > now
  }, [auction, now])

  // auction cannot receive new bids
  const ended = useMemo(() => {
    if (!auction) return false
    return new Date(auction.endAt) < now
  }, [now, auction])

  // auction cannot receive new bids and waiting for seller to transfer the asset
  const endedAndWaitingForTransfer = useMemo(() => {
    if (!auction) return false
    return (
      ended && now < new Date(auction.expireAt) && !auction.winningOffer?.id
    )
  }, [ended, auction, now])

  const hasBids = useMemo(() => !!bestBid, [bestBid])

  const bellowReservePrice = useMemo(
    () =>
      BigNumber.from(bestBid?.amount || '0').lt(
        BigNumber.from(auction?.reserveAmount || '0'),
      ),
    [auction?.reserveAmount, bestBid?.amount],
  )

  const reservePriceMatches = useMemo(
    () =>
      BigNumber.from(bestBid?.amount || '0').gte(
        BigNumber.from(auction?.reserveAmount || '0'),
      ),
    [auction?.reserveAmount, bestBid?.amount],
  )

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  })

  return {
    inProgress,
    endedAndWaitingForTransfer,
    ended,

    hasBids,
    bellowReservePrice,
    reservePriceMatches,
  }
}

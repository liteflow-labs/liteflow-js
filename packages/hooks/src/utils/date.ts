import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(relativeTime)
dayjs.extend(duration)

export const dateFromNow = (date: Date | string): string => {
  return dayjs(date).fromNow()
}

export const formatDate = (date: Date | string): string => {
  return dayjs(date).utc().format('DD/MM/YYYY, HH[:]mm UTC')
}

/**
  Valid format for inputs min and max
  Input doesn't accept other formats for datetime-local 
**/
export const formatDateDatetime = (date: Date | string): string => {
  return dayjs(date).utc(true).format('YYYY-MM-DD[T]HH[:]mm')
}

export const getHumanizedDate = (second: number): string => {
  return dayjs.duration(second, 'seconds').humanize()
}

import { Flex, Icon, IconButton, Text } from '@chakra-ui/react'
import { IoChevronBackSharp } from '@react-icons/all-files/io5/IoChevronBackSharp'
import { IoChevronForward } from '@react-icons/all-files/io5/IoChevronForward'
import React, { useMemo } from 'react'
import Select from '../Select/Select'

export type IProp = {
  limits: number[]
  limit: number
  page: number
  total?: number
  onPageChange: (page: number) => void
  onLimitChange: (limit: string) => void
  result: {
    label: string
    caption: (context: {
      from: number
      to: number
      total: number
    }) => string | JSX.Element
    pages: (context: { total: number }) => string | JSX.Element
  }
}

export default function Pagination({
  onPageChange,
  onLimitChange,
  total,
  page = 1,
  limits,
  limit,
  result,
  ...props
}: IProp): JSX.Element {
  const goTo = (newPage: number) => {
    if (!total) return
    if (page === newPage) return
    if (newPage < 1) return onPageChange(1)
    if (newPage > Math.ceil(total / limit))
      return onPageChange(Math.ceil(total / limit))
    return onPageChange(newPage)
  }

  const totalPage = useMemo(
    () => (total ? Math.ceil(total / limit) : 0),
    [limit, total],
  )

  if (!total) return <></>
  return (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      align="center"
      justify={{ base: 'center', sm: 'space-between' }}
      w="full"
      gap={{ base: 6, md: 3 }}
      {...props}
    >
      <Flex
        align="center"
        gap={{ base: 6, md: 6 }}
        w={{ base: 'full', sm: 'auto' }}
        direction={{ base: 'column', sm: 'row' }}
      >
        <Select
          selectWidth={24}
          label={result.label}
          name="limit"
          onChange={(e: any) => onLimitChange(e)}
          choices={limits.map((x) => ({
            value: x.toString(),
            label: x.toString(),
          }))}
          value={limit.toString()}
          inlineLabel
        />
        <Text as="span" variant="text-sm" mt={{ base: 'auto', sm: 0 }} w="full">
          {result.caption({
            from: (page - 1) * limit + 1,
            to: Math.min((page - 1) * limit + limit, total || Infinity),
            total: total,
          })}
        </Text>
      </Flex>
      <Flex
        as="nav"
        justify={{ base: 'space-between', md: 'flex-end' }}
        w={{ base: 'full', sm: 'auto' }}
        gap={6}
        aria-label="Pagination"
      >
        <Flex align="center" gap={3}>
          <Select
            selectWidth={24}
            name="page"
            onChange={(e: any) => goTo(parseInt(e.toString(), 10))}
            choices={Array.from({ length: totalPage }, (_, i) => i + 1).map(
              (x) => ({
                value: x.toString(),
                label: x.toString(),
              }),
            )}
            value={page.toString()}
          />
          <Text as="p" variant="text-sm" w="full">
            {result.pages({ total: totalPage })}
          </Text>
        </Flex>
        <Flex align="center" gap={4}>
          <IconButton
            variant="outline"
            colorScheme="gray"
            rounded="full"
            aria-label="previous"
            icon={
              <Icon as={IoChevronBackSharp} h={5} w={5} aria-hidden="true" />
            }
            disabled={page === 1}
            onClick={() => goTo(page - 1)}
          />
          <IconButton
            variant="outline"
            colorScheme="gray"
            rounded="full"
            aria-label="next"
            icon={<Icon as={IoChevronForward} h={5} w={5} aria-hidden="true" />}
            disabled={page === totalPage}
            onClick={() => goTo(page + 1)}
          />
        </Flex>
      </Flex>
    </Flex>
  )
}

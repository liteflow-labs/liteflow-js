import { Box, chakra, Flex, SimpleGrid, Stack } from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import React, { VFC } from 'react'
import Empty from '../Empty/Empty'
import type { IProp as PaginationProps } from '../Pagination/Pagination'
import Pagination from '../Pagination/Pagination'
import Select from '../Select/Select'
import type { Props as NFTCardProps } from './Card'
import NFTCard from './Card'

const TokenGrid: VFC<{
  assets: (NFTCardProps['asset'] & {
    auction: NFTCardProps['auction']
    creator: NFTCardProps['creator']
    sale: NFTCardProps['sale']
    numberOfSales: number
    hasMultiCurrency: boolean
  })[]
  orderBy: {
    value: string
    choices: {
      value: string
      label: string
    }[]
    onSort: (orderBy: any) => Promise<void>
  }
  pagination: PaginationProps
}> = ({ assets, orderBy, pagination }) => {
  const { t } = useTranslation('components')
  if (assets.length === 0)
    return (
      <Empty
        title={t('token.grid.empty.title')}
        description={t('token.grid.empty.description')}
        button={t('token.grid.empty.action')}
        href="/explore"
      />
    )

  const ChakraPagination = chakra(Pagination)

  return (
    <Stack spacing={6}>
      <Box ml="auto" w={{ base: 'full', md: 'min-content' }}>
        <Select
          label={t('token.grid.sort.label')}
          name="orderBy"
          onChange={orderBy.onSort}
          choices={orderBy.choices}
          value={orderBy.value}
          inlineLabel
        />
      </Box>
      <SimpleGrid
        flexWrap="wrap"
        spacing={{ base: 4, lg: 3, xl: 4 }}
        columns={{ base: 1, sm: 2, md: 3 }}
        py={6}
      >
        {assets.map(
          (
            {
              auction,
              creator,
              sale,
              numberOfSales,
              hasMultiCurrency,
              ...asset
            },
            i,
          ) => (
            <Flex key={i} justify="center">
              <NFTCard
                asset={asset}
                auction={auction}
                creator={creator}
                sale={sale}
                numberOfSales={numberOfSales}
                hasMultiCurrency={hasMultiCurrency}
              />
            </Flex>
          ),
        )}
      </SimpleGrid>
      <ChakraPagination
        py="6"
        borderTop="1px"
        borderColor="inherit"
        {...pagination}
      />
    </Stack>
  )
}

export default TokenGrid

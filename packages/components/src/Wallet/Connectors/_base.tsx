import { Box, Spinner, Text } from '@chakra-ui/react'
import { useActivateWallet } from '@nft/hooks'
import { AbstractConnector } from '@web3-react/abstract-connector'
import React, { SyntheticEvent, VFC } from 'react'

type Props = {
  connector: AbstractConnector
  name: string
  icon: JSX.Element
  onError: (error?: Error) => void
  onAuthenticated?: () => void
}

const WalletBase: VFC<Props> = ({
  icon,
  connector,
  onError,
  onAuthenticated,
  name,
}) => {
  const { activate, activatingConnector } = useActivateWallet(onAuthenticated)

  const handle = async (e: SyntheticEvent) => {
    e.stopPropagation()
    e.preventDefault()
    onError() // reset error
    if (activatingConnector === connector) return
    activate(connector).catch(onError)
  }

  return (
    <Box as="a" p={6} onClick={handle}>
      {activatingConnector === connector ? (
        <Spinner display="block" h={8} w={8} thickness="2px" speed="0.65s" />
      ) : (
        <Box h={8} w={8}>
          {icon}
        </Box>
      )}
      <Text as="span" fontSize="sm" fontWeight="semibold" lineHeight={5}>
        {name}
      </Text>
    </Box>
  )
}
export default WalletBase

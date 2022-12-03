import { SessionContext } from '@nft/hooks'
import { useWeb3React } from '@web3-react/core'
import React, { FC } from 'react'

const Session: FC<{}> = ({ ...props }) => {
  const { account, deactivate, error } = useWeb3React()

  return (
    <SessionContext.Provider
      value={{
        account,
        error,
        deactivate: deactivate,
      }}
      {...props}
    />
  )
}

export default Session

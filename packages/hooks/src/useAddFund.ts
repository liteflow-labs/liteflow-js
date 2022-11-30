import { Signer } from '@ethersproject/abstract-signer'
import { gql } from 'graphql-request'
import { useCallback, useContext, useState } from 'react'
import invariant from 'ts-invariant'
import { LiteflowContext } from './context'
import useConfig from './useConfig'
import { ErrorMessages } from './errorMessages'

gql`
  mutation CreateWyrePayment($address: Address!) {
    createWyrePayment(address: $address) {
      reservation
      url
    }
  }
`

export default function useAddFund(
  signer: Signer | undefined,
): [() => Promise<void>, { loading: boolean }] {
  const { sdk } = useContext(LiteflowContext)
  const [loading, setLoading] = useState(false)
  const config = useConfig()

  const addFunds = useCallback(async () => {
    invariant((await config).hasTopUp, ErrorMessages.FEATURE_DISABLED_TOP_UP)
    invariant(signer, ErrorMessages.SIGNER_FALSY)
    try {
      setLoading(true)
      const account = await signer.getAddress()
      const { createWyrePayment } = await sdk.CreateWyrePayment({
        address: account.toLowerCase(),
      })
      // TOFIX: Should return the URL and let the component open in a new window
      window.open(createWyrePayment.url)
    } finally {
      setLoading(false)
    }
  }, [sdk, signer, config])
  return [addFunds, { loading }]
}

import { Signer } from '@ethersproject/abstract-signer'
import { gql } from 'graphql-request'
import { useCallback, useContext, useState } from 'react'
import { LiteflowContext } from './context'

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
): [() => Promise<null | undefined>, { loading: boolean }] {
  const { sdk } = useContext(LiteflowContext)
  const [loading, setLoading] = useState(false)
  const addFunds = useCallback(async () => {
    if (!signer) throw new Error('signer falsy')
    try {
      setLoading(true)
      const account = await signer.getAddress()
      const data = await sdk.CreateWyrePayment({
        address: account.toLowerCase(),
      })
      const { url } = (data || {}).createWyrePayment || {}
      if (!url) return null
      window.open(url)
    } finally {
      setLoading(false)
    }
  }, [sdk, signer])
  return [addFunds, { loading }]
}

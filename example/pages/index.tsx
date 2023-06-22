import { Signer, TypedDataSigner } from '@ethersproject/abstract-signer'
import { toAddress } from '@liteflow/core'
import { useCreateOffer, useIsLoggedIn } from '@liteflow/react'
import { BigNumber } from 'ethers'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'
import { useAccount, useDisconnect, useSigner } from 'wagmi'

export default function Home(): JSX.Element {
  const { push } = useRouter()
  const { disconnect } = useDisconnect()
  const { address } = useAccount()
  const { data: signer } = useSigner<Signer & TypedDataSigner>()
  const isLoggedIn = useIsLoggedIn(address)

  const [createOffer] = useCreateOffer(signer)

  const create = useCallback(async () => {
    const price = parseFloat(prompt('Price of the offer'))
    const id = await createOffer({
      type: 'BUY',
      chain: Number(process.env.CHAIN), // Pass the chain ID,
      collection: toAddress(process.env.NEXT_PUBLIC_COLLECTION), // Pass a desired collection address,
      token: process.env.NEXT_PUBLIC_TOKEN, // Pass a desired asset ID,
      expiredAt: new Date(Date.now() + 1000 * 60 * 60),
      quantity: BigNumber.from(1),
      unitPrice: {
        amount: BigNumber.from(price * 1e6), // Replace `1e6` by the right number of decimals of the used currency to shift the price to unit.
        currency: toAddress(process.env.NEXT_PUBLIC_CURRENCY),
      },
    })
    alert(id)
  }, [createOffer])

  useEffect(() => {
    if (isLoggedIn) return
    void push('/login')
  }, [isLoggedIn, push])

  if (!isLoggedIn) return null
  return (
    <>
      <button onClick={create}>Create offer</button>
      <button style={{ marginTop: '1em' }} onClick={() => disconnect()}>
        Disconnect
      </button>
    </>
  )
}

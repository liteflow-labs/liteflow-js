import { Signer, TypedDataSigner } from '@ethersproject/abstract-signer'
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
      assetId: process.env.NEXT_PUBLIC_ASSET_ID, // Pass a desired asset ID,
      currencyId: process.env.NEXT_PUBLIC_CURRENCY_ID, // Pass the desired currency ID
      expiredAt: new Date(Date.now() + 1000 * 60 * 60),
      quantity: BigNumber.from(1),
      unitPrice: BigNumber.from(price * 1e6), // Replace `1e6` by the right number of decimals of the used currency to shift the price to unit.
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

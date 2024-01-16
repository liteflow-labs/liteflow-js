import { Signer, TypedDataSigner } from '@ethersproject/abstract-signer'
import { toAddress } from '@liteflow/core'
import { useAuthenticate, useCreateOffer, useIsLoggedIn } from '@liteflow/react'
import { BigNumber } from 'ethers'
import { useCallback } from 'react'
import { useAccount, useConnect, useSigner } from 'wagmi'

export default function Home(): JSX.Element {
  const { address, isConnected } = useAccount()
  const {
    connect,
    connectors: [connector],
  } = useConnect()
  const [authenticate] = useAuthenticate()
  const { data: signer } = useSigner<Signer & TypedDataSigner>()
  const isLoggedIn = useIsLoggedIn(address)
  const [createOffer] = useCreateOffer(signer)

  const create = useCallback(async () => {
    const price = parseFloat(prompt('Price of the offer'))
    const id = await createOffer({
      type: 'BUY',
      chain: Number(process.env.NEXT_PUBLIC_CHAIN), // Pass the chain ID,
      collection: toAddress(process.env.NEXT_PUBLIC_COLLECTION), // Pass a desired collection address,
      token: process.env.NEXT_PUBLIC_TOKEN, // Pass a desired asset ID,
      expiredAt: new Date(Date.now() + 1000 * 60 * 60),
      quantity: BigNumber.from(1),
      unitPrice: {
        amount: BigNumber.from(price).mul(BigNumber.from(10).pow(18)), // Replace `pow(18)` by the right number of decimals of the used currency to shift the price to unit.
        currency: toAddress(process.env.NEXT_PUBLIC_CURRENCY),
      },
    })
    alert(id)
  }, [createOffer])

  if (!isConnected)
    return <button onClick={() => connect({ connector })}>Connect</button>
  if (!signer) return <span>Connected without signer</span>
  if (!isLoggedIn)
    return <button onClick={() => authenticate(signer)}>Login</button>
  return <button onClick={create}>Create offer</button>
}

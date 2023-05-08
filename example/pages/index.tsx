import { Signer, TypedDataSigner } from '@ethersproject/abstract-signer'
import { useCreateOffer, useIsLoggedIn } from '@nft/hooks'
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
      chainId: 80001, // Pass a desired chain id
      collectionAddress: '0xe3fe92dfe68f4b074ee7daca7c700e7a11a11397', // Pass a desired collection address
      tokenId:
        '60249402084987642306602912823737587855293854847399126862551129956955539542019', // Pass a desired token id
      currencyId: '80001-0x0fa8781a83bc094ea2a023e46826621b12e71b23', // Pass the desired currency id
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

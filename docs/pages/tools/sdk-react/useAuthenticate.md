---
title: 'useAuthenticate'
---

# useAuthenticate

Hook to authenticate a web3 wallet against the API. It returns a token that needs to be used as the `Authorization` header with the value `Bearer ${jwtToken}`.

## Usage

```tsx
import { useAuthenticate } from '@liteflow/react'
import { useMemo } from 'react'
import { publicActions } from 'viem'
import { useWalletClient } from 'wagmi'

export default function Component() {
  const { data: walletClient } = useWalletClient()
  const signer = useMemo(() => {
    return walletClient?.extend(publicActions)
  }, [walletClient])

  const [authenticate, { loading }] = useAuthenticate()

  const handleClick = async () => {
    if (!signer) return

    const { accountAddress, jwtToken } = await authenticate(signer)
    alert(
      `Your authentication token for address ${accountAddress} is ${jwtToken}`,
    )
  }

  return (
    <button onClick={handleClick} disabled={loading}>
      Authenticate
    </button>
  )
}
```

## Return values

```tsx
[
  (signer: Signer & TypedDataSigner) => Promise<void>, // authenticate. function to authenticate, you need to pass a signer
  {
    loading: boolean // Returns "true" if still authenticating
    setAuthenticationToken: (token: string) => void // Set an authentication token.
    resetAuthenticationToken: () => void // Clears the authentication token
  }
]
```

### authenticate

Function to authenticate a wallet

Arguments:

```tsx
signer: Signer | undefined // Ethers signer: https://docs.ethers.io/v5/api/signer/
```

### loading

Returns `true` if still authenticating

### setAuthenticationToken

Set the authentication token.
Useful when your app saves a user's authentication token in a permanent storage (e.g: local storage or cookie) and want to bypass the authentication.
Can be use to allow a user's wallet to autoconnect and not have to sign the authentication message again.

### resetAuthenticationToken

Clears the authentication token

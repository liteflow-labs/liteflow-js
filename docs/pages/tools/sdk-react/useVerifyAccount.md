---
title: 'useVerifyAccount'
---

# useVerifyAccount

Hook to request to get the current user account verified by admins. This is an optional feature.

## Usage

```tsx
import { useVerifyAccount } from '@liteflow/react'

export default function Component() {
  const signer = undefined // type of "Signer & TypedDataSigner" Get the signer from the wallet. Need to be an Ethers Signer (https://docs.ethers.io/v5/api/signer/)
  const [verifyAccount, { loading }] = useVerifyAccount(signer)

  const handleClick = async () => {
    await verifyAccount() // Request to verify the current signer's wallet address
  }

  return (
    <button onClick={handleClick} disabled={loading}>
      Verify account
    </button>
  )
}
```

## Configuration

```tsx
useVerifyAccount(
  signer: Signer | undefined, // Ethers signer: https://docs.ethers.io/v5/api/signer/
)
```

## Return values

```tsx
;[
  () => Promise<string>, // verifyAccount. Function to request to verify the account, returns the verification status of the account
  {
    loading: boolean, // Returns "true" when the request is still under review
  },
]
```

### verifyAccount

Requests for an account to be verified.

Returns `AccountVerificationStatus`:

```tsx
{
  Pending: 'PENDING', // account verification is still pending
  Rejected: 'REJECTED', // account verification has been rejected
  Validated: 'VALIDATED' // account verification is validated
}
```

### loading

Returns `true` when the request to verify the account is still under review.
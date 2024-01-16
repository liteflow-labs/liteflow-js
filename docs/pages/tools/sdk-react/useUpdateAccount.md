---
title: 'useUpdateAccount'
---

# useUpdateAccount

Hook to update the user account's information.

## Usage

```tsx
import { useUpdateAccount } from '@liteflow/react'

export default function Component() {
  const signer = undefined // type of "Signer & TypedDataSigner" Get the signer from the wallet. Need to be an Ethers Signer (https://docs.ethers.io/v5/api/signer/)
  const [updateAccount, { loading }] = useUpdateAccount(signer, {
    uploadUrl: 'Your liteflow upload URL',
  })

  const handleClick = async () => {
    await updateAccount({
      image: niftyProfileImage, // Profile image. Uploaded by user
      cover: niftyCoverImage, // Cover image. Uploaded by user
      name: 'WaadeC', // Display name
      description:
        "Hey, I'm a German guy creating NFTs while drinking beers 🍻", // Profile description
      email: 'waadec@email.com', // User email
      twitter: '@waadec', // User's Twitter account
      instagram: '@waadec', // User's Instagram account
      website: 'www.waadec.com', // User's Website
      username: 'waadec', // User's username
    })
  }

  return (
    <button onClick={handleClick} disabled={loading}>
      Update profile
    </button>
  )
}
```

## Configuration

```tsx
useUpdateAccount(
  signer: Signer | undefined, // Ethers signer: https://docs.ethers.io/v5/api/signer/
)
```

## Return values

```tsx
;[
  (input: AccountInput) => Promise<string>, // updateAccount. function to update the user's account
  {
    loading: boolean, // returns "true" if account is still being updated
  },
]
```

### updateAccount

Function to update the user's account

Arguments `AccountInput`:

```tsx
{
  image?: File | string, // Profile image
  cover?: File | string, // Cover image
  name?: string, // Display name
  description?: string,  // Profile description
  email?: string,  // User email
  twitter?: string,  // User's Twitter account
  instagram?: string,  // User's Instagram account
  website?: string,  // User's Website
  username?: string   // User's username
}
```

### loading

Returns `true` if the profile is being updated

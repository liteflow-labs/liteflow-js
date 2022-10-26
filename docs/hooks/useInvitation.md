# useInvitation

Hook to create and accept an invitation. This helps to create a referral system. A primary user can create an invitation ID while a secondary user can use that ID to accept the invitation.

## Usage

```tsx
import { useInvitation } from '@nft/hooks'
import React from 'react'

export default function Component() {
  const signer = undefined // type of "Signer & TypedDataSigner" Get the signer from the wallet. Need to be an Ethers Signer (https://docs.ethers.io/v5/api/signer/)
  const { create, accept, accepting, creating } = useInvitation(signer)

  const handleGetInvitation = async () => {
    const id = await create()
    alert(`Your invitation ID: ${id}`)
  }

  const handleAcceptInvitation = async () => {
    await accept('0a631dfb-b3f4-443e-8fb5-ddfd3e7f53f4')
    alert(`Invitation accepted`)
  }

  return (
    <div>
      {/* A primary user can create the invitation ID */}
      <button onClick={handleGetInvitation} disabled={creating}>
        Create invitation ID
      </button>

      {/* A secondary user can accept the invitation */}
      <button onClick={handleAcceptInvitation} disabled={accepting}>
        Accept Invitation
      </button>
    </div>
  )
}
```

## Configuration

```tsx
useInvitation(
  signer: Signer | undefined, // Ethers signer: https://docs.ethers.io/v5/api/signer/
)
```

## Return values

```tsx
{
  create: () => Promise<string>, // Function to create an invitationId. It returns the ID.
  accept: (invitationId: string) => Promise<string>, // Function to accept an invitation. Takes the invitation id as parameter and returns that ID.
  accepting: boolean, // Returns "true" while accepting the invitation.
  creating: boolean  // Returns "true" while creating the invitation ID.
}
```

### create

Function to create an invitation ID. It returns the ID.

### accept

Function to accept an invitation. It returns the ID. The creator of the ID cannot accept an invitation using and ID he created.

Arguments:

```tsx
invitationId: string
```

### creating

Returns `true` while accepting the invitation.

### accepting

Returns `true` while creating the invitation ID.

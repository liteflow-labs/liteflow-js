---
title: 'Installation'
---

# Chat widget

This [chat library](https://github.com/liteflow-labs/chat) aims to provide a component to be integrated into any DApp to let users chat with each other.
The chat is fully themeable, thanks to [ChakraUI](https://chakra-ui.com/).

## Installation

Install [@nft/chat](https://github.com/liteflow-labs/chat)

```bash
npm i @nft/chat
```

## `ChatProvider`

Wrap your app with the `ChatProvider` component, passing your `ethers` signer to it.

```tsx
import { ChatProvider } from '@nft/chat'

function App() {
  const signer = useSigner()
  return <ChatProvider signer={signer}>{children}</ChatProvider>
}
```

### Props

| name            | type                                                               | description                                                                                                             |
| --------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `signer`        | `Signer` (@ethersproject/abstract-signer)                          | An `ethers` signer representing the currently connected wallet                                                          |
| `lookupAddress` | `(address: string) => Promise<{ name?: string, avatar?: string }>` | **Optional**: Function to resolve an Ethereum address (think about ENS, Lens protocol...)                               |
| `onUserClick`   | `(address: string) => void`                                        | **Optional**: Function called every time an address/avatar is clicked within the chat                                   |
| `theme`         | `Dict` (@chakra-ui/utils)                                          | **Optional**: Theme to customize the look and feel of the chat https://chakra-ui.com/docs/styled-system/customize-theme |

## `Chat`

Now that your application is set up with the provider, you can place the chat component anywhere.
This component will have a dynamic size depending on the size of your container.

```tsx
import { Chat } from '@nft/chat'

function Page() {
  return <Chat />
}
```

### Props

| name        | type     | description                                       |
| ----------- | -------- | ------------------------------------------------- |
| `recipient` | `string` | **Optional**: Address of the recipient to chat to |

You're good to go! Enjoy chatting in web3.

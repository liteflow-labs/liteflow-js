---
title: 'LiteflowProvider'
---

# LiteflowProvider

To use the Liteflow SDK, your application needs to be wrapped with the `LiteflowProvider` so that it has access to the Liteflow API. You will need to pass that API key to the provider's `apiKey` property.

This API key can be found in your dashboard at https://dashboard.liteflow.com/developer/connection

```tsx
import { LiteflowProvider } from '@liteflow/react'

function App() {
  return (
    <LiteflowProvider apiKey="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX">
      <YourRoutes />
    </LiteflowProvider>
  )
}

export default App
```

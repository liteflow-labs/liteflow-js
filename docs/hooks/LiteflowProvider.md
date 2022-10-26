# LiteflowProvider

To use the Liteflow SDK, your application needs to be wrapped with the `LiteflowProvider` so that it has access to the Liteflow API. You will need to pass that API endpoint to the provider's `endpoint` property.

```tsx
import { LiteflowProvider } from '@nft/hooks'

function App() {
  return (
    <LiteflowProvider endpoint="https://api.acme.com/graphql">
      <YourRoutes />
    </LiteflowProvider>
  )
}

export default App
```

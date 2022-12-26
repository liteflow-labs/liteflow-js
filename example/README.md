# Liteflow SDK Minimal App

This is the Minimal App example on how to setup your project with Liteflow's [SDK](https://liteflow.gitbook.io/docs/). This implementation uses [Next.js](https://nextjs.org/) as well as third-party libraries like [Wagmi](https://wagmi.sh/) and [RainbowKit](https://www.rainbowkit.com/) for wallet interactions but feel free to implement in any project using [React](https://reactjs.org/) and your preferred web3 provider.

## Getting Started

First, you will need to get an [NPM Auth Token](https://docs.npmjs.com/using-private-packages-in-a-ci-cd-workflow#set-the-token-as-an-environment-variable-on-the-cicd-server) provided by the Liteflow team to authorize SDK's package installation. See our documentation about the [token installation](https://docs.liteflow.com/docs/#installation).

Once this is in place, you are now able to run:

```bash
npm install
```

Copy the `.env.example`, rename to `.env.local` and fill in the environment variables according to your setup.

```
# Replace with your app name
NEXT_PUBLIC_APP_NAME="Acme Marketplace"

# Replace with your API endpoint
NEXT_PUBLIC_ENDPOINT="https://api.acme.com/graphql"

# Replace with your desired chain supported by Wagmi (https://wagmi.sh/docs/providers/configuring-chains)
NEXT_PUBLIC_CHAIN_NAME="polygonMumbai"

# Replace with a valid Asset ID
NEXT_PUBLIC_ASSET_ID="80001-0xe3fe92dfe68f4b074ee7daca7c700e7a11a11397-60249402084987642306602912823737587855293854847399126862551129956955539542019"

# Replace by your chain's supported currency ID
NEXT_PUBLIC_CURRENCY_ID="80001-0x0fa8781a83bc094ea2a023e46826621b12e71b23"
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

If you want to learn more about Lifeflow's SDK make sure to visit our [documentation](https://liteflow.gitbook.io/docs/).

## Support

If you have any question or require support, feel free to [contact us](mailto:contact@liteflow.com).

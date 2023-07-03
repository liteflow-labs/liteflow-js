# Liteflow SDK Minimal App

This is the Minimal App example on how to setup your project with Liteflow's [SDK](https://docs.liteflow.com). This implementation uses [Next.js](https://nextjs.org/) as well as third-party libraries like [Wagmi](https://wagmi.sh/) for wallet interactions but feel free to implement in any project using [React](https://reactjs.org/) and your preferred web3 provider.

## Getting Started

```bash
npm install
```

Copy the `.env.example`, rename to `.env.local` and fill in the environment variables according to your setup.

```
# Replace with your API endpoint
NEXT_PUBLIC_LITEFLOW_API_KEY="00000000-0000-1000-8000-000000000000"

# Replace with a valid Asset ID
NEXT_PUBLIC_CHAIN="80001"
NEXT_PUBLIC_COLLECTION="0xe3fe92dfe68f4b074ee7daca7c700e7a11a11397"
NEXT_PUBLIC_TOKEN="60249402084987642306602912823737587855293854847399126862551129956955539542019"

# Replace by your chain's supported currency ID
NEXT_PUBLIC_CURRENCY="0x0fa8781a83bc094ea2a023e46826621b12e71b23"
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

If you want to learn more about Lifeflow's SDK make sure to visit our [documentation](https://docs.liteflow.com).

## Support

If you have any question or require support, feel free to [contact us](mailto:contact@liteflow.com).

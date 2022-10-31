import { AppProps } from 'next/app'
import 'nextra-theme-docs/style.css'

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return <Component {...pageProps} />
}

export default MyApp

import { Html, Head, Main, NextScript } from 'next/document'
import { ThemeScript } from 'next-use-theme'
import { config } from './_app';

export default function Document() {

  return (
    <Html>
      <Head >
          <ThemeScript {...config} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
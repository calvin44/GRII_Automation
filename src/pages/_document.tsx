import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/jpeg" href="/logo-grii-02.jpg" />
        <link rel="apple-touch-icon" href="/logo-grii-02.jpg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Pengurus Ibadah" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="description" content="Apps to remind penatalayan" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

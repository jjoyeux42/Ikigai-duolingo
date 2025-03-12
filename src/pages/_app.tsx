import { type AppType } from "next/dist/shared/lib/utils";
import Head from "next/head";

import "~/styles/globals.css";

// Ouvrez src/pages/_app.tsx et modifiez:
const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>IKIGAI - Votre Assistant</title>
        <meta
          name="description"
          content="Assistant personnel pour une meilleure qualité de vie"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#41D185" />
        <link rel="manifest" href="/app.webmanifest" />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;

import "../styles/globals.css";
import type { AppProps } from "next/app";

import LitProvider from "../components/LitContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LitProvider>
      <Component {...pageProps} />
    </LitProvider>
  );
}

export default MyApp;

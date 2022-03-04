/* eslint-disable react/jsx-props-no-spreading */
import "../styles/globals.css";
import React from "react";
import type { AppProps } from "next/app";
import { ThemeProvider, localStorage, ThemeConfig } from "next-use-theme";

export const config: ThemeConfig = {
  themes:["dark", "light", "tech"], storageHandlers:[localStorage()]
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider {...config}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
export default MyApp;

import React from "react";
import Head from "next/head";
import { useTheme } from  "next-use-theme";

// Note: This example isn't hydration safe and will cause a hydration mismatch error.
// To avoid this issue consider only rendering UI which uses the theme the client

export default function Home() {
  const { toggle, setTheme, theme } = useTheme();

  return (
    <div className="container">
      <Head>
        <title>Next Theme</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">
          Welcome to <span>Next Theme</span>
        </h1>

        <p className="description">
          This is just an example, checkout <code>app.js</code> to see how we
          implemented next-theme
        </p>

        <p className="theme">Current theme: {theme}</p>

        <button type="button" onClick={toggle}>
          Toggle theme
        </button>

        <div className="setters">
          <button type="button" onClick={() => setTheme("light")}>
            Light theme
          </button>
          <button type="button" onClick={() => setTheme("tech")}>
            Tech theme
          </button>
          <button type="button" onClick={() => setTheme("dark")}>
            Dark theme
          </button>
        </div>
      </main>

      <footer>
        <a href="https://github.com/AlfieJones/next-theme">
          Give us a star on GitHub
        </a>
      </footer>
    </div>
  );
}

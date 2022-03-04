<!-- PROJECT LOGO -->
<img width=100% src="https://raw.githubusercontent.com/AlfieJones/next-use-theme/main/banner.png" />
<div align="center">
    <img alt="NPM version" src="https://img.shields.io/npm/v/next-use-theme?style=for-the-badge">
</div>
<p align="center">
  <h1 align="center">Extremely lightweight, Highly customizable</h1>

  <p align="center">
    A NextJS wrapper component which provides a useTheme hook as well as dealing with theme changes and the dreaded flash of incorrect theme
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#Usage">Usage</a></li>
      </ul>
    </li>
    <li>
      <a href="#Api">API</a>
      <ul>
        <li><a href="#themeconfig">ThemeConfig</a></li>
      <li><a href="#usetheme">UseTheme</a></li>
      </ul>
    </li>
    <li><a href="#typescript">Typescript</a></li>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

Install the package as a dependency
  ```sh
  npm install next-use-theme
  ```
  or with yarn
  ```sh
  yarn add next-use-theme
  ```

### Usage
We need to wrap the component tree with our component and so it's recommend we do this in the _app file.
If you haven't already got one, create a custom [_app](https://nextjs.org/docs/advanced-features/custom-app) and wrap the Component with our ThemeProvider.

Since both the ThemeProvider and ThemeScript require the same props to function properly, it's recommended to store these in a global variable.

This example uses a config stored in [_app](https://nextjs.org/docs/advanced-features/custom-app) but it can also be placed into its own file.



```JS
// Example pages/_app.js
import { ThemeProvider } from "next-use-theme";

export const config = {
  themes: ["dark", "light", "tech"]
}

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider {...config}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
```

To avoid the FOIT (Flash of Incorrect Theme) we need to inject a script into the Head to run before React/Nextjs. We do this with a custom [_document](https://nextjs.org/docs/advanced-features/custom-document)


```JS
// Example pages/_document.js
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
```

Then we you can use our hook useTheme() to access and change the current theme

```JS
// Example hook usage
import { useTheme } from "next-theme";

function ThemeButtons() {
  const { setTheme, toggle, theme } = useTheme();
  return (
    <>
      <h1>Current theme: {theme}</h1>
      <button type="button" onClick={toggle}>
        Toggle theme
      </button>
      <button type="button" onClick={() => setTheme("light")}>
        Light theme
      </button>
      <button type="button" onClick={() => setTheme("dark")}>
        Dark theme
      </button>
    </>
  );
}
```

## API

### ThemeConfig
Themes are the props for both the ThemeProvider and ThemeScript.

<b>These are all optional</b>

<dl>

  <dt><code>themes</code>: string[]</dt>
  <dd>List of all available theme names, defaults to the two props [lightTheme, darkTheme], eg ["lightTheme", "darkTheme"]</dd>
  <dd>
    <b>Default:</b> [lightTheme, darkTheme, "system"]
  </dd>

  <dt><code>defaultTheme</code>: string</dt>
  <dd>Default theme, this must also exist in themes</dd>
  <dd>
    <b>Default:</b> "system"
  </dd>

  <dt><code>lightTheme</code>: string</dt>
  <dd>Light theme name</dd>
  <dd>
    <b>Default:</b> "light"
  </dd>

  <dt><code>darkTheme</code>: string</dt>
  <dd>Dark theme name</dd>
  <dd>
    <b>Default:</b> "dark"
  </dd>

  <dt><code>toggleThemes</code>: string[]</dt>
  <dd>Themes for the toggle to loop through</dd>
  <dd>
    <b>Default:</b> [lightTheme, darkTheme]
  </dd>

  <dt><code>attribute</code>: `data-${string}` | "class"</dt>
  <dd>The HTML attribute to be set</dd>
  <dd>
    <b>Default:</b> "class"
  </dd>

  <dt><code>mediaQuery</code>: boolean</dt>
  <dd>Use media query to toggle the theme between light and dark. If true and no storage handlers find a theme, next-theme falls back onto the media query</dd>
  <dd>
    <b>Default:</b> true
  </dd>

  <dt><code>colorScheme</code>: boolean</dt>
  <dd>Should we set the meta tag colorScheme, if default theme is dark we set it to dark light otherwise light dark</dd>
  <dd>
    <b>Default:</b> true
  </dd>

  <dt><code>onChange</code>: (theme: string, resolvedTheme: string) => void</dt>
  <dd>Handle the theme change yourself. Setting this disables next-theme from setting the attribute</dd>
  <dd>
    <b>Default:</b> undefined
  </dd>

  <dt><code>storageHandlers</code>: Handler[]</dt>
  <dd>The array of storage handlers. Used to customize where we get and store our theme information</dd>
  <dd>
    <b>Default:</b> [localStorage()]
  </dd>

  <dt><code>respectHandlerOrder</code>: boolean</dt>
  <dd>If true, when a handler changes we only use the value of the first handler to yield a valid theme. If false, we accept the new value if valid</dd>
  <dd>
    <b>Default:</b> false
  </dd>

</dl>

### UseTheme
Returns for the useTheme Hook

<dl>

  <dt><code>theme</code>: string</dt>
  <dd>The current theme set</dd>

  <dt><code>setTheme</code>: (theme: string) => void</dt>
  <dd>Change the current theme, only themes listed to the provider are accepted</dd>

  <dt><code>toggle</code>: () => void;</dt>
  <dd>Toggle the theme, this goes through the toggle themes listed to the provider</dd>

  <dt><code>resolvedTheme</code>: string</dt>
  <dd>Same as theme unless system theme is set, then shows 'system' while theme holds dark/light (set by provider)</dd>

</dl>


## TypeScript

This project is written in TypeScript and therefore fully supports it. 
 
## About The Project

I built this project to make theme handling much easier and hassle free. It's amazing how hard it is to handle theme changes so I hope this project makes your life easier

### Features:
* No horrible flash of incorrect theme (FOIT) 
* Easy to use hook and wrapper
* Highly customizable
* Lightweight

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

## License

Distributed under the MIT License. See `LICENSE` for more information.

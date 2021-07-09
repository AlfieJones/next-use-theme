<div align="center">
    <img alt="NPM version" src="https://img.shields.io/npm/v/next-theme?style=for-the-badge">
    <img alt="NPM downloads" src="https://img.shields.io/npm/dm/next-theme?style=for-the-badge">
    <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/alfieJones/next-theme?style=for-the-badge">
</div>

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <h1 align="center">Next Theme</h1>

  <p align="center">
    A NextJS wrapper component which provides a useTheme hook as well as dealing with theme changes and the dreaded Flash of incorrect theme
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
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

Install the package as a dependency
  ```sh
  npm install next-theme
  ```
  or with yarn
  ```sh
  yarn add next-theme
  ```

### Usage
We need to wrap the component tree with our component and so it's recommend we do this in the _app file.
If you haven't already got one, create a custom [_app](https://nextjs.org/docs/advanced-features/custom-app) and wrap the Component with our ThemeProvider.


```JS
// Example pages/_app.js
import { ThemeProvider } from "next-theme";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
```

Then we you can use our hook useTheme() to access and change the current theme

```JS
// Example hook usage
import { ThemeProvider } from "next-theme";
import useTheme from "next-theme";

function ThemeButtons() {
  const {setTheme, toggle, theme} = useTheme();
  return (
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
  );
}
```


 
## About The Project

I built this project to make theme handling much easier and hassell free. It's amazing how hard it is to handle theme changes so I hope this project makes your life easier

Features:
* No horrible flash of incorrect theme (FOIT) 
* Easy to use hook and wrapper
* Highly customisable
* Lightweight

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.
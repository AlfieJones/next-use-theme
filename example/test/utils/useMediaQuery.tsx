import { useState, useEffect } from "react";
import isBrowser from "./isBrowser";

const useDarkMediaQuery = () => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    let mql: MediaQueryList | undefined;

    if (isBrowser) mql = window.matchMedia("(prefers-color-scheme: dark)");

    if (mql) {
      setMatches(mql.matches);
      mql.addEventListener("change", () => setMatches(mql.matches));
    }

    return (
      mql && mql.removeEventListener("change", () => setMatches(mql.matches))
    );
  }, []);

  return matches;
};

export default useDarkMediaQuery;

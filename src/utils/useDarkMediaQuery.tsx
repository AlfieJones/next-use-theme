import { useState, useEffect } from "react";
import isBrowser from "./isBrowser";

const useDarkMediaQuery = () => {
  let mql: MediaQueryList | undefined;
  if (isBrowser) mql = window.matchMedia("(prefers-color-scheme: dark)");

  const [matches, setMatches] = useState(mql ? mql.matches : false);

  useEffect(() => {
    if (mql) {
      setMatches(mql.matches);
      mql.addEventListener("change", () => setMatches(mql.matches));
    }

    return (
      mql && mql.removeEventListener("change", () => setMatches(mql.matches))
    );
  }, [mql]);

  return matches;
};

export default useDarkMediaQuery;

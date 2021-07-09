import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import { babel } from "@rollup/plugin-babel";
import { DEFAULT_EXTENSIONS } from "@babel/core";
import { terser } from "rollup-plugin-terser";

import pkg from "./package.json";

const globals = {
  ...pkg.devDependencies,
};

export default {
  input: pkg.source,
  output: [
    {
      file: pkg.main,
      format: "cjs",
      exports: "named",
      sourcemap: false,
    },
    {
      file: pkg.module,
      format: "esm",
      sourcemap: false,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    typescript(),
    commonjs(),
    babel({
      extensions: [...DEFAULT_EXTENSIONS, ".ts", ".tsx"],
    }),
    terser()
  ],
  external: Object.keys(globals),
};

import { DetailedHTMLProps, ScriptHTMLAttributes } from "react";
import { ProviderProps } from "../provider";

export type UseScriptType = (
  config: ProviderProps
) => DetailedHTMLProps<
  ScriptHTMLAttributes<HTMLScriptElement>,
  HTMLScriptElement
>;

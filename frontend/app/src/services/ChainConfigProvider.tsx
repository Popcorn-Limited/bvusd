"use client";

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
  } from "react";
import { CHAINS } from "../config/chains";
import * as v from "valibot";

// TODO all contracts schema
export const ChainSchema = v.object({
  CONTRACTS: v.object({
    VAULT: v.string(),
  }),
});

export type ChainEnv = v.InferOutput<typeof ChainSchema>;

// parse a chainID into the ChainSchema obj
function parseChain(id: number): ChainEnv {
  const raw = CHAINS[id];
  const parsed = v.safeParse(ChainSchema, raw);
  if (!parsed.success) {
    const detail = v.flatten(parsed.issues).nested;
    throw new Error(`Invalid config for chain ${id}: ${JSON.stringify(detail)}`);
  }
  return parsed.output;
}

type Ctx = { config: ChainEnv; setChainId: (id: number) => void };
const ChainConfigContext = createContext<Ctx | null>(null);
const DEFAULT_CHAIN_ID = 747474;

// Chain Configuration Context Component
export function ChainConfigProvider({
  children,
  initialChainId,
}: {
  children: ReactNode;
  initialChainId?: number;
}) {
  const [config, setConfig] = useState<ChainEnv>(() => {
    try {
      return parseChain(initialChainId ?? DEFAULT_CHAIN_ID);
    } catch {
      const first = Number(Object.keys(CHAINS)[0]);
      return parseChain(first);
    }
  });

  const setChainId = useCallback((id: number) => {
    const raw = CHAINS[id];
    if (!raw) { 
      console.warn("Unknown chainId", id);
      // TODO unsupported chain
      return;
    }
    const parsed = v.safeParse(ChainSchema, raw);
    if (!parsed.success) {
      console.error("Invalid CHAINS entry", id, v.flatten(parsed.issues).nested);
      return;
    }
    setConfig(parsed.output);
  }, []);

  const value = useMemo(() => ({ config, setChainId }), [config, setChainId]);
  return <ChainConfigContext.Provider value={value}>{children}</ChainConfigContext.Provider>;
}

export function useChainConfig() {
  const ctx = useContext(ChainConfigContext);
  if (!ctx) throw new Error("No ChainConfigProvider");
  return ctx;
}
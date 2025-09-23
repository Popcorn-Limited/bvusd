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
import { vAddress } from "@/src/valibot-utils";

// TODO all contracts schema
export const ChainSchema = v.object({
  CHAIN_ID: v.number(),
  CHAIN_CURRENCY: v.object({
    name: v.string(),
    symbol: v.string(),
    decimals: v.number()
  }),
  CHAIN_NAME: v.string(),
  CHAIN_RPC_URL: v.string(),
  CHAIN_BLOCK_EXPLORER: v.string(),
  CHAIN_CONTRACT_ENS_REGISTRY: v.optional(v.string()),
  CHAIN_CONTRACT_ENS_RESOLVER: v.optional(v.string()),
  CHAIN_CONTRACT_MULTICALL: v.optional(vAddress()),
  CONTRACT_VAULT: vAddress(),
  ENSO_ROUTER: v.optional(vAddress()),
  CONTRACT_BOLD_TOKEN: vAddress(),
  STATS_URL: v.optional(v.string()),
  CONTRACT_CONVERTER: v.optional(vAddress()),
  CONTRACT_USDC: vAddress(),
  CONTRACT_USDT: vAddress(),
  CONTRACT_WETH: vAddress()
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
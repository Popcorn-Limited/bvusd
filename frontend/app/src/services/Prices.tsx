"use client";

import type { CollateralSymbol, TokenSymbol } from "@/src/types";
import type { UseQueryResult } from "@tanstack/react-query";
import type { Dnum } from "dnum";

import { PRICE_REFRESH_INTERVAL } from "@/src/constants";
import { getBranchContract } from "@/src/contracts";
import { dnum18 } from "@/src/dnum-utils";
import { isCollateralSymbol } from "@liquity2/uikit";
import { useQuery } from "@tanstack/react-query";
import * as dn from "dnum";
import * as v from "valibot";
import { useReadContract } from "wagmi";
import { useChainConfig } from "./ChainConfigProvider";
import { getCoingeckoPrice, getDefiLlamaPrices } from "../actions";

type PriceToken = "bvUSD" | "BOLD" | CollateralSymbol | "sbvUSD" | "VCRAFT" | "WBTC" | "USDT";

function useCollateralPrice(
  symbol: null | CollateralSymbol
): UseQueryResult<Dnum> {
  const { chainConfig } = useChainConfig();

  // "ETH" is a fallback when null is passed, so we can return a standard
  // query object from the PriceFeed ABI, while the query stays disabled
  const PriceFeed = getBranchContract(chainConfig, symbol ?? "BVBTC", "PriceFeed");

  if (!PriceFeed) {
    throw new Error(`Price feed contract not found for ${symbol}`);
  }
  
  // TODO: fix this
  // @ts-ignore
  return useReadContract({
    ...PriceFeed,
    // TODO: fix this
    // @ts-ignore
    functionName: "fetchPrice",
    allowFailure: false,
    query: {
      enabled: symbol !== null,
      refetchInterval: PRICE_REFRESH_INTERVAL,
      select: (price) => dnum18(price),
    },
  });
}

type CoinGeckoSymbol = TokenSymbol & ("BVBTC");
const coinGeckoTokenIds: {
  [key in CoinGeckoSymbol]: string;
} = {
  BVBTC: "bitcoin"
};

function useCoinGeckoPrice(
  supportedSymbol: null | CoinGeckoSymbol
): UseQueryResult<Dnum> {
  return useQuery({
    queryKey: ["coinGeckoPrice", ...Object.keys(coinGeckoTokenIds)],
    queryFn: async () => {
      if (supportedSymbol === null) {
        throw new Error("Unsupported symbol");
      }

      const result = await getCoingeckoPrice(coinGeckoTokenIds);

      const prices = {} as { [key in CoinGeckoSymbol]: Dnum | null };

      for (const key of Object.keys(coinGeckoTokenIds) as CoinGeckoSymbol[]) {
        const value = result[coinGeckoTokenIds[key]];
        if (value) {
          prices[key] = value.usd ? dn.from(value.usd, 18) : null;
        }
      }

      return prices;
    },
    select: (data) => {
      if (supportedSymbol === null || !data[supportedSymbol]) {
        throw new Error("Unsupported symbol");
      }
      return data[supportedSymbol];
    },
    enabled: supportedSymbol !== null,
    refetchInterval: PRICE_REFRESH_INTERVAL,
  });
}

const defiLlamaTokenIds: {
  [key in CoinGeckoSymbol]: string;
} = {
  BVBTC: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
};

function useDefiLlamaPrice(
  supportedSymbol: null | CoinGeckoSymbol
): UseQueryResult<Dnum> {
  return useQuery({
    queryKey: ["defiLlamaPrice", ...Object.keys(defiLlamaTokenIds)],
    queryFn: async () => {
      if (supportedSymbol === null) {
        throw new Error("Unsupported symbol");
      }

      const result = await getDefiLlamaPrices(defiLlamaTokenIds);

      const prices = {} as { [key in CoinGeckoSymbol]: Dnum | null };
      
      for (const key of Object.keys(defiLlamaTokenIds) as CoinGeckoSymbol[]) {
        const value = result.coins[`ethereum:${defiLlamaTokenIds[key]}`].price;
        if (value) {
          prices[key] = value? dn.from(value, 18) : null;
        }
      }

      return prices;
    },
    select: (data) => {
      if (supportedSymbol === null || !data[supportedSymbol]) {
        throw new Error("Unsupported symbol");
      }
      return data[supportedSymbol];
    },
    enabled: supportedSymbol !== null,
    refetchInterval: PRICE_REFRESH_INTERVAL,
  });
}

export function usePrice<PT extends PriceToken>(
  symbol: PT | null
): UseQueryResult<Dnum> { 
  const fromCoinGecko = symbol === "BVBTC";
  const fromPriceFeed =
    !fromCoinGecko && symbol !== null && isCollateralSymbol(symbol);

  const collPrice = useCollateralPrice(fromPriceFeed ? symbol : null);
  //const coinGeckoPrice = useCoinGeckoPrice(fromCoinGecko ? symbol : null);
  const defiLlamaPrice = useDefiLlamaPrice(fromCoinGecko ? symbol : null);
  const bvusdPrice = useQuery({
    queryKey: ["bvusdPrice"],
    queryFn: () => dn.from(1, 18),
    enabled: symbol === "bvUSD",
  });
  const vcraftPrice = useQuery({
    queryKey: ["vcraftPrice"],
    queryFn: () => dn.from(0.02, 18),
    enabled: symbol === "VCRAFT",
  });

  // could be any of the three, we just need
  // to return a disabled query result object
  if (symbol === null) {
    return bvusdPrice;
  }

  if (fromCoinGecko) {
    return defiLlamaPrice;
  }

  if (fromPriceFeed) {
    return collPrice;
  }

  if (symbol === "bvUSD" || symbol === "sbvUSD") {
    return bvusdPrice;
  }

  if (symbol === "VCRAFT") {
    return vcraftPrice;
  }

  throw new Error(`Unsupported token: ${symbol}`);
}

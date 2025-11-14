import type { Token } from "./types";

import bvusd from "./token-icons/bvusd.svg";
import sbvusd from "./token-icons/sbvusd.svg";
import vcraft from "./token-icons/vcraft.svg";
import eth from "./token-icons/eth.svg";
import btcb from "./token-icons/btcb.svg";
import usdt from "./token-icons/usdt.svg";
import usdc from "./token-icons/usdc.svg";
import bgbtc from "./token-icons/bitgetbtc.svg";
import enzobtc from "./token-icons/enzoBTC.svg";

export type CollateralSymbol = "BVBTC";

export function isCollateralSymbol(symbol: string): symbol is CollateralSymbol {
  return symbol === "BVBTC";
}

export type CollateralToken = Token & {
  collateralRatio: number;
  symbol: CollateralSymbol;
};

export const bvUSD: Token = {
  icon: bvusd,
  name: "bvUSD",
  symbol: "bvUSD" as const,
} as const;

export const LbvUSD: Token = {
  icon: bvusd,
  name: "LbvUSD",
  symbol: "LbvUSD" as const,
} as const;

export const sbvUSD: Token = {
  icon: sbvusd,
  name: "sbvUSD",
  symbol: "sbvUSD" as const,
} as const;

export const VCRAFT: Token = {
  icon: vcraft,
  name: "VCRAFT",
  symbol: "VCRAFT" as const,
} as const;

export const WETH: Token = {
  icon: eth,
  name: "WETH",
  symbol: "WETH" as const,
} as const;

export const BVBTC: CollateralToken = {
  collateralRatio: 1.2,
  icon: btcb,
  name: "BVBTC",
  symbol: "BVBTC" as const,
} as const;

export const WBTC: Token = {
  icon: btcb,
  name: "WBTC",
  symbol: "WBTC" as const,
} as const;

export const USDT: Token = {
  icon: usdt,
  name: "USDT",
  symbol: "USDT" as const,
} as const;

export const USDC: Token = {
  icon: usdc,
  name: "USDC",
  symbol: "USDC" as const,
} as const;

export const bgBTC: Token = {
  icon: bgbtc,
  name: "bgBTC",
  symbol: "bgBTC" as const,
} as const;

export const sbgBTC: Token = {
  icon: bgbtc,
  name: "sbgBTC",
  symbol: "sbgBTC" as const,
} as const;

export const nBTC: Token = {
  icon: btcb,
  name: "nBTC",
  symbol: "nBTC" as const,
} as const;

export const snBTC: Token = {
  icon: btcb,
  name: "snBTC",
  symbol: "snBTC" as const,
} as const;

export const sWETH: Token = {
  icon: eth,
  name: "sWETH",
  symbol: "sWETH" as const,
} as const;

export const enzoBTC: Token = {
  icon: enzobtc,
  name: "enzoBTC",
  symbol: "enzoBTC" as const,
} as const;

export const sEnzoBTC: Token = {
  icon: enzobtc,
  name: "sEnzoBTC",
  symbol: "sEnzoBTC" as const,
} as const;


export const COLLATERALS: CollateralToken[] = [
  BVBTC
];

export const TOKENS_BY_SYMBOL = {
  bvUSD,
  WETH,
  BVBTC,
  VCRAFT,
  sbvUSD,
  WBTC,
  USDT,
  USDC,
  LbvUSD,
  bgBTC,
  sbgBTC,
  nBTC,
  snBTC,
  sWETH,
  enzoBTC,
  sEnzoBTC
} as const;

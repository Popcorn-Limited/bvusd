export type Address = `0x${string}`;

export type Direction = -1 | 1;

export type TokenSymbol =
  | "bvUSD"
  | "WETH"
  | "BVBTC"
  | "VCRAFT"
  | "sbvUSD"
  | "WBTC"
  | "USDT"
  | "USDC"
  | "LbvUSD"
  | "bgBTC"
  | "sbgBTC"
  | "nBTC"
  | "snBTC"
  | "sWETH"
  | "enzoBTC"
  | "sEnzoBTC"
  | "sWBTC"
  
export type Token = {
  icon: string;
  name: string;
  symbol: TokenSymbol;
};

export type StatusMode = "positive" | "warning" | "negative" | "neutral";

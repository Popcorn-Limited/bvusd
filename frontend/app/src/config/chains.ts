import eth from "../../../uikit/src/token-icons/eth.svg";
import katana from "../../../uikit/src/token-icons/katana.svg";

type ChainIcons = {
  [name: string]: any;
};

export const supportedChainIcons: ChainIcons = {
  "katana": katana,
  "ethereum": eth
}

export type AppChainConfig = {
  CHAIN_ID: number;
  CHAIN_NAME: string;
  CHAIN_CURRENCY: { name: string; symbol: string; decimals: number };
  CHAIN_BLOCK_EXPLORER?: string;
  CHAIN_CONTRACT_ENS_REGISTRY?: `0x${string}`;
  CHAIN_CONTRACT_ENS_RESOLVER?: `0x${string}`;
  CHAIN_CONTRACT_MULTICALL?: `0x${string}`;
  CONTRACT_VAULT: `0x${string}`;
  ENSO_ROUTER?: `0x${string}`;
  CONTRACT_BOLD_TOKEN: `0x${string}`;
  STATS_URL?: string;
  CONTRACT_CONVERTER?: `0x${string}`;
  CONTRACT_USDC: `0x${string}`;
  CONTRACT_USDT: `0x${string}`;
  CONTRACT_WETH: `0x${string}`;
  CONTRACT_WHITELIST: `0x${string}`;
  // ...all env contracts
};

export const CHAINS: Record<number, AppChainConfig> = {
  747474: {
    CHAIN_ID: 747474,
    CHAIN_CURRENCY: { name: "Ethereum", symbol: "ETH", decimals: 18 },
    CHAIN_NAME: "Katana",
    CHAIN_BLOCK_EXPLORER: "https://explorer.katanarpc.com/",
    CHAIN_CONTRACT_MULTICALL: "0xcA11bde05977b3631167028862bE2a173976CA11",
    CONTRACT_VAULT: "0x9d3575469d9df8b5d2f4d7703f682221c044397d",
    ENSO_ROUTER: "0x3067BDBa0e6628497d527bEF511c22DA8b32cA3F",
    CONTRACT_BOLD_TOKEN: "0x876aac7648D79f87245E73316eB2D100e75F3Df1",
    STATS_URL: "https://raw.githubusercontent.com/Popcorn-Limited/bvusd/main/docs/katana.json",
    CONTRACT_CONVERTER: "0x2e9fD409760D17b1ed277e000374698d531d19CE",
    CONTRACT_USDC: "0x203A662b0BD271A6ed5a60EdFbd04bFce608FD36",
    CONTRACT_USDT: "0x2DCa96907fde857dd3D816880A0df407eeB2D2F2",
    CONTRACT_WETH: "0xEE7D8BCFb72bC1880D0Cf19822eB0A2e6577aB62",
    CONTRACT_WHITELIST: "0x83BBAA022Cca1295a975EC101a073C44Ea336f79",
  },
  1: { // TODO remove
    CHAIN_ID: 1,
    CHAIN_NAME: "Ethereum",
    CHAIN_CURRENCY: { name: "Ethereum", symbol: "ETH", decimals: 18 },
    CHAIN_BLOCK_EXPLORER: "https://etherscan.io/",
    CHAIN_CONTRACT_MULTICALL: "0xcA11bde05977b3631167028862bE2a173976CA11",
    CONTRACT_VAULT: "0xcF9273BA04b875F94E4A9D8914bbD6b3C1f08EDb",
    CONTRACT_BOLD_TOKEN: "0x9bc2f611fa2196e097496b722f1cbcdfe2303855",
    CONTRACT_USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    CONTRACT_USDT: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    CONTRACT_WETH: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    CONTRACT_WHITELIST: "0x83BBAA022Cca1295a975EC101a073C44Ea336f79",
  },
};

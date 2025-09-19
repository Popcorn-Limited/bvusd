import { ALCHEMY_API_KEY } from "../env";

export type AppChainConfig = {
  CHAIN_ID: number;
  CHAIN_NAME: string;
  CHAIN_CURRENCY: { name: string; symbol: string; decimals: number };
  CHAIN_RPC_URL: string;
  CHAIN_BLOCK_EXPLORER?: string | null;
  CHAIN_CONTRACT_ENS_REGISTRY?: `0x${string}` | null;
  CHAIN_CONTRACT_ENS_RESOLVER?: `0x${string}` | null;
  CHAIN_CONTRACT_MULTICALL?: `0x${string}` | null;
  CONTRACT_VAULT: `0x${string}`;
  ENSO_ROUTER: `0x${string}` | null;
  // ...all env contracts
  // any other env field
};

// TODO Schema and data
export const CHAINS: Record<number, AppChainConfig> = {
  747474: {
    CHAIN_ID: 747474,
    CHAIN_CURRENCY: { name: "Ethereum", symbol: "ETH", decimals: 18 },
    CHAIN_NAME: "Katana",
    CHAIN_RPC_URL: "https://rpc.katana.network",
    CHAIN_BLOCK_EXPLORER: "https://explorer.katanarpc.com/",
    CHAIN_CONTRACT_ENS_REGISTRY: null,
    CHAIN_CONTRACT_ENS_RESOLVER: null,
    CHAIN_CONTRACT_MULTICALL: "0xcA11bde05977b3631167028862bE2a173976CA11",
    CONTRACT_VAULT: "0x24E2aE2f4c59b8b7a03772142d439fDF13AAF15b",
    ENSO_ROUTER: "0x3067BDBa0e6628497d527bEF511c22DA8b32cA3F",
  },
  1: {
    CHAIN_ID: 1,
    CHAIN_NAME: "Ethereum",
    CHAIN_CURRENCY: { name: "Ethereum", symbol: "ETH", decimals: 18 },
    CHAIN_RPC_URL: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
    CHAIN_BLOCK_EXPLORER: "https://etherscan.io/",
    CHAIN_CONTRACT_ENS_REGISTRY: null,
    CHAIN_CONTRACT_ENS_RESOLVER: null,
    CHAIN_CONTRACT_MULTICALL: "0xcA11bde05977b3631167028862bE2a173976CA11",
    CONTRACT_VAULT: "0x06C0c876419a76E89AD55D1225bB335939C25150",
    ENSO_ROUTER: null
  },
};

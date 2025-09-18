export type AppChainConfig = {
    CHAIN_ID: number;
    CHAIN_NAME: string;
    CHAIN_CURRENCY: { name: string; symbol: string; decimals: number };
    CHAIN_RPC_URL: string;
    CHAIN_BLOCK_EXPLORER?: string | null;
    CHAIN_CONTRACT_ENS_REGISTRY?: `0x${string}` | null;
    CHAIN_CONTRACT_ENS_RESOLVER?: `0x${string}` | null;
    CHAIN_CONTRACT_MULTICALL?: `0x${string}` | null;
    CONTRACTS: {
      VAULT: `0x${string}`
      // ...all env contracts
    }
    // any other env field
  }
  
  // TODO Schema and data
  export const CHAINS: Record<number, AppChainConfig> = {
    747474: {
    CHAIN_ID: 747474,
      CHAIN_CURRENCY: {name: "Ethereum", symbol: "ETH", decimals: 18},
      CHAIN_NAME: "Katana",
      CHAIN_RPC_URL: "https://rpc.katana.network",
      CHAIN_BLOCK_EXPLORER: "https://explorer.katanarpc.com/",
      CHAIN_CONTRACT_ENS_REGISTRY: null,
      CHAIN_CONTRACT_ENS_RESOLVER: null,
      CHAIN_CONTRACT_MULTICALL: "0xcA11bde05977b3631167028862bE2a173976CA11",
      CONTRACTS: {
        VAULT: "0x24E2aE2f4c59b8b7a03772142d439fDF13AAF15b",
      },
    },
    1: {
        CHAIN_ID: 1,
        CHAIN_NAME: "Ethereum",
        CHAIN_CURRENCY: {name: "Ethereum", symbol: "ETH", decimals: 18},
        CHAIN_RPC_URL: "https://rpc.katana.network",
        CHAIN_BLOCK_EXPLORER: "https://explorer.katanarpc.com/",
        CHAIN_CONTRACT_ENS_REGISTRY: null,
        CHAIN_CONTRACT_ENS_RESOLVER: null,
        CHAIN_CONTRACT_MULTICALL: "0xcA11bde05977b3631167028862bE2a173976CA11",
      CONTRACTS: {
        VAULT: "0x06C0c876419a76E89AD55D1225bB335939C25150",
      },
    },
  }


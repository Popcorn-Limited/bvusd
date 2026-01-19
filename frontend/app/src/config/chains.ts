import { Address } from "viem";
import eth from "../../../uikit/src/token-icons/eth2.svg";
import katana from "../../../uikit/src/token-icons/katana.svg";
import hemi from "../../../uikit/src/token-icons/hemi.svg";

type ChainIcons = {
  [name: string]: any;
};

export const supportedChainIcons: ChainIcons = {
  katana: katana,
  ethereum: eth,
  hemi,
};

export type Vault = {
  outputSymbol: string;
  name: string;
  asset: `0x${string}`;
  address: `0x${string}`;
  inputDecimals: number;
};

type Token = {
  address: Address;
  decimals: number;
};

type VaultMap = { [symbol: string]: Vault };

type TokenMap = { [symbol: string]: Token };

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
  CONTRACT_WHITELIST: `0x${string}`;
  VAULTS: VaultMap;
  TOKENS: TokenMap;
  // ...all env contracts
};

export const CHAINS: Record<number, AppChainConfig> = {
  1: {
    CHAIN_ID: 1,
    CHAIN_NAME: "Ethereum",
    CHAIN_CURRENCY: { name: "Ethereum", symbol: "ETH", decimals: 18 },
    CHAIN_BLOCK_EXPLORER: "https://etherscan.io/",
    CHAIN_CONTRACT_MULTICALL: "0xcA11bde05977b3631167028862bE2a173976CA11",
    CONTRACT_VAULT: "0xe66f1abc862f2730d5cdc3c780da2052c7aa4cbd",
    CONTRACT_BOLD_TOKEN: "0x9bc2f611fa2196e097496b722f1cbcdfe2303855",
    STATS_URL:
      "https://raw.githubusercontent.com/Popcorn-Limited/bvusd/main/docs/katana.json",
    CONTRACT_WHITELIST: "0x788DbB1888a50e97837b9D06Fd70db107b082A12",
    CONTRACT_CONVERTER: "0x0dd50a98654ADdEB48287C7e8301C6640d050649",
    ENSO_ROUTER: "0xF75584eF6673aD213a685a1B58Cc0330B8eA22Cf",
    VAULTS: {
      bgBTC: {
        name: "Bitget BTC Vault",
        outputSymbol: "sbgBTC",
        asset: "0x0520930F21b14Cafac7a27b102487beE7138a017",
        address: "0x54C5515133Dd9Ced5c8F0bff834A2C004D9B7CCc",
        inputDecimals: 8,
      },
      enzoBTC: {
        name: "Enzo BTC Vault",
        outputSymbol: "sEnzoBTC",
        asset: "0x6A9A65B84843F5fD4aC9a0471C4fc11AFfFBce4a",
        address: "0xdB06a9D79f5Ff660f611234c963c255E03Cb5554",
        inputDecimals: 8,
      },
      WBTC: {
        name: "Bluechip Bitcoin Vault",
        outputSymbol: "sWBTC",
        asset: "0x0555E30da8f98308EdB960aa94C0Db47230d2B9c",
        address: "0xdb435E82b853c85dfbEc81dc1120558E77632A2a",
        inputDecimals: 8,
      }
    },
    TOKENS: {
      bgBTC: {
        address: "0x0520930F21b14Cafac7a27b102487beE7138a017",
        decimals: 8,
      },
      sbgBTC: {
        address: "0x54C5515133Dd9Ced5c8F0bff834A2C004D9B7CCc",
        decimals: 8,
      },
      enzoBTC: {
        address: "0x6A9A65B84843F5fD4aC9a0471C4fc11AFfFBce4a",
        decimals: 8,
      },
      sEnzoBTC: {
        address: "0xdB06a9D79f5Ff660f611234c963c255E03Cb5554",
        decimals: 8,
      },
      WBTC: {
        address: "0x0555E30da8f98308EdB960aa94C0Db47230d2B9c",
        decimals: 8,
      },
      USDC: {
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        decimals: 6,
      },
      USDT: {
        address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
        decimals: 6,
      },
    },
  },
  747474: {
    CHAIN_ID: 747474,
    CHAIN_CURRENCY: { name: "Ethereum", symbol: "ETH", decimals: 18 },
    CHAIN_NAME: "Katana",
    CHAIN_BLOCK_EXPLORER: "https://explorer.katanarpc.com/",
    CHAIN_CONTRACT_MULTICALL: "0xcA11bde05977b3631167028862bE2a173976CA11",
    CONTRACT_VAULT: "0x9d3575469d9df8b5d2f4d7703f682221c044397d",
    ENSO_ROUTER: "0x3067BDBa0e6628497d527bEF511c22DA8b32cA3F",
    CONTRACT_BOLD_TOKEN: "0x876aac7648D79f87245E73316eB2D100e75F3Df1",
    STATS_URL:
      "https://raw.githubusercontent.com/Popcorn-Limited/bvusd/main/docs/katana.json",
    CONTRACT_CONVERTER: "0x2e9fD409760D17b1ed277e000374698d531d19CE",
    CONTRACT_WHITELIST: "0x83BBAA022Cca1295a975EC101a073C44Ea336f79",
    VAULTS: {},
    TOKENS: {
      USDC: {
        address: "0x203A662b0BD271A6ed5a60EdFbd04bFce608FD36",
        decimals: 6,
      },
      USDT: {
        address: "0x2DCa96907fde857dd3D816880A0df407eeB2D2F2",
        decimals: 6,
      },
      WETH: {
        address: "0xEE7D8BCFb72bC1880D0Cf19822eB0A2e6577aB62",
        decimals: 18,
      },
    },
  },
  43111: {
    CHAIN_ID: 43111,
    CHAIN_CURRENCY: { name: "Ethereum", symbol: "ETH", decimals: 18 },
    CHAIN_NAME: "Hemi",
    CHAIN_BLOCK_EXPLORER: "https://explorer.katanarpc.com/",
    CHAIN_CONTRACT_MULTICALL: "0xcA11bde05977b3631167028862bE2a173976CA11",
    CONTRACT_VAULT: "0x9d3575469d9df8b5d2f4d7703f682221c044397d",
    CONTRACT_BOLD_TOKEN: "0x876aac7648D79f87245E73316eB2D100e75F3Df1",
    STATS_URL:
      "https://raw.githubusercontent.com/Popcorn-Limited/bvusd/main/docs/katana.json",
    CONTRACT_CONVERTER: "0x2e9fD409760D17b1ed277e000374698d531d19CE",
    CONTRACT_WHITELIST: "0x83BBAA022Cca1295a975EC101a073C44Ea336f79",
    VAULTS: {
      bgBTC: {
        name: "Bitget BTC Vault",
        outputSymbol: "sbgBTC",
        asset: "0x5B6d6D09F425da2a816D1cDBabd049449Ae8d8e6",
        address: "0x0b8E088a35879f30a4d63F686B10adAD9cB3DBE1",
        inputDecimals: 8,
      },
      nBTC: {
        name: "Matrixport BTC Vault",
        outputSymbol: "snBTC",
        asset: "0xC93B7aae2802f57eb9D98E2B6a68217d75a0658c",
        address: "0x748973D83d499019840880f61B32F1f83B46f1A5",
        inputDecimals: 8,
      },
    },
    TOKENS: {
      nBTC: {
        address: "0xC93B7aae2802f57eb9D98E2B6a68217d75a0658c",
        decimals: 8,
      },
      snBTC: {
        address: "0x748973D83d499019840880f61B32F1f83B46f1A5",
        decimals: 8,
      },
      bgBTC: {
        address: "0x5B6d6D09F425da2a816D1cDBabd049449Ae8d8e6",
        decimals: 8,
      },
      sbgBTC: {
        address: "0x0b8E088a35879f30a4d63F686B10adAD9cB3DBE1",
        decimals: 8,
      },
      USDC: {
        address: "0xad11a8BEb98bbf61dbb1aa0F6d6F2ECD87b35afA",
        decimals: 6,
      },
      USDT: {
        address: "0xbB0D083fb1be0A9f6157ec484b6C79E0A4e31C2e",
        decimals: 6,
      },
      WETH: {
        address: "0xEE7D8BCFb72bC1880D0Cf19822eB0A2e6577aB62",
        decimals: 18,
      },
    },
  },
};

export function getAllVaults() {
  let vaultAssets = [];

  const vaults = Object.values(CHAINS).reduce(
    (acc, chain) => {
      for (const [key, v] of Object.entries(chain.VAULTS)) {
        if (!vaultAssets.includes(key)) vaultAssets.push(key);

        acc[`${key}-${chain.CHAIN_ID}`] = {
          chainId: chain.CHAIN_ID,
          chainName: chain.CHAIN_NAME,
          ...v,
        };
      }
      return acc;
    },
    {} as Record<string, { chainId: number; chainName: string } & Vault>
  );

  const vaultsArray = Object.entries(vaults);

  return { vaults, vaultAssets, vaultsArray };
}

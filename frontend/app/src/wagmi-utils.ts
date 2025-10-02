import content from "@/src/content";
import { dnum18, dnum6, dnum8 } from "@/src/dnum-utils";
import { WALLET_CONNECT_PROJECT_ID } from "@/src/env";
import { getBranch } from "@/src/liquity-utils";
import { getSafeStatus } from "@/src/safe-utils";
import type { Token } from "@/src/types";
import type { Address } from "@liquity2/uikit";
import { useQuery } from "@tanstack/react-query";
import { getDefaultConfig as getDefaultConfigFromConnectKit, useModal as useConnectKitModal } from "connectkit";
import { useEffect, useRef } from "react";
import { match } from "ts-pattern";
import { erc20Abi } from "viem";
import type { Chain } from "viem/chains";
import { createConfig, http, useAccount as useWagmiAccount, useEnsName, useReadContract, useSwitchChain, createStorage, cookieStorage } from "wagmi";
import { CHAINS } from "./config/chains";
import { CONTRACT_TOKEN_LOCKER } from "./env";
import { useChainConfig } from "./services/ChainConfigProvider";

export function useBalance(
  address: Address | undefined,
  token: Token["symbol"] | undefined,
) {
  const { chainConfig } = useChainConfig();

  const tokenAddress = match(token)
    .when(
      (symbol) => Boolean(symbol),
      (symbol) => {
        if (!symbol) {
          return null;
        }
        if (symbol === "bvUSD") {
          return chainConfig.CONTRACT_BOLD_TOKEN;
        }
        if (symbol === "sbvUSD") {
          return chainConfig.CONTRACT_VAULT;
        }
        if (symbol === "VCRAFT") {
          return "0xc6675024FD3A9D37EDF3fE421bbE8ec994D9c262";
        }
        if (symbol === "WBTC") {
          return "0x0555E30da8f98308EdB960aa94C0Db47230d2B9c";
        }
        if (symbol === "USDT") {
          return chainConfig.CONTRACT_USDT;
        }
        if (symbol === "USDC") {
          return chainConfig.CONTRACT_USDC;
        }
        if (symbol === "LbvUSD") {
          return CONTRACT_TOKEN_LOCKER;
        } else {
          // @ts-ignore
          return getBranch(symbol)?.contracts.CollToken.address ?? null;
        }
      },
    )
    .otherwise(() => null);

  // TODO -- find a better solution to parse the balance based on the token decimals
  const tokenBalance = useReadContract({
    address: tokenAddress ?? undefined,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address && [address],
    query: {
      select: (value) => ["USDC", "USDT"].includes(token) ? dnum6(value ?? 0n) : dnum18(value ?? 0n),
      enabled: Boolean(address),
    },
  });

  // const ethBalance = useWagmiBalance({
  //   address,
  //   query: {
  //     select: ({ value }) => dnum18(value ?? 0n),
  //     enabled: Boolean(address && token === "ETH"),
  //   },
  // });

  return tokenBalance;
}

export function useEnforceChain(targetChainId: number) {
  const account = useWagmiAccount();
  const status = account.status;
  const chainId = account.chainId;
  const { switchChainAsync, isPending } = useSwitchChain();
  const lastTried = useRef<number | null>(null);

  useEffect(() => {
    if (status !== "connected") return;
    if (!chainId) return;
    if (chainId === targetChainId || chainId === 1) return; // TODO all supported chainids

    if (lastTried.current === chainId) return;
    if (isPending) return;

    (async () => {
      try {
        await switchChainAsync({ chainId: targetChainId });
      } catch (err) {
        console.warn("Failed to switch chain:", err);
      }
    })();
  }, [status, chainId, targetChainId, switchChainAsync, isPending]);
}

export function useAccount():
  & Omit<ReturnType<typeof useWagmiAccount>, "connector">
  & {
    connect: () => void;
    ensName: string | undefined;
    safeStatus: Awaited<ReturnType<typeof getSafeStatus>> | null;
  }
{
  const account = useWagmiAccount();
  const connectKitModal = useConnectKitModal();
  const ensName = useEnsName({ address: account?.address });

  const safeStatus = useQuery({
    queryKey: ["safeStatus", account.address],
    queryFn: async () => {
      if (!account.address) {
        throw new Error("No account address");
      }
      const status = await getSafeStatus(account.address);
      return status;
    },
    staleTime: Infinity,
    refetchInterval: false, // only needed once
    enabled: Boolean(account.address),
  });

  return {
    ...account,
    connect: () => {
      connectKitModal.setOpen(true);
    },
    ensName: ensName.data ?? undefined,
    safeStatus: safeStatus.data ?? null,
  };
}

// --- MULTICHAIN

// Map ChainEnv to wagmi/viem Chain
function toWagmiChain(c: {
  CHAIN_ID: number;
  CHAIN_NAME: string;
  CHAIN_CURRENCY: { name: string; symbol: string; decimals: number };
  CHAIN_RPC_URL: string;
  CHAIN_BLOCK_EXPLORER?: string | null;
  CHAIN_CONTRACT_ENS_REGISTRY?: `0x${string}` | null;
  CHAIN_CONTRACT_ENS_RESOLVER?: `0x${string}` | null;
  CHAIN_CONTRACT_MULTICALL?: `0x${string}` | null;
}): Chain {
  return {
    id: c.CHAIN_ID,
    name: c.CHAIN_NAME,
    nativeCurrency: c.CHAIN_CURRENCY,
    rpcUrls: { default: { http: [c.CHAIN_RPC_URL] } },
    blockExplorers: c.CHAIN_BLOCK_EXPLORER
      && { default: { name: "Explorer", url: c.CHAIN_BLOCK_EXPLORER } },
    contracts: {
      ensRegistry: c.CHAIN_CONTRACT_ENS_REGISTRY
        ? { address: c.CHAIN_CONTRACT_ENS_REGISTRY }
        : undefined,
      ensUniversalResolver: c.CHAIN_CONTRACT_ENS_RESOLVER
        ? { address: c.CHAIN_CONTRACT_ENS_RESOLVER }
        : undefined,
      multicall3: c.CHAIN_CONTRACT_MULTICALL
        ? { address: c.CHAIN_CONTRACT_MULTICALL }
        : undefined,
    },
  };
}

const wagmiChainsArr = Object.values(CHAINS).map(toWagmiChain);
if (wagmiChainsArr.length === 0) throw new Error('Empty Chains.');
const chains = wagmiChainsArr as [typeof wagmiChainsArr[0], ...typeof wagmiChainsArr];

const transports = Object.fromEntries(
  Object.values(CHAINS).map((c) => [c.CHAIN_ID, http(c.CHAIN_RPC_URL)])
);

const base = getDefaultConfigFromConnectKit({
  appName: content.appName,
  appDescription: content.appDescription,
  appUrl: content.appUrl,
  appIcon: content.appIcon,
  chains,
  transports,
  walletConnectProjectId: WALLET_CONNECT_PROJECT_ID!,
  ssr: true,
});

export const wagmiChains = createConfig({
  ...base,
  storage: createStorage({ storage: cookieStorage, key: 'wagmi' }),
});
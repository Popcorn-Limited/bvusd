import { Address, createPublicClient, erc4626Abi, http, zeroAddress } from "viem";
import { useClient, usePublicClient, useReadContract, useReadContracts } from "wagmi";
import { AddressesRegistry } from "./abi/AddressesRegistry";
import { WhitelistAbi } from "./abi/Whitelist";
import { bvUSD } from "@liquity2/uikit";
import * as dn from "dnum";
import { dnum18, dnum6, dnum8, DNUM_0, dnumOrNull } from "./dnum-utils";
import { StatsSchema, useLiquityStats } from "./liquity-utils";
import { getBranchContract } from "./contracts";
import { PositionEarn } from "./types";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import * as v from "valibot";
import { useChainConfig } from "./services/ChainConfigProvider";
import { useConfig as useWagmiConfig } from "wagmi";
import { readContracts } from "wagmi/actions";
import { CHAINS, Vault } from "./config/chains";

export function useVault({ chainId, vaultAddress, vaultSymbol}: { chainId: number, vaultSymbol:string, vaultAddress: Address}) {
  const config = useWagmiConfig()

  return useQuery({
    queryKey: [`useVault:${vaultAddress}`],
    queryFn: async () => {
      const collateral = bvUSD;
      const response = await fetch(CHAINS[chainId].STATS_URL);
      const json = await response.json();
      const stats = v.parse(StatsSchema, json);

      const vaultReads = await readContracts(config, {
        contracts: [
          {
            address:vaultAddress,
            abi: erc4626Abi,
            functionName: "totalAssets",
            chainId
          },
          {
            address:vaultAddress,
            abi: erc4626Abi,
            functionName: "totalSupply",
            chainId
          },
        ]
      });

      const decimals = CHAINS[chainId].TOKENS[vaultSymbol]?.decimals ?? 18
      
      const dnZero = [BigInt(0), decimals] as dn.Dnum;
      const dnOne = [BigInt(1), decimals] as dn.Dnum;

      const totalAssets = vaultReads[0].status === "success"
        ? [BigInt(vaultReads[0].result), decimals] as dn.Dnum
        : dnZero

      const totalSupply = vaultReads[1].status === "success"
        ? [BigInt(vaultReads[1].result), decimals] as dn.Dnum
        : dnZero

      return {
        apr7d: vaultAddress ? 0 : dnumOrNull(Number(stats.sbvUSD[0].apy7d) / 100, 4),
        apr30d: vaultAddress ? 0 : dnumOrNull(Number(stats.sbvUSD[0].apy30d) / 100, 4),
        collateral,
        totalDeposited: totalAssets,
        price: totalSupply > dnZero && totalAssets > dnZero ? dn.div(totalAssets, totalSupply, decimals) : dnOne,
      };
    },
  });
}

export function useVaultPosition(
  account: null | Address,
  vaultAddress?: Address
): UseQueryResult<PositionEarn | null> {
  const { chainConfig } = useChainConfig();

  const balance = useReadContract({
    address: vaultAddress?? chainConfig.CONTRACT_VAULT,
    abi: erc4626Abi,
    functionName: "balanceOf",
    args: [account ?? zeroAddress],
    query: {
      select: dnum18,
    },
  });

  return useQuery({
    queryKey: ["useVaultPosition", account],
    queryFn: () => {
      return {
        type: "earn" as const,
        owner: account,
        deposit: balance.data ?? DNUM_0,
        branchId: 0,
        rewards: {
          bold: DNUM_0,
          coll: DNUM_0,
        },
      };
    },
    enabled: balance.status === "success",
  });
}

export function useIsWhitelistedUser(
  callingContract: Address,
  funcSig: `0x${string}`,
  user: Address = zeroAddress
): boolean {
  const { chainConfig } = useChainConfig();

  const whitelist = getBranchContract(chainConfig, 0, "Whitelist");
  const isWhitelistedUser = useReadContract({
    address: whitelist.address,
    abi: WhitelistAbi,
    functionName: "isWhitelisted",
    args: [callingContract, funcSig, user],
  });

  return isWhitelistedUser.data !== undefined
    ? isWhitelistedUser.data
    : false;
}

export function useProtocolOwner(addressesRegistry: Address) {
  const admin = useReadContracts({
    // @ts-ignore
    contracts: [
      {
        address: addressesRegistry,
        abi: AddressesRegistry,
        functionName: "owner",
        args: [],
      },
    ],
    allowFailure: false,
  });

  return admin.data !== undefined ? admin.data[0] : undefined;
}
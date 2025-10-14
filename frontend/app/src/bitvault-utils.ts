import { Address, createPublicClient, erc4626Abi, http, zeroAddress } from "viem";
import { useClient, usePublicClient, useReadContract, useReadContracts } from "wagmi";
import { AddressesRegistry } from "./abi/AddressesRegistry";
import { WhitelistAbi } from "./abi/Whitelist";
import { bvUSD } from "@liquity2/uikit";
import * as dn from "dnum";
import { dnum18, DNUM_0, dnumOrNull } from "./dnum-utils";
import { StatsSchema, useLiquityStats } from "./liquity-utils";
import { getBranchContract } from "./contracts";
import { PositionEarn } from "./types";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import * as v from "valibot";
import { useChainConfig } from "./services/ChainConfigProvider";
import { useConfig as useWagmiConfig } from "wagmi";
import { readContracts } from "wagmi/actions";
import { CHAINS } from "./config/chains";

export function useVault({ chainId }: { chainId: number }) {
  const config = useWagmiConfig()

  return useQuery({
    queryKey: [`useVault:${chainId}`],
    queryFn: async () => {
      const collateral = bvUSD;
      const response = await fetch(CHAINS[chainId].STATS_URL);
      const json = await response.json();
      const stats = v.parse(StatsSchema, json);

      const vaultReads = await readContracts(config, {
        contracts: [
          {
            address: CHAINS[chainId].CONTRACT_VAULT,
            abi: erc4626Abi,
            functionName: "totalAssets",
          },
          {
            address: CHAINS[chainId].CONTRACT_VAULT,
            abi: erc4626Abi,
            functionName: "totalSupply",
          },
        ]
      });
      const totalAssets = vaultReads[0].status === "success" ? dnum18(vaultReads[0].result) : DNUM_0
      const totalSupply = vaultReads[1].status === "success" ? dnum18(vaultReads[1].result) : DNUM_0
     
      return {
        apr: dnumOrNull(Number(stats.sbvUSD[0].apy) / 100, 4),
        apr7d: dnumOrNull(Number(stats.sbvUSD[0].apy) / 100, 4),
        collateral,
        totalDeposited: totalAssets,
        price: totalSupply > DNUM_0 ? dn.div(totalAssets, totalSupply) : dnum18(1),
      };
    },
  });
}

export function useVaultPosition(
  account: null | Address
): UseQueryResult<PositionEarn | null> {
  const { chainConfig } = useChainConfig();

  const balance = useReadContract({
    address: chainConfig.CONTRACT_VAULT,
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
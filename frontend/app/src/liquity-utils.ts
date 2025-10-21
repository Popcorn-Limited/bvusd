import type { Contracts } from "@/src/contracts";
import type {
  Branch,
  BranchId,
  Delegate,
  Dnum,
  PositionEarn,
  PositionLoanCommitted,
  PrefixedTroveId,
  TroveId,
} from "@/src/types";
import type {
  Address,
  CollateralSymbol,
  CollateralToken,
} from "@liquity2/uikit";
import type { UseQueryResult } from "@tanstack/react-query";
import type { Config as WagmiConfig } from "wagmi";

import {
  DATA_REFRESH_INTERVAL,
  INTEREST_RATE_ADJ_COOLDOWN,
  INTEREST_RATE_END,
  INTEREST_RATE_INCREMENT_NORMAL,
  INTEREST_RATE_INCREMENT_PRECISE,
  INTEREST_RATE_PRECISE_UNTIL,
  INTEREST_RATE_START,
} from "@/src/constants";
import {
  CONTRACTS,
  getBranchContract,
  getProtocolContract,
} from "@/src/contracts";
import {
  dnum18,
  DNUM_0,
  dnumOrNull,
  jsonStringifyWithDnum,
} from "@/src/dnum-utils";
import {
  DIFFS_STATS_URL,
  ENV_BRANCHES,
} from "@/src/env";
import { useContinuousBoldGains } from "@/src/liquity-stability-pool";
import {
  useAllInterestRateBrackets,
  useInterestRateBrackets,
  useLoanById,
  useStabilityPool,
} from "@/src/subgraph-hooks";
import { isBranchId, isTroveId } from "@/src/types";
import { bigIntAbs } from "@/src/utils";
import {
  addressesEqual,
  COLLATERALS,
  isAddress,
  shortenAddress,
  USDT,
} from "@liquity2/uikit";
import { useQuery } from "@tanstack/react-query";
import * as dn from "dnum";
import { useMemo } from "react";
import * as v from "valibot";
import {
  encodeAbiParameters,
  erc4626Abi,
  keccak256,
  parseAbiParameters,
  zeroAddress,
} from "viem";
import {
  useConfig as useWagmiConfig,
  useReadContract,
  useReadContracts,
} from "wagmi";
import { ChainEnv, useChainConfig } from "@/src/services/ChainConfigProvider";
import { readContract, readContracts } from "wagmi/actions";
import { graphQuery, InterestBatchesQuery } from "./subgraph-queries";

export function shortenTroveId(troveId: TroveId, chars = 8) {
  return troveId.length < chars * 2 + 2
    ? troveId
    : // : troveId.slice(0, chars + 2) + "…" + troveId.slice(-chars);
      troveId.slice(0, chars + 2) + "…";
}

export function getTroveId(owner: Address, ownerIndex: bigint | number) {
  return BigInt(
    keccak256(
      encodeAbiParameters(parseAbiParameters("address, uint256"), [
        owner,
        BigInt(ownerIndex),
      ])
    )
  );
}

export function parsePrefixedTroveId(value: PrefixedTroveId): {
  branchId: BranchId;
  troveId: TroveId;
} {
  const [branchId_, troveId] = value.split(":");
  if (!branchId_ || !troveId) {
    throw new Error(`Invalid prefixed trove ID: ${value}`);
  }
  const branchId = parseInt(branchId_, 10);
  if (!isBranchId(branchId) || !isTroveId(troveId)) {
    throw new Error(`Invalid prefixed trove ID: ${value}`);
  }
  return { branchId, troveId };
}

export function getPrefixedTroveId(
  branchId: BranchId,
  troveId: TroveId
): PrefixedTroveId {
  return `${branchId}:${troveId}`;
}

export function getCollToken(branchId: null): null;
export function getCollToken(branchId: BranchId): CollateralToken;
export function getCollToken(branchId: BranchId | null): CollateralToken | null;
export function getCollToken(
  branchId: BranchId | null
): CollateralToken | null {
  if (branchId === null) {
    return null;
  }
  const branch = getBranch(branchId);
  const token = COLLATERALS.find((c) => c.symbol === branch.symbol);
  if (!token) {
    throw new Error(`Unknown collateral symbol: ${branch.symbol}`);
  }
  return token;
}

export function getBranches(chainConfig: ChainEnv): Branch[] {
  return ENV_BRANCHES.map((branch) => {
    const contracts = CONTRACTS(chainConfig).branches.find((b) => b.id === branch.id);
    if (!contracts) {
      throw new Error(`Contracts not found for branch: ${branch.id}`);
    }
    return {
      id: branch.id,
      branchId: branch.id,
      contracts: contracts.contracts,
      symbol: branch.symbol,
      strategies: branch.strategies,
    };
  });
}

export function getBranch(idOrSymbol: null): null;
export function getBranch(idOrSymbol: CollateralSymbol | BranchId): Branch;
export function getBranch(
  idOrSymbol: CollateralSymbol | BranchId | null
): Branch | null {
  if (idOrSymbol === null) {
    return null;
  }

  const { chainConfig } = useChainConfig(); 

  const branch = getBranches(chainConfig).find((b) =>
    typeof idOrSymbol === "string"
      ? b.symbol === idOrSymbol
      : b.id === idOrSymbol
  );

  if (!branch) {
    throw new Error("Invalid branch ID or symbol: " + idOrSymbol);
  }

  return branch;
}

export function useEarnPool(branchId: null | BranchId) {
  const collateral = getCollToken(branchId);
  const pool = useStabilityPool(branchId ?? undefined);
  const stats = useLiquityStats();
  const branchStats = collateral && stats.data?.branch[collateral?.symbol];
  return {
    ...pool,
    data: {
      // apr: dnumOrNull(branchStats?.spApyAvg1d, 18), // TODO
      // apr7d: dnumOrNull(branchStats?.spApyAvg7d, 18),
      apr: 0,
      apr7d: 0,
      collateral,
      totalDeposited: pool.data?.totalDeposited ?? null,
    },
  };
}


export function isEarnPositionActive(position: PositionEarn | null) {
  return Boolean(
    position &&
      (dn.gt(position.deposit, 0) ||
        dn.gt(position.rewards.bold, 0) ||
        dn.gt(position.rewards.coll, 0))
  );
}

export function useEarnPosition(
  branchId: null | BranchId,
  account: null | Address
): UseQueryResult<PositionEarn | null> {
  const getBoldGains = useContinuousBoldGains(account, branchId);
  const { chainConfig } = useChainConfig();

  const yieldGainsInBold = useQuery({
    queryFn: () => getBoldGains.data?.(Date.now()) ?? null,
    queryKey: ["useEarnPosition:getBoldGains", branchId, account],
    refetchInterval: 10_000,
    enabled: getBoldGains.status === "success",
  });

  const StabilityPool = getBranchContract(chainConfig, branchId, "StabilityPool");
  if (!StabilityPool) {
    throw new Error(`Invalid branch: ${branchId}`);
  }

  const spReads = useReadContracts({
    contracts: [
      {
        ...StabilityPool,
        functionName: "getCompoundedBoldDeposit",
        args: [account ?? "0x"],
      },
      {
        ...StabilityPool,
        functionName: "getDepositorCollGain",
        args: [account ?? "0x"],
      },
      {
        ...StabilityPool,
        functionName: "stashedColl",
        args: [account ?? "0x"],
      },
    ],
    allowFailure: false,
    query: {
      select: ([deposit, collGain, stashedColl]) => ({
        spDeposit: dnum18(deposit),
        spCollGain: dnum18(collGain),
        spStashedColl: dnum18(stashedColl),
      }),
      enabled: account !== null,
    },
  });

  return useQuery({
    queryKey: ["useEarnPosition", branchId, account],
    queryFn: () => {
      return {
        type: "earn" as const,
        owner: account,
        deposit: spReads.data?.spDeposit ?? DNUM_0,
        branchId,
        rewards: {
          bold: yieldGainsInBold.data ?? DNUM_0,
          coll: dn.add(
            spReads.data?.spCollGain ?? DNUM_0,
            spReads.data?.spStashedColl ?? DNUM_0
          ),
        },
      };
    },
    enabled: Boolean(
      account &&
        branchId !== null &&
        yieldGainsInBold.status === "success" &&
        getBoldGains.status === "success" &&
        spReads.status === "success"
    ),
  });
}

export function useTroveNftUrl(
  branchId: null | BranchId,
  troveId: null | TroveId
) {
  const { chainConfig } = useChainConfig();

  const TroveNft = getBranchContract(chainConfig, branchId, "TroveNFT");
  return (
    TroveNft &&
    troveId &&
    `${chainConfig.CHAIN_BLOCK_EXPLORER}nft/${TroveNft.address}/${BigInt(troveId)}`
  );
}

export function useAverageInterestRate(branchId: null | BranchId) {
  const brackets = useInterestRateBrackets(branchId);

  const data = useMemo(() => {
    if (!brackets.isSuccess) {
      return null;
    }

    let totalDebt = DNUM_0;
    let totalWeightedRate = DNUM_0;

    for (const bracket of brackets.data) {
      totalDebt = dn.add(totalDebt, bracket.totalDebt);
      totalWeightedRate = dn.add(
        totalWeightedRate,
        dn.mul(bracket.rate, bracket.totalDebt)
      );
    }

    return dn.eq(totalDebt, 0) ? DNUM_0 : dn.div(totalWeightedRate, totalDebt);
  }, [brackets.isSuccess, brackets.data]);

  return {
    ...brackets,
    data,
  };
}

export function useInterestRateChartData() {
  const brackets = useAllInterestRateBrackets();
  return useQuery({
    queryKey: [
      "useInterestRateChartData",
      jsonStringifyWithDnum(brackets.data),
    ],
    queryFn: () => {
      if (!brackets.isSuccess) {
        throw new Error();
      }

      const debtByRate = new Map<string, Dnum>();
      let totalDebt = DNUM_0;
      let highestDebt = DNUM_0;

      for (const bracket of brackets.data) {
        if (
          dn.lt(bracket.rate, INTEREST_RATE_START) ||
          dn.gt(bracket.rate, INTEREST_RATE_END)
        ) {
          continue;
        }

        debtByRate.set(dn.toJSON(bracket.rate), bracket.totalDebt);
        totalDebt = dn.add(totalDebt, bracket.totalDebt);
        if (dn.gt(bracket.totalDebt, highestDebt)) {
          highestDebt = bracket.totalDebt;
        }
      }

      const chartData = [];
      let currentRate = dn.from(INTEREST_RATE_START, 18);
      let runningDebtTotal = DNUM_0;

      while (dn.lte(currentRate, INTEREST_RATE_END)) {
        const nextRate = dn.add(
          currentRate,
          dn.lt(currentRate, INTEREST_RATE_PRECISE_UNTIL)
            ? INTEREST_RATE_INCREMENT_PRECISE
            : INTEREST_RATE_INCREMENT_NORMAL
        );

        let aggregatedDebt = DNUM_0; // debt between currentRate and nextRate
        let stepRate = currentRate;
        while (dn.lt(stepRate, nextRate)) {
          aggregatedDebt = dn.add(
            aggregatedDebt,
            debtByRate.get(dn.toJSON(stepRate)) ?? DNUM_0
          );
          stepRate = dn.add(stepRate, INTEREST_RATE_INCREMENT_PRECISE);
        }

        chartData.push({
          debt: aggregatedDebt,
          debtInFront: dn.from(runningDebtTotal),
          rate: currentRate,
          size:
            totalDebt[0] === 0n
              ? 0
              : dn.toNumber(dn.div(aggregatedDebt, highestDebt)),
        });

        runningDebtTotal = dn.add(runningDebtTotal, aggregatedDebt);
        currentRate = nextRate;
      }

      return chartData;
    },
    refetchInterval: DATA_REFRESH_INTERVAL,
    enabled: brackets.isSuccess,
  });
}

export function findClosestRateIndex(
  rates: bigint[], // rates must be sorted
  rate: bigint
): number {
  const firstRate = rates.at(0);
  const lastRate = rates.at(-1);

  if (firstRate === undefined || lastRate === undefined) {
    throw new Error("Invalid rates array");
  }

  if (rate <= firstRate) return 0;
  if (rate >= lastRate) return 1;

  let diff = bigIntAbs(firstRate - rate);

  for (let index = 0; index < rates.length - 1; index++) {
    const nextRate = rates.at(index + 1);
    if (nextRate === undefined) throw new Error(); // should never happen

    const nextDiff = bigIntAbs(nextRate - rate);

    // diff starts increasing = we passed the closest point
    if (nextDiff > diff) return index;

    diff = nextDiff;
  }

  return rates.length - 1;
}

export function usePredictOpenTroveUpfrontFee(
  branchId: BranchId,
  borrowedAmount: Dnum,
  interestRateOrBatch: Address | Dnum
) {
  const batch = isAddress(interestRateOrBatch);
  const { chainConfig } = useChainConfig();

  return useReadContract({
    ...getProtocolContract(chainConfig, "HintHelpers"),
    functionName: batch
      ? "predictOpenTroveAndJoinBatchUpfrontFee"
      : "predictOpenTroveUpfrontFee",
    args: batch
      ? [BigInt(branchId), borrowedAmount[0], interestRateOrBatch]
      : [BigInt(branchId), borrowedAmount[0], interestRateOrBatch[0]],
    query: {
      refetchInterval: DATA_REFRESH_INTERVAL,
      select: dnum18,
    },
  });
}

export function usePredictAdjustTroveUpfrontFee(
  branchId: BranchId,
  troveId: TroveId,
  debtIncrease: Dnum
) {
  const { chainConfig } = useChainConfig();

  return useReadContract({
    ...getProtocolContract(chainConfig, "HintHelpers"),
    functionName: "predictAdjustTroveUpfrontFee",
    args: [BigInt(branchId), BigInt(troveId), debtIncrease[0]],
    query: {
      refetchInterval: DATA_REFRESH_INTERVAL,
      select: dnum18,
    },
  });
}

// predicts the upfront fee for:
// - adjusting the interest rate of a trove (non-batch => non-batch)
// - joining a batch with a new interest rate (non-batch => batch or batch => batch)
// - removing a trove from a batch (batch => non-batch)
export function usePredictAdjustInterestRateUpfrontFee(
  branchId: BranchId,
  troveId: TroveId,
  newInterestRateOrBatch: Address | Dnum,
  fromBatch: boolean
) {
  const functionName = isAddress(newInterestRateOrBatch)
    ? "predictJoinBatchInterestRateUpfrontFee"
    : fromBatch
    ? "predictRemoveFromBatchUpfrontFee"
    : "predictAdjustInterestRateUpfrontFee";
    const { chainConfig } = useChainConfig();

  return useReadContract({
    ...getProtocolContract(chainConfig, "HintHelpers"),
    functionName,
    args: [
      BigInt(branchId),
      BigInt(troveId),
      typeof newInterestRateOrBatch === "string"
        ? newInterestRateOrBatch
        : newInterestRateOrBatch[0],
    ],
    query: {
      refetchInterval: DATA_REFRESH_INTERVAL,
      select: dnum18,
    },
  });
}

// from https://github.com/liquity/bold/blob/204a3dec54a0e8689120ca48faf4ece5cf8ccd22/README.md#example-opentrove-transaction-with-hints
export async function getTroveOperationHints({
  wagmiConfig,
  contracts,
  branchId,
  interestRate,
}: {
  wagmiConfig: WagmiConfig;
  contracts: Contracts;
  branchId: BranchId;
  interestRate: bigint;
}): Promise<{
  upperHint: bigint;
  lowerHint: bigint;
}> {
  const { chainConfig } = useChainConfig();

  const branch = getBranch(branchId);

  const numTroves = await readContract(wagmiConfig, {
    ...branch.contracts.SortedTroves,
    functionName: "getSize",
  });

  const [approxHint] = await readContract(wagmiConfig, {
    ...contracts.HintHelpers,
    functionName: "getApproxHint",
    args: [
      BigInt(branchId),
      interestRate,
      // (10 * sqrt(troves)) gives a hint close to the right position
      10n * BigInt(Math.ceil(Math.sqrt(Number(numTroves)))),
      42n, // random seed
    ],
  });

  const [upperHint, lowerHint] = await readContract(wagmiConfig, {
    ...branch.contracts.SortedTroves,
    functionName: "findInsertPosition",
    args: [interestRate, approxHint, approxHint],
  });

  return { upperHint, lowerHint };
}

export const StatsSchema = v.pipe(
  v.object({
    total_bold_supply: v.string(),
    total_debt_pending: v.string(),
    total_coll_value: v.string(),
    total_sp_deposits: v.string(),
    total_value_locked: v.string(),
    total_vault_tvl: v.string(),
    total_reserve: v.string(),
    reserves_assets: v.array(
      v.object({
        asset: v.string(),
        balance: v.string(),
        wallet: v.string(),
        chain: v.string(),
      })
    ),
    sbvUSD: v.array(
      v.object({
        address: v.string(),
        apy7: v.string(),
        apy30: v.string(),
        supply: v.string(),
        safe: v.string(),
        chain: v.string(),
      })
    ),
    max_sp_apy: v.string(),
    day_supply: v.array(
      v.object({
        day: v.string(),
        holders: v.string(),
        supply: v.string(),
      })
    ),
    collateral_ratio: v.array(
      v.object({
        avg_cr: v.string(),
        time: v.string(),
      })
    ),
    branch: v.record(
      v.string(),
      v.object({
        coll_active: v.string(),
        coll_default: v.string(),
        coll_price: v.string(),
        sp_deposits: v.string(),
        interest_accrual_1y: v.string(),
        interest_pending: v.string(),
        total_debt: v.string(),
        batch_management_fees_pending: v.string(),
        debt_pending: v.string(),
        coll_value: v.string(),
        value_locked: v.string(),
        sp_apy: v.string(),
        apy_avg: v.string(),
        historical_cr: v.array(
          v.object({
            time: v.string(),
            collateral_ratio: v.string(),
          })
        ),
      })
    ),
    troves: v.array(
      v.object({
        owner: v.string(),
        troveId: v.string(),
        collateralAsset: v.string(),
        collateral: v.string(),
        debt: v.string(),
        cr: v.string(),
      })
    ),
    spDeposits: v.array(
      v.object({
        depositor: v.string(),
        collateral: v.string(),
        time: v.string(),
        amount: v.string(),
      })
    ),
    poolDepth: v.array(
      v.object({
        tick: v.string(),
        liquidity: v.string(),
        price: v.string(),
      })
    ),
    holders: v.array(
      v.object({
        holder: v.string(),
        balance: v.string(),
        day: v.string(),
      })
    ),
    poolVolume: v.array(
      v.object({
        pool: v.string(),
        swap_count_1d: v.string(),
        swap_count_7d: v.string(),
        token0: v.string(),
        token1: v.string(),
        total_volume_1d: v.string(),
        total_volume_7d: v.string(),
      })
    ),
    poolSwaps: v.array(
      v.object({
        pool: v.string(),
        amount0: v.string(),
        amount1: v.string(),
        sender: v.string(),
        token0: v.string(),
        token1: v.string(),
        time: v.string(),
        txHash: v.string(),
        type: v.string()
      })
    ),
    vaultsApy: v.array(
      v.object({
        day: v.string(),
        apy7: v.string(),
        apy30: v.string(),
        vault: v.string()
      })
    ),
    allocations: v.array(
      v.object({
        label: v.string(),
        usdValue: v.string(),
        wallet: v.string()
      })
    ),
    tokenAllocations: v.array(
      v.object({
        asset: v.string(),
        balance: v.string(),
        logo: v.string(),
        chains: v.array(v.string())
      })
    ),
    totalAllocations: v.string(),
    btcTVL: v.string(),
    // loans: v.array(
    //   v.object({
    //     protocol: v.string(),
    //     wallet: v.string(),
    //     collateralValue: v.string(),
    //     loanValue: v.string()
    //   })
    // ),
  }),
  v.transform((value) => ({
    totalBoldSupply: value.total_bold_supply,
    totalDebtPending: value.total_debt_pending,
    totalCollValue: value.total_coll_value,
    totalSpDeposits: value.total_sp_deposits,
    totalValueLocked: value.total_value_locked,
    totalVaultTVL: value.total_vault_tvl,
    totalReserves: value.total_reserve,
    reserveAssets: value.reserves_assets.map((r) => {
      return {
        asset: r.asset,
        balance: r.balance,
        wallet: r.wallet,
        chain: r.chain,
      };
    }),
    sbvUSD: value.sbvUSD.map((s) => {
      return {
        apy7d: s.apy7,
        apy30d: s.apy30,
        supply: s.supply,
        safe: s.safe,
        chain: s.chain,
      };
    }),
    maxSpApy: value.max_sp_apy,
    historicalSupply: value.day_supply.map((dailyObj) => {
      return {
        day: dailyObj.day,
        holders: dailyObj.holders,
        supply: dailyObj.supply,
      };
    }),
    historicalGlobalCR: value.collateral_ratio.map((dailyObj) => {
      return {
        day: dailyObj.time,
        collateral_ratio: dailyObj.avg_cr,
      };
    }),
    branch: Object.fromEntries(
      Object.entries(value.branch).map(([symbol, branch]) => {
        symbol = symbol.toUpperCase();
        return [
          symbol,
          {
            collActive: branch.coll_active,
            collDefault: branch.coll_default,
            collPrice: branch.coll_price,
            spDeposits: branch.sp_deposits,
            interestAccrual1y: branch.interest_accrual_1y,
            interestPending: branch.interest_pending,
            totalDebt: branch.total_debt,
            batchManagementFeesPending: branch.batch_management_fees_pending,
            debtPending: branch.debt_pending,
            collValue: branch.coll_value,
            valueLocked: branch.value_locked,
            spApy: branch.sp_apy,
            apyAvg: branch.apy_avg,
            historicalCR: branch.historical_cr.map((dailyObj) => {
              return {
                day: dailyObj.time,
                collateral_ratio: dailyObj.collateral_ratio,
              };
            }),
          },
        ];
      })
    ),
    troves: value.troves.map((trove) => {
      return {
        owner: trove.owner,
        troveId: trove.troveId,
        collateralAsset: trove.collateralAsset,
        collateral: trove.collateral,
        debt: trove.debt,
        cr: trove.cr,
      };
    }),
    spDeposits: value.spDeposits.map((deposit) => {
      return {
        depositor: deposit.depositor,
        time: deposit.time,
        collateralAsset: deposit.collateral,
        amount: deposit.amount
      };
    }),
    poolDepth: value.poolDepth.map((tick) => {
      return {
        tick: tick.tick,
        liquidity: tick.liquidity,
        price: tick.price,
      };
    }),
    holders: value.holders.map((h) => {
      return {
        holder: h.holder,
        balance: h.balance,
        lastUpdate: h.day,
      };
    }),
    poolVolume: value.poolVolume.map((v) => {
      return {
        pool: v.pool,
        count1d: v.swap_count_1d,
        count7d: v.swap_count_7d,
        token0: v.token0,
        token1: v.token1,
        volume1d: v.total_volume_1d,
        volume7d: v.total_volume_7d
      }
    }),
    poolSwaps: value.poolSwaps.map((s) => {
      return {
        pool: s.pool,
        amount0: s.amount0,
        amount1: s.amount1,
        sender: s.sender,
        token0: s.token0,
        token1: s.token1,
        time: s.time,
        txHash: s.txHash,
        type: s.type
      }
    }),
    vaultsApy: value.vaultsApy.map((apy) => {
      return {
        apy7d: apy.apy7,
        apy30d: apy.apy30,
        day: apy.day,
        vault: apy.vault
      }
    }),
    allocations: value.allocations.map((al) => {
      return {
        label: al.label,
        usdValue: al.usdValue,
        wallet: al.wallet
      }
    }),
    totalAllocations: value.totalAllocations,
    tokenAllocations: value.tokenAllocations.map((al) => {
      return {
        asset: al.asset,
        balance: al.balance,
        logo: al.logo,
        chains: al.chains
      }
    }),
    btcTVL: value.btcTVL,
    // loans: value.loans.map((l) => {
    //   return {
    //     protocol: l.protocol,
    //     wallet: l.wallet,
    //     collateralValue: l.collateralValue,
    //     loanValue: l.loanValue
    //   }
    // })
  }))
);

export function useBranchDebt(branchId: BranchId) {
  const { chainConfig } = useChainConfig();

  const BorrowerOperations = getBranchContract(chainConfig, branchId, "BorrowerOperations");
  return useReadContract({
    ...BorrowerOperations,
    functionName: "getEntireBranchDebt",
    query: {
      refetchInterval: DATA_REFRESH_INTERVAL,
      select: dnum18,
    },
  });
}

export function useDiffs() {
  return useQuery({
    queryKey: ["stats-diff"],
    queryFn: async () => {
      if (!DIFFS_STATS_URL) {
        throw new Error("DIFFS_STATS_URL is not defined");
      }
      const response = await fetch(DIFFS_STATS_URL);
      const json = await response.json();
      return json;
    },
    enabled: true,
  });
}

import stats from "../../../docs/katana.json";

export function useLiquityStats() {
  const { chainConfig } = useChainConfig();

  return useQuery({
    queryKey: ["liquity-stats"],
    queryFn: async () => {
      if (!chainConfig.STATS_URL) {
        throw new Error("config.STATS_URL is not defined");
      }
      // const response = await fetch(chainConfig.STATS_URL);
      // const json = await response.json();
      return v.parse(StatsSchema, stats);
    },
    enabled: Boolean(chainConfig.STATS_URL),
  });
}

export function useLatestTroveData(branchId: BranchId, troveId: TroveId) {
  const { chainConfig } = useChainConfig();

  const TroveManager = getBranchContract(chainConfig, branchId, "TroveManager");
  if (!TroveManager) {
    throw new Error(`Invalid branch: ${branchId}`);
  }
  return useReadContract({
    ...TroveManager,
    functionName: "getLatestTroveData",
    args: [BigInt(troveId)],
    query: {
      refetchInterval: DATA_REFRESH_INTERVAL,
    },
  });
}

export function useLoanLiveDebt(branchId: BranchId, troveId: TroveId) {
  const latestTroveData = useLatestTroveData(branchId, troveId);
  return {
    ...latestTroveData,
    data: latestTroveData.data?.entireDebt ?? null,
  };
}

export function useLoan(
  branchId: BranchId,
  troveId: TroveId
): UseQueryResult<PositionLoanCommitted | null> {
  const liveDebt = useLoanLiveDebt(branchId, troveId);
  const loan = useLoanById(getPrefixedTroveId(branchId, troveId));

  if (liveDebt.status === "pending" || loan.status === "pending") {
    return {
      ...loan,
      data: undefined,
      error: null,
      isError: false,
      isFetching: true,
      isLoading: true,
      isLoadingError: false,
      isPlaceholderData: false,
      isPending: true,
      isRefetchError: false,
      isSuccess: false,
      status: "pending",
    };
  }

  if (!loan.data) {
    return loan;
  }

  // @ts-ignore
  return {
    ...loan,
    data: {
      ...loan.data,
      borrowed: liveDebt.data ? dnum18(liveDebt.data) : loan.data.borrowed,
    },
  };
}

export function useInterestBatchDelegate(
  branchId: BranchId,
  batchAddress: null | Address
) {
  const result = useInterestBatchDelegates(
    branchId,
    batchAddress ? [batchAddress] : []
  );
  return { ...result, data: result.data?.[0] ?? null };
}

export function useInterestBatchDelegates(
  branchId: BranchId,
  batchAddresses: Address[]
): UseQueryResult<Delegate[]> {
  const wagmiConfig = useWagmiConfig();
  const { chainConfig } = useChainConfig();

  return useQuery<Delegate[]>({
    queryKey: ["InterestBatches", branchId, batchAddresses],
    queryFn: async () => {
      if (batchAddresses.length === 0) {
        return [];
      }

      const [{ interestBatches: batches }, batchesFromChain] =
        await Promise.all([
          graphQuery(InterestBatchesQuery, {
            ids: batchAddresses.map(
              (addr) => `${branchId}:${addr.toLowerCase()}`
            ),
          }),
          readContracts(wagmiConfig, {
            allowFailure: false,
            contracts: batchAddresses.map((address) => ({
              ...getBranchContract(chainConfig, branchId, "BorrowerOperations"),
              functionName: "getInterestBatchManager" as const,
              args: [address],
            })),
          }).then((results) => {
            return results.map((result, index) => ({
              address: (batchAddresses[index] ?? "").toLowerCase() as Address,
              ...result,
            }));
          }),
        ]);

      return batches
        .map((batch): null | Delegate => {
          const batchAddress = batch.batchManager.toLowerCase();
          if (!isAddress(batchAddress)) {
            throw new Error(`Invalid batch manager address: ${batchAddress}`);
          }

          const batchFromChain = batchesFromChain.find((b) =>
            addressesEqual(b.address, batchAddress)
          );
          if (!batchFromChain) {
            return null;
          }

          return {
            id: `${branchId}:${batchAddress}`,
            address: batchAddress,
            name: shortenAddress(batchAddress, 4),
            interestRate: dnum18(batch.annualInterestRate),
            boldAmount: dnum18(batch.debt),
            interestRateChange: {
              min: dnum18(batchFromChain.minInterestRate),
              max: dnum18(batchFromChain.maxInterestRate),
              period: batchFromChain.minInterestRateChangePeriod,
            },
            fee: dnum18(batch.annualManagementFee),

            // not available in the subgraph yet
            followers: 0,
            lastDays: 0,
            redemptions: dnum18(0),
          };
        })
        .filter((delegate) => delegate !== null);
    },
    refetchInterval: DATA_REFRESH_INTERVAL,
    enabled: batchAddresses.length > 0,
  });
}

export function useTroveRateUpdateCooldown(
  branchId: BranchId,
  troveId: TroveId
) {
  const { chainConfig } = useChainConfig();
  const wagmiConfig = useWagmiConfig();
  return useQuery({
    queryKey: ["troveRateUpdateCooldown", branchId, troveId],
    queryFn: async () => {
      const { lastInterestRateAdjTime } = await readContract(wagmiConfig, {
        ...getBranchContract(chainConfig, branchId, "TroveManager"),
        functionName: "getLatestTroveData",
        args: [BigInt(troveId)],
      });
      const cooldownEndTime =
        (Number(lastInterestRateAdjTime) + INTEREST_RATE_ADJ_COOLDOWN) * 1000;
      return (now: number) => Math.max(0, cooldownEndTime - now);
    },
  });
}

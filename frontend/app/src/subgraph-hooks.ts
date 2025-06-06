// TODO: Remove this file and move the hooks into liquity-*.ts files instead,
// since some need to do more than just fetch data from the subgraph.

import type {
  StabilityPoolDepositQuery as StabilityPoolDepositQueryType,
  TrovesByAccountQuery as TrovesByAccountQueryType,
} from "@/src/graphql/graphql";
import type { Address, BranchId, PositionEarn, PositionLoanCommitted, PrefixedTroveId } from "@/src/types";

import { DATA_REFRESH_INTERVAL } from "@/src/constants";
import { dnum18 } from "@/src/dnum-utils";
import { isBranchId, isPositionLoanCommitted, isPrefixedtroveId, isTroveId } from "@/src/types";
import { sleep } from "@/src/utils";
import { isAddress } from "@liquity2/uikit";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  AllInterestRateBracketsQuery,
  BorrowerInfoQuery,
  graphQuery,
  StabilityPoolDepositQuery,
  StabilityPoolDepositsByAccountQuery,
  StabilityPoolEpochScaleQuery,
  StabilityPoolsQuery,
  TroveByIdQuery,
  TrovesByAccountQuery,
} from "./subgraph-queries";

type Options = {
  refetchInterval?: number;
};

function prepareOptions(options?: Options): Options {
  return {
    refetchInterval: DATA_REFRESH_INTERVAL,
    ...options,
  };
}

export function useNextOwnerIndex(
  borrower: null | Address,
  branchId: null | BranchId,
  options?: Options,
) {
  let queryFn = async () => {
    if (!borrower || branchId === null) {
      return null;
    }

    const { borrowerInfo } = await graphQuery(
      BorrowerInfoQuery,
      { id: borrower.toLowerCase() },
    );

    // if borrowerInfo doesn’t exist, start at 0
    return borrowerInfo?.nextOwnerIndexes[branchId] ?? 0;
  };

  return useQuery({
    queryKey: ["NextTroveId", borrower, branchId],
    queryFn,
    ...prepareOptions(options),
  });
}

export function useLoansByAccount(
  account?: Address | null,
  options?: Options,
) {
  let queryFn = async () => {
    if (!account) return null;
    const { troves } = await graphQuery(
      TrovesByAccountQuery,
      { account: account.toLowerCase() },
    );
    return troves.map(subgraphTroveToLoan);
  };

  return useQuery({
    queryKey: ["TrovesByAccount", account],
    queryFn,
    ...prepareOptions(options),
  });
}

export function useLoanById(
  id?: null | PrefixedTroveId,
  options?: Options,
) {
  let queryFn: () => Promise<PositionLoanCommitted | null>;

  queryFn = async () => {
    if (!isPrefixedtroveId(id)) return null;
    const { trove } = await graphQuery(TroveByIdQuery, { id });
    return trove ? subgraphTroveToLoan(trove) : null;
  };

  return useQuery<PositionLoanCommitted | null>({
    queryKey: ["TroveById", id],
    queryFn,
    ...prepareOptions(options),
  });
}

export function useStabilityPoolDeposits(
  account: null | Address,
  options?: Options,
) {
  let queryFn = async () => {
    if (!account) return [];
    const { stabilityPoolDeposits } = await graphQuery(
      StabilityPoolDepositsByAccountQuery,
      { account: account.toLowerCase() },
    );
    return stabilityPoolDeposits.map((deposit) => ({
      id: `${deposit.collateral.collIndex}:${account}`.toLowerCase(),
      collateral: deposit.collateral,
      deposit: BigInt(deposit.deposit),
      depositor: account.toLowerCase(),
      snapshot: {
        B: BigInt(deposit.snapshot.B),
        P: BigInt(deposit.snapshot.P),
        S: BigInt(deposit.snapshot.S),
        epoch: BigInt(deposit.snapshot.epoch),
        scale: BigInt(deposit.snapshot.scale),
      },
    }));
  };

  return useQuery<NonNullable<
    StabilityPoolDepositQueryType["stabilityPoolDeposit"]
  >[]>({
    queryKey: ["StabilityPoolDepositsByAccount", account],
    queryFn,
    ...prepareOptions(options),
  });
}

export function useStabilityPoolDeposit(
  branchId: null | number,
  account: null | Address,
  options?: Options,
) {
  let queryFn = async () => {
    if (account === null || branchId === null) return null;
    const { stabilityPoolDeposit } = await graphQuery(StabilityPoolDepositQuery, {
      id: `${branchId}:${account}`.toLowerCase(),
    });
    return !stabilityPoolDeposit ? null : {
      id: `${branchId}:${account}`.toLowerCase(),
      collateral: { collIndex: branchId },
      deposit: BigInt(stabilityPoolDeposit.deposit),
      depositor: account.toLowerCase(),
      snapshot: {
        B: BigInt(stabilityPoolDeposit.snapshot.B),
        P: BigInt(stabilityPoolDeposit.snapshot.P),
        S: BigInt(stabilityPoolDeposit.snapshot.S),
        epoch: BigInt(stabilityPoolDeposit.snapshot.epoch),
        scale: BigInt(stabilityPoolDeposit.snapshot.scale),
      },
    };
  };

  return useQuery<
    | null
    | NonNullable<
      StabilityPoolDepositQueryType["stabilityPoolDeposit"]
    >
  >({
    queryKey: ["StabilityPoolDeposit", account, branchId],
    queryFn,
    ...prepareOptions(options),
  });
}

export function useStabilityPool(
  branchId?: null | number,
  options?: Options,
) {
  let queryFn = async () => {
    const { stabilityPools } = await graphQuery(
      StabilityPoolsQuery,
    );
    return stabilityPools.map((stabilityPool) => ({
      branchId: parseInt(stabilityPool.id, 10),
      apr: dnum18(0),
      totalDeposited: dnum18(stabilityPool.totalDeposited),
    }));
  };

  return useQuery({
    queryKey: ["StabilityPool"],
    queryFn,
    select: (pools) => {
      if (typeof branchId !== "number") {
        return null;
      }
      const pool = pools.find((pool) => pool.branchId === branchId);
      if (pool === undefined) {
        throw new Error(`Stability pool not found: ${branchId}`);
      }
      return pool;
    },
    ...prepareOptions(options),
  });
}

export function useStabilityPoolEpochScale(
  branchId: null | number,
  epoch: null | bigint,
  scale: null | bigint,
  options?: Options,
) {
  let queryFn = async () => {
    const { stabilityPoolEpochScale } = await graphQuery(
      StabilityPoolEpochScaleQuery,
      { id: `${branchId}:${epoch}:${scale}` },
    );
    return {
      B: BigInt(stabilityPoolEpochScale?.B ?? 0n),
      S: BigInt(stabilityPoolEpochScale?.S ?? 0n),
    };
  };

  return useQuery<{ B: bigint; S: bigint }>({
    queryKey: ["StabilityPoolEpochScale", branchId, String(epoch), String(scale)],
    queryFn,
    ...prepareOptions(options),
  });
}

export function useEarnPositionsByAccount(
  account?: null | Address,
  options?: Options,
) {
  let queryFn = async () => {
    if (!account) return null;
    const { stabilityPoolDeposits } = await graphQuery(
      StabilityPoolDepositsByAccountQuery,
      { account: account.toLowerCase() },
    );
    return stabilityPoolDeposits.map(subgraphStabilityPoolDepositToEarnPosition);
  };

  return useQuery({
    queryKey: ["StabilityPoolDepositsByAccount", account],
    queryFn,
    ...prepareOptions(options),
  });
}

export function useInterestRateBrackets(
  branchId: null | BranchId,
  options?: Options,
) {
  let queryFn = async () => (
    (await graphQuery(AllInterestRateBracketsQuery)).interestRateBrackets
  );

  return useQuery({
    queryKey: ["AllInterestRateBrackets"],
    queryFn,
    select: useCallback((brackets: Awaited<ReturnType<typeof queryFn>>) => {
      return brackets
        .filter((bracket) => bracket.collateral.collIndex === branchId)
        .sort((a, b) => (a.rate > b.rate ? 1 : -1))
        .map((bracket) => ({
          rate: dnum18(bracket.rate),
          totalDebt: dnum18(bracket.totalDebt),
        }));
    }, [branchId]),
    ...prepareOptions(options),
  });
}

export function useAllInterestRateBrackets(
  options?: Options,
) {
  let queryFn = async () => (
    (await graphQuery(AllInterestRateBracketsQuery)).interestRateBrackets
  );
  
  return useQuery({
    queryKey: ["AllInterestRateBrackets"],
    queryFn,
    select: useCallback((brackets: Awaited<ReturnType<typeof queryFn>>) => {
      const debtByRate: Map<string, bigint> = new Map();
      for (const bracket of brackets) {
        const key = String(bracket.rate);
        debtByRate.set(key, (debtByRate.get(key) ?? 0n) + BigInt(bracket.totalDebt));
      }
      return brackets
        .sort((a, b) => (a.rate > b.rate ? 1 : -1))
        .map((bracket) => {
          const totalDebt = debtByRate.get(String(bracket.rate));
          if (totalDebt === undefined) throw new Error();
          return {
            rate: dnum18(bracket.rate),
            totalDebt: dnum18(totalDebt),
          };
        });
    }, []),
    ...prepareOptions(options),
  });
}

function subgraphTroveToLoan(
  trove: TrovesByAccountQueryType["troves"][number],
): PositionLoanCommitted {
  if (!isTroveId(trove.troveId)) {
    throw new Error(`Invalid trove ID: ${trove.id} / ${trove.troveId}`);
  }

  const branchId = trove.collateral.collIndex;
  if (!isBranchId(branchId)) {
    throw new Error(`Invalid branch: ${branchId}`);
  }

  if (!isAddress(trove.borrower)) {
    throw new Error(`Invalid borrower: ${trove.borrower}`);
  }

  return {
    type: trove.mightBeLeveraged ? "multiply" : "borrow",
    batchManager: isAddress(trove.interestBatch?.batchManager)
      ? trove.interestBatch.batchManager
      : null,
    borrowed: dnum18(trove.debt),
    borrower: trove.borrower,
    branchId,
    createdAt: Number(trove.createdAt) * 1000,
    deposit: dnum18(trove.deposit),
    interestRate: dnum18(trove.interestBatch?.annualInterestRate ?? trove.interestRate),
    troveId: trove.troveId,
    updatedAt: Number(trove.updatedAt) * 1000,
    status: trove.status,
  };
}

function subgraphStabilityPoolDepositToEarnPosition(
  spDeposit: NonNullable<
    StabilityPoolDepositQueryType["stabilityPoolDeposit"]
  >,
): PositionEarn {
  const branchId = spDeposit.collateral.collIndex;
  if (!isBranchId(branchId)) {
    throw new Error(`Invalid branch: ${branchId}`);
  }
  if (!isAddress(spDeposit.depositor)) {
    throw new Error(`Invalid depositor address: ${spDeposit.depositor}`);
  }
  return {
    type: "earn",
    owner: spDeposit.depositor,
    branchId,
    deposit: dnum18(0),
    rewards: {
      bold: dnum18(0),
      coll: dnum18(0),
    },
  };
}

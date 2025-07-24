import type { BlockTag, Provider } from "@ethersproject/abstract-provider";
import { BigNumber } from "@ethersproject/bignumber";
import { Decimal } from "@liquity/lib-base";
import {
  getContracts,
  VaultsDeployment,
  erc20Abi,
  type LiquityV2Deployment,
  ERC20,
} from "./contracts";
import {
  fetchHistCRFromDune,
  fetchHistSupplyFromDune,
  fetchListOfTroves,
  fetchSpAverageApysFromDune,
  fetchStabilityPoolDeposits,
  fetchStableVaultTVLFromDune,
  fetchbvUSDHolders,
  fetchBranchData,
  emptyBranchData,
  fetchPoolVolume,
  decimalify,
  fetchPoolSwaps,
} from "./queries";
import { Contract } from "@ethersproject/contracts";
import { fetchLiquidityDepth } from "./queries/getPoolDepth";

const mapObj = <T extends Record<string, any>, U>(
  t: T,
  f: (v: T[keyof T]) => U
) =>
  Object.fromEntries(Object.entries(t).map(([k, v]) => [k, f(v)])) as {
    [K in keyof T]: U;
  };

type FetchConfig = {
  apiKey: string;
  network: "katana" | "bnb";
};

export const fetchV2Stats = async ({
  provider,
  deployment,
  vaults,
  blockTag = "latest",
  duneKey,
}: {
  provider: Provider;
  deployment: LiquityV2Deployment;
  vaults: VaultsDeployment;
  blockTag?: BlockTag;
  duneKey: string;
}) => {
  const SP_YIELD_SPLIT = Number(
    Decimal.fromBigNumberString(deployment.constants.SP_YIELD_SPLIT)
  );
  const contracts = getContracts(provider, deployment);

  const fetchConfig: FetchConfig = {
    apiKey: duneKey,
    network: "katana",
  };

  // counts all assets (stables) in the vaults safes
  // TODO multichain
  const reserves = await Promise.all(
    vaults.stableVaults.map(async (vault) => {
      const asset = new Contract(
        vault.asset,
        erc20Abi,
        provider
      ) as unknown as ERC20;
      return {
        asset: vault.symbol,
        balance:
          Number(await asset.balanceOf(vault.safe, { blockTag })) /
          10 ** vault.assetDecimals,
        wallet: vault.safe,
        chain: vault.chain,
      };
    })
  );

  const deployed = true;

  const [
    total_bold_supply,
    branches,
    historicalSupply,
    historicalCR,
    vault_tvl,
    troves,
    spDeposits,
    holders,
    poolDepth,
    poolVolume,
    poolSwaps
  ] = deployed
    ? await Promise.all([
        // total bvUSD supply
        contracts.boldToken.totalSupply({ blockTag }).then(decimalify),

        // branches
        fetchBranchData(contracts.branches)
          .then((branches) =>
            branches.map((branch) => ({
              ...branch,
              debt_pending: branch.interest_pending.add(
                branch.batch_management_fees_pending
              ),
              coll_value: branch.coll_active
                .add(branch.coll_default)
                .mul(branch.coll_price),
              sp_apy:
                (SP_YIELD_SPLIT * Number(branch.interest_accrual_1y)) /
                Number(branch.sp_deposits),
            }))
          )
          .then((branches) =>
            branches.map((branch) => ({
              ...branch,
              value_locked: branch.coll_value.add(branch.sp_deposits),
            }))
          ),

        // HISTORICALS SUPPLY
        fetchHistSupplyFromDune(fetchConfig),

        // HISTORICAL CR
        fetchHistCRFromDune(fetchConfig),

        // TVL
        fetchStableVaultTVLFromDune(fetchConfig),

        // Troves
        fetchListOfTroves(fetchConfig),

        // Stability Pool
        fetchStabilityPoolDeposits(fetchConfig),

        // holders
        fetchbvUSDHolders(fetchConfig),

        // pool depth
        fetchLiquidityDepth(provider),

        // pool volume
        fetchPoolVolume(fetchConfig),

        // pool swaps
        fetchPoolSwaps(fetchConfig)
      ])
    : await Promise.all([
        Decimal.ZERO, // total_bold_supply
        emptyBranchData(contracts.branches), // branches
        null, // historicalSupply
        null, // historicalCR
        Decimal.ZERO, // vault_tvl
        null, // troves
        null, // spDeposits
        null,
        null,
        null,
        null
      ]);

  const sp_apys = branches.map((b) => b.sp_apy).filter((x) => !isNaN(x));

  return {
    total_bold_supply: `${total_bold_supply}`,
    total_debt_pending: `${branches
      .map((b) => b.debt_pending)
      .reduce((a, b) => a.add(b))}`,
    total_coll_value: `${branches
      .map((b) => b.coll_value)
      .reduce((a, b) => a.add(b))}`,
    total_sp_deposits: `${branches
      .map((b) => b.sp_deposits)
      .reduce((a, b) => a.add(b))}`,
    total_value_locked: `${branches
      .map((b) => b.value_locked)
      .reduce((a, b) => a.add(b))
      .add(vault_tvl)}`,
    total_vault_tvl: `${vault_tvl}`,
    total_reserve: `${reserves.map((r) => r.balance).reduce((a, b) => a + b)}`,
    reserves_assets: reserves!.map((r) =>
      mapObj(
        {
          ...r,
        },
        (x) => `${x}`
      )
    ),
    max_sp_apy: `${sp_apys.length > 0 ? Math.max(...sp_apys) : 0}`,
    day_supply: historicalSupply!.map((daily) =>
      mapObj(
        {
          ...daily,
        },
        (x) => `${x}`
      )
    ),
    collateral_ratio: historicalCR!
      .filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.hour === item.hour)
      )
      .map((daily) => {
        const crObj = mapObj(
          {
            ...daily,
          },
          (x) => `${x}`
        );
        return {
          avg_cr: crObj.avg_col_ratio_perc,
          time: crObj.hour,
        };
      }),
    branch: Object.fromEntries(
      branches.map(({ coll_symbol, sp_apy, ...branch }) => {
        const historicalBranchCR = historicalCR
          // ?.filter((branchCR) => branchCR.collateral_type === coll_symbol)
          ?.filter((branchCR) => branchCR.collateral_type === "WETH") // TODO
          .filter(
            (item, index, self) =>
              index === self.findIndex((t) => t.hour === item.hour)
          )
          .map((branch) => ({
            time: branch.hour,
            collateral_ratio: branch.col_ratio_perc.toString(),
          }));

        // const {
        //   apy_avg_1d: sp_apy_avg_1d,
        //   apy_avg_7d: sp_apy_avg_7d,
        // } = spV2AverageApys?.[coll_symbol] ?? {};
        return [
          coll_symbol,
          {
            ...mapObj(
              {
                ...branch,
                sp_apy: isNaN(sp_apy) ? 0 : sp_apy,
                apy_avg: isNaN(sp_apy) ? 0 : sp_apy, // TODO
                // ...(sp_apy_avg_1d !== undefined ? { sp_apy_avg_1d } : {}),
                // ...(sp_apy_avg_7d !== undefined ? { sp_apy_avg_7d } : {})
              },
              (x) => `${x}`
            ),
            historical_cr: historicalBranchCR,
          },
        ];
      })
    ),
    troves: troves!.map((trove) =>
      mapObj(
        {
          ...trove,
        },
        (x) => `${x}`
      )
    ),
    spDeposits: spDeposits!.map((deposit) =>
      mapObj(
        {
          ...deposit,
        },
        (x) => `${x}`
      )
    ),
    poolDepth: poolDepth!.map((tick) =>
      mapObj(
        {
          ...tick,
        },
        (x) => `${x}`
      )
    ),
    holders: holders!.map((holder) =>
      mapObj(
        {
          ...holder,
        },
        (x) => `${x}`
      )
    ),
    poolVolume: poolVolume!.map((pool) =>
      mapObj(
        {
          ...pool,
        },
        (x) => `${x}`
      )
    ),
    poolSwaps: poolSwaps!.map((swaps) =>
      mapObj(
        {
          ...swaps,
        },
        (x) => `${x}`
      )
    ),
  };
};

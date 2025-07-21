import type { BlockTag, Provider } from "@ethersproject/abstract-provider";
import { BigNumber } from "@ethersproject/bignumber";
import { resolveProperties } from "@ethersproject/properties";
import { Decimal } from "@liquity/lib-base";
import {
  getContracts,
  LiquityV2BranchContracts,
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
  fetchReservesFromDune
} from "./queries";
import { Contract } from "@ethersproject/contracts";
import { fetchLiquidityDepth } from "./queries/getPoolDepth";

const ONE_WEI = Decimal.fromBigNumberString("1");

const decimalify = (bigNumber: BigNumber) =>
  Decimal.fromBigNumberString(bigNumber.toHexString());

const mapObj = <T extends Record<string, any>, U>(
  t: T,
  f: (v: T[keyof T]) => U
) =>
  Object.fromEntries(Object.entries(t).map(([k, v]) => [k, f(v)])) as {
    [K in keyof T]: U;
  };

const fetchBranchData = async (
  branches: LiquityV2BranchContracts[],
  blockTag: BlockTag = "latest"
) =>
  Promise.all(
    branches.map((branch) =>
      resolveProperties({
        coll_symbol: branch.collSymbol,
        coll_active: branch.activePool
          .getCollBalance({ blockTag })
          .then(decimalify),
        coll_default: branch.defaultPool
          .getCollBalance({ blockTag })
          .then(decimalify),
        coll_price: branch.priceFeed.callStatic
          .fetchPrice({ blockTag })
          .then(([x]) => x)
          .then(decimalify),
        sp_deposits: branch.stabilityPool
          .getTotalBoldDeposits({ blockTag })
          .then(decimalify),
        interest_accrual_1y: branch.activePool
          .aggWeightedDebtSum({ blockTag })
          .then(decimalify)
          .then((x) => x.mul(ONE_WEI)),
        interest_pending: branch.activePool
          .calcPendingAggInterest({ blockTag })
          .then(decimalify),
        total_debt: branch.activePool
          .aggRecordedDebt({ blockTag })
          .then(decimalify),
        batch_management_fees_pending: Promise.all([
          branch.activePool
            .aggBatchManagementFees({ blockTag })
            .then(decimalify),
          branch.activePool
            .calcPendingAggBatchManagementFee({ blockTag })
            .then(decimalify),
        ]).then(([a, b]) => a.add(b)),
      })
    )
  );

const emptyBranchData = (
  branches: LiquityV2BranchContracts[]
): ReturnType<typeof fetchBranchData> =>
  Promise.resolve(
    branches.map((branch) => ({
      coll_symbol: branch.collSymbol,
      coll_active: Decimal.ZERO,
      coll_default: Decimal.ZERO,
      coll_price: Decimal.ZERO,
      sp_deposits: Decimal.ZERO,
      interest_accrual_1y: Decimal.ZERO,
      interest_pending: Decimal.ZERO,
      total_debt: Decimal.ZERO,
      batch_management_fees_pending: Decimal.ZERO,
    }))
  );

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

  const poolDepth = await fetchLiquidityDepth(provider);
  // await fetchReservesFromDune({
  //     apiKey: duneKey,
  //     network: "katana",
  //   })

  // counts all assets (stables) in the vaults safes
  // TODO multichain 
  const reserves = await Promise.all(
    vaults.stableVaults.map(async (vault) => {
      const asset = new Contract(
        vault.asset,
        erc20Abi,
        provider
      ) as unknown as ERC20;
      return ({
        asset: vault.symbol,
        balance:  Number(await asset.balanceOf(vault.safe, { blockTag })) /
        10 ** vault.assetDecimals,
        wallet: vault.safe,
        chain: vault.chain
      });
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
    spDeposits
  ] = await Promise.all([
    // total_bold_supply
    deployed
      ? contracts.boldToken.totalSupply({ blockTag }).then(decimalify)
      : Decimal.ZERO,

    // branches
    (deployed ? fetchBranchData : emptyBranchData)(contracts.branches)
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
          value_locked: branch.coll_value.add(branch.sp_deposits), // taking BOLD at face value
        }))
      ),

    // SP AVERAGE APY
    // deployed
    // ? fetchSpAverageApysFromDune({
    //     branches: contracts.branches,
    //     apiKey: duneKey,
    //     network: "bnb",
    //   })
    // : null,

    // HISTORICALS SUPPLY
    deployed
      ? fetchHistSupplyFromDune({
          apiKey: duneKey,
          network: "katana",
        })
      : null,

    // HISTORICAL CR
    deployed
      ? fetchHistCRFromDune({
          apiKey: duneKey,
          network: "katana",
        })
      : null,

    // TVL
    deployed
      ? fetchStableVaultTVLFromDune({
          apiKey: duneKey,
          network: "katana",
        })
      : Decimal.ZERO,

    // Troves
    deployed
      ? fetchListOfTroves({
          apiKey: duneKey,
          network: "katana",
        })
      : null,

    deployed 
      ? 
        fetchStabilityPoolDeposits({
          apiKey: duneKey,
          network: "katana",
        })
      : null
  ]);


  const sp_apys = branches.map((b) => b.sp_apy).filter((x) => !isNaN(x));
  // console.log(sp_apys);
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
    total_reserve: `${reserves.map(r => r.balance).reduce((a, b) => a + b)}`,
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
  };
};

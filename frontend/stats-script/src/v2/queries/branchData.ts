import { Decimal } from "@liquity/lib-base";
import { BigNumber } from "@ethersproject/bignumber";
import type { BlockTag } from "@ethersproject/abstract-provider";
import { LiquityV2BranchContracts } from "../contracts";
import { resolveProperties } from "@ethersproject/properties";

const ONE_WEI = Decimal.fromBigNumberString("1");

export const decimalify = (bigNumber: BigNumber) =>
  Decimal.fromBigNumberString(bigNumber.toHexString());

export const fetchBranchData = async (
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
        coll_value: Decimal.ZERO,
        debt_pending: Decimal.ZERO,
        sp_apy: 0,
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
        value_locked: Decimal.ZERO,
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

export const emptyBranchData = (
  branches: LiquityV2BranchContracts[]
): ReturnType<typeof fetchBranchData> =>
  Promise.resolve(
    branches.map((branch) => ({
      coll_symbol: branch.collSymbol,
      coll_active: Decimal.ZERO,
      coll_default: Decimal.ZERO,
      coll_price: Decimal.ZERO,
      coll_value: Decimal.ZERO,
      debt_pending: Decimal.ZERO,
      sp_apy: 0,
      sp_deposits: Decimal.ZERO,
      interest_accrual_1y: Decimal.ZERO,
      interest_pending: Decimal.ZERO,
      total_debt: Decimal.ZERO,
      value_locked: Decimal.ZERO,
      batch_management_fees_pending: Decimal.ZERO,
    }))
  );

import {
  DUNE_SPV2_AVERAGE_APY_URL_MAINNET,
} from "../../constants";

import { duneFetch, type DuneResponse, isDuneResponse } from "../../dune";
import { LiquityV2BranchContracts } from "../contracts";

const isDuneSpAverageApyResponse = (
  data: unknown
): data is DuneResponse<{
  apr: number;
  collateral_type: string;
}> =>
  isDuneResponse(data) &&
  data.result.rows.length > 0 &&
  data.result.rows.every(
    (row: unknown) =>
      typeof row === "object" &&
      row !== null &&
      "collateral_type" in row &&
      typeof row.collateral_type === "string" &&
      "apr" in row &&
      typeof row.apr === "number"
  );


export const fetchSpAverageApysFromDune = async ({
  branches,
  apiKey,
  network,
}: {
  branches: LiquityV2BranchContracts[];
  apiKey: string;
  network: "bnb" | "mainnet" | "katana";
}) => {
  // const url = network === "sepolia"
  //   ? DUNE_SPV2_AVERAGE_APY_URL_SEPOLIA
  //   : DUNE_SPV2_AVERAGE_APY_URL_MAINNET;

  const url = DUNE_SPV2_AVERAGE_APY_URL_MAINNET;

  // disabled when DUNE_SPV2_AVERAGE_APY_URL_* is null
  if (!url) {
    return null;
  }

  const {
    result: { rows: sevenDaysApys },
  } = await duneFetch({
    apiKey,
    id: url,
    maxResults: `${branches.length * 7}`,
    validate: isDuneSpAverageApyResponse,
  });

  return Object.fromEntries(
    branches.map((branch) => {
      const apys = sevenDaysApys.filter(
        (row) => row.collateral_type === branch.collSymbol
      );
      return [
        branch.collSymbol,
        {
          apy_avg_1d: apys[0].apr,
          apy_avg_7d: apys.reduce((acc, { apr }) => acc + apr, 0) / apys.length,
        },
      ];
    })
  ) as Record<
    string,
    {
      apy_avg_1d: number;
      apy_avg_7d: number;
    }
  >;
};
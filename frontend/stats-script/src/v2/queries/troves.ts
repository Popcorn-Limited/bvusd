import { TROVES_QUERY } from "../../constants";
import { duneFetch, type DuneResponse, isDuneResponse } from "../../dune";


const isDuneTroveResponse = (
  data: unknown
): data is DuneResponse<{
  collateral: number;
  collateral_ratio: number;
  collateral_type: string;
  created_time: string;
  debt: number;
  last_modified_time: string;
  owner: string;
  redeemed_amount: number;
  trove_age: string;
  trove_id: string;
}> =>
  isDuneResponse(data) &&
  data.result.rows.every(
    (row: unknown) =>
      typeof row === "object" &&
      row !== null &&
      "collateral" in row &&
      typeof row.collateral === "number" &&
      "collateral_ratio" in row &&
      typeof row.collateral_ratio === "number" &&
      "collateral_type" in row &&
      typeof row.collateral_type === "string" &&
      "created_time" in row &&
      typeof row.created_time === "string" &&
      "debt" in row &&
      typeof row.debt === "number" &&
      "last_modified_time" in row &&
      typeof row.last_modified_time === "string" &&
      "owner" in row &&
      typeof row.owner === "string" &&
      "redeemed_amount" in row &&
      typeof row.redeemed_amount === "number" &&
      "trove_age" in row &&
      typeof row.trove_age === "string" &&
      "trove_id" in row &&
      typeof row.trove_id === "string"
  );

export const fetchListOfTroves = async ({
  apiKey,
  network,
}: {
  apiKey: string;
  network: "bnb" | "mainnet" | "katana";
}) => {
  const url = TROVES_QUERY;

  if (!url) {
    return null;
  }

  const {
    result: { rows: troves },
  } = await duneFetch({
    apiKey,
    url: `${url}`,
    validate: isDuneTroveResponse,
  });

  return troves.map((t) => ({
    owner: t.owner.match(/0x[a-fA-F0-9]{40}/)?.[0], // todo
    troveId: t.trove_id,
    collateralAsset: t.collateral_type,
    collateral: t.collateral,
    debt: t.debt,
    cr: t.collateral_ratio
  }));
};

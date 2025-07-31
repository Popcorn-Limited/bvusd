import { SP_DEPOSITS_QUERY } from "../../constants";
import { duneFetch, type DuneResponse, isDuneResponse } from "../../dune";

const isValidResponse = (
  data: unknown
): data is DuneResponse<{
  deposited_bold: number;
  collateral_type: string;
  depositor: string;
  depositor_age: string;
  last_modified: string;
  unclaimed_eth: number;
  unclaimed_bold: number;
}> =>
  isDuneResponse(data) &&
  data.result.rows.every(
    (row: unknown) =>
      typeof row === "object" &&
      row !== null &&
      "collateral_type" in row &&
      typeof row.collateral_type === "string" &&
      "created_time" in row &&
      typeof row.created_time === "string" &&
      "deposited_bold" in row &&
      typeof row.deposited_bold === "number" &&
      "depositor" in row &&
      typeof row.depositor === "string" &&
      "depositor_age" in row &&
      typeof row.depositor_age === "string" &&
      "last_modified" in row &&
      typeof row.last_modified === "string" &&
      "unclaimed_bold" in row &&
      typeof row.unclaimed_bold === "number" &&
      "unclaimed_eth" in row &&
      typeof row.unclaimed_eth === "number"
  );

export const fetchStabilityPoolDeposits = async ({
  apiKey,
  network,
}: {
  apiKey: string;
  network: "bnb" | "mainnet" | "katana";
}) => {
  const url = SP_DEPOSITS_QUERY;

  if (!url) {
    return null;
  }

  const {
    result: { rows: deposits },
  } = await duneFetch({
    apiKey,
    id: url,
    maxResults: "1000",
    validate: isValidResponse,
  });

  return deposits.map((t) => ({
    depositor: t.depositor.match(/0x[a-fA-F0-9]{40}/)?.[0], // todo
    collateral: t.collateral_type,
    time: t.last_modified,
    amount: t.deposited_bold,
  }));
};

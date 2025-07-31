import { bvUSD_HOLDERS } from "../../constants";
import { duneFetch, type DuneResponse, isDuneResponse } from "../../dune";

const isValidResponse = (
  data: unknown
): data is DuneResponse<{
    holder:string,
    balance:number,
    day:string
}> =>
  isDuneResponse(data) &&
  data.result.rows.every(
    (row: unknown) =>
      typeof row === "object" &&
      row !== null &&
      "holder" in row &&
      typeof row.holder === "string" &&
      "day" in row &&
      typeof row.day === "string" &&
      "balance" in row &&
      typeof row.balance === "number"
  );

export const fetchbvUSDHolders = async ({
  apiKey,
  network,
}: {
  apiKey: string;
  network: "bnb" | "mainnet" | "katana";
}) => {
  const id = bvUSD_HOLDERS;

  if (!id) {
    return null;
  }

  const {
    result: { rows: holders },
  } = await duneFetch({
    apiKey,
    id,
    maxResults: "1000",
    validate: isValidResponse,
  });

  return holders;
};

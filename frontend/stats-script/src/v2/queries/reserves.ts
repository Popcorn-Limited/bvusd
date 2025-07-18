import { RESERVES_QUERY } from "../../constants";
import { duneFetch, type DuneResponse, isDuneResponse } from "../../dune";

type ReserveEntry = {
  balance: number;
  day: string;
  symbol: string;
};

const isDuneValidResponse = (
  data: unknown
): data is DuneResponse<ReserveEntry> =>
  isDuneResponse(data) &&
  data.result.rows.length > 0 &&
  data.result.rows.every(
    (row: unknown) =>
      typeof row === "object" &&
      row !== null &&
      "symbol" in row &&
      typeof row.symbol === "string" &&
      "balance" in row &&
      typeof row.balance === "number" &&
      "day" in row &&
      typeof row.day === "string"
  );

export const fetchReservesFromDune = async ({
  apiKey,
  network,
}: {
  apiKey: string;
  network: "bnb" | "mainnet" | "katana";
}) => {
  const url = RESERVES_QUERY;

  if (!url) {
    return null;
  }

  const {
    result: { rows: reserves },
  } = await duneFetch({
    apiKey,
    url: `${url}`,
    validate: isDuneValidResponse,
  });

  const unique = new Set<string>();
  const result: ReserveEntry[] = [];

  for (const entry of reserves) {
    if (!unique.has(entry.symbol)) {
      unique.add(entry.symbol);
      result.push(entry);
    }
  }
  
  return result;
};

import { VAULT_APY } from "../../constants";
import { duneFetch, type DuneResponse, isDuneResponse } from "../../dune";

type Entry = {
  day: string;
  base: string;
  quote: string;
  share_price: number;
  apy: number;
};

const isDuneValidResponse = (data: unknown): data is DuneResponse<Entry> =>
  isDuneResponse(data) &&
  data.result.rows.every(
    (row: unknown) =>
      typeof row === "object" &&
      row !== null &&
      "day" in row &&
      typeof row.day === "string" &&
      "share_price" in row &&
      typeof row.share_price === "number" &&
      "base" in row &&
      typeof row.base === "string" &&
      "quote" in row &&
      typeof row.quote === "string" &&
      "apy" in row &&
      typeof row.apy === "number"
  );

export const fetchVaultAPYFromDune = async ({
  apiKey,
  network,
}: {
  apiKey: string;
  network: "bnb" | "mainnet" | "katana";
}) => {
  const url = VAULT_APY;

  if (!url) {
    return null;
  }

  const {
    result: { rows: apys },
  } = await duneFetch({
    apiKey,
    id: url,
    maxResults: "1000",
    validate: isDuneValidResponse,
  });

  return apys.map(apy => ({
    day: apy.day,
    apy: apy.apy,
    vault: apy.base,
  }));
};

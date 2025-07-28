import { STABLE_VAULT_TVL_QUERY } from "../../constants";
import { duneFetch, type DuneResponse, isDuneResponse } from "../../dune";
import { Decimal } from "@liquity/lib-base";

const isDuneTVLResponse = (
  data: unknown
): data is DuneResponse<{
  time: string;
  tvl: number;
}> =>
  isDuneResponse(data) &&
  data.result.rows.every(
    (row: unknown) =>
      typeof row === "object" &&
      row !== null &&
      "time" in row &&
      typeof row.time === "string" &&
      "tvl" in row &&
      typeof row.tvl === "number"
  );


export const fetchStableVaultTVLFromDune = async ({
  apiKey,
  network,
}: {
  apiKey: string;
  network: "bnb" | "mainnet" | "katana";
}) => {
  const url = STABLE_VAULT_TVL_QUERY;

  if (!url) {
    return Decimal.ZERO;
  }

  const {
    result: { rows: tvl },
  } = await duneFetch({
    apiKey,
    id: url,
    maxResults: "1000",
    validate: isDuneTVLResponse,
  });

  return tvl[0].tvl;
};

import { SUSHI_VOLUME } from "../../constants";
import { duneFetch, type DuneResponse, isDuneResponse } from "../../dune";

type Entry = {
  swap_count_7d: number;
  swap_count_1d: number;
  total_volume_7d: number;
  total_volume_1d: number;
  pool: string;
  token0: string;
  token1: string;
};

const isValidResponse = (data: unknown): data is DuneResponse<Entry> =>
  isDuneResponse(data) &&
  data.result.rows.every(
    (row: unknown) =>
      typeof row === "object" &&
      row !== null &&
      "pool" in row &&
      typeof row.pool === "string" &&
      "swap_count_7d" in row &&
      typeof row.swap_count_7d === "number" &&
      "swap_count_1d" in row &&
      typeof row.swap_count_1d === "number" &&
      "total_volume_7d" in row &&
      typeof row.total_volume_7d === "number" &&
      "total_volume_1d" in row &&
      typeof row.total_volume_1d === "number" &&
      "token0" in row &&
      typeof row.token0 === "string" &&
      "token1" in row &&
      typeof row.token1 === "string"
  );

export const fetchPoolVolume = async ({
  apiKey,
  network,
}: {
  apiKey: string;
  network: "bnb" | "mainnet" | "katana";
}) => {
  const url = SUSHI_VOLUME;

  if (!url) {
    return null;
  }

  const {
    result: { rows: poolStats },
  } = await duneFetch({
    apiKey,
    url: `${url}`,
    validate: isValidResponse,
  });

  return poolStats;
};

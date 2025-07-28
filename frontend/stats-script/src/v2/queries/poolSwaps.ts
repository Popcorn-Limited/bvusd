import { SUSHI_SWAPS } from "../../constants";
import { duneFetch, type DuneResponse, isDuneResponse } from "../../dune";

type Entry = {
  pool: string;
  sender: string;
  amount0: number;
  amount1: number;
  txHash: string;
  time: string;
  token0: string;
  token1: string;
  type: string;
};

const isValidResponse = (data: unknown): data is DuneResponse<Entry> =>
  isDuneResponse(data) &&
  data.result.rows.every(
    (row: unknown) =>
      typeof row === "object" &&
      row !== null &&
      "pool" in row &&
      typeof row.pool === "string" &&
      "sender" in row &&
      typeof row.sender === "string" &&
      "amount0" in row &&
      typeof row.amount0 === "number" &&
      "amount1" in row &&
      typeof row.amount1 === "number" &&
      "txHash" in row &&
      typeof row.txHash === "string" &&
      "time" in row &&
      typeof row.time === "string" &&
      "token0" in row &&
      typeof row.token0 === "string" &&
      "token1" in row &&
      typeof row.token1 === "string" &&
      "type" in row &&
      typeof row.type === "string"
  );

export const fetchPoolSwaps = async ({
  apiKey,
  network,
}: {
  apiKey: string;
  network: "bnb" | "mainnet" | "katana";
}) => {
  const url = SUSHI_SWAPS;

  if (!url) {
    return null;
  }

  const {
    result: { rows: poolSwaps },
  } = await duneFetch({
    apiKey,
    url: `${url}`,
    validate: isValidResponse,
  });

  return poolSwaps;
};

import { MFONE_PRICE } from "../../constants";

import { duneFetch, type DuneResponse, isDuneResponse } from "../../dune";

type PricePoint = {
  price: number;
  time: string;
};

const isDuneSpAverageApyResponse = (
  data: unknown
): data is DuneResponse<{
  event_price: number;
  evt_block_time: string;
}> =>
  isDuneResponse(data) &&
  data.result.rows.length > 0 &&
  data.result.rows.every(
    (row: unknown) =>
      typeof row === "object" &&
      row !== null &&
      "event_price" in row &&
      typeof row.event_price === "number" &&
      "evt_block_time" in row &&
      typeof row.evt_block_time === "string"
  );

export const fetchMFOneVaultPrice = async ({
  apiKey,
  network,
}: {
  apiKey: string;
  network: "bnb" | "mainnet" | "katana";
}) => {
  // const url = network === "sepolia"
  //   ? DUNE_SPV2_AVERAGE_APY_URL_SEPOLIA
  //   : DUNE_SPV2_AVERAGE_APY_URL_MAINNET;

  const url = MFONE_PRICE;

  // disabled when DUNE_SPV2_AVERAGE_APY_URL_* is null
  if (!url) {
    return null;
  }

  const {
    result: { rows },
  } = await duneFetch({
    apiKey,
    id: url,
    maxResults: "10",
    validate: isDuneSpAverageApyResponse,
  });

  console.log(rows);

  const data: PricePoint[] = rows.map((r) => ({
    price: r.event_price,
    time: r.evt_block_time,
  }));

  return monthlyAPY(data);
};

function monthlyAPY(
  data: PricePoint[]
): { month: string; apy: number }[] {
  const parsed = data
    .map((d) => ({
      price: d.price,
      date: new Date(d.time),
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const monthlyGroups: Record<string, { price: number; date: Date }[]> = {};

  for (const point of parsed) {
    const key = `${point.date.getUTCFullYear()}-${(point.date.getUTCMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
    if (!monthlyGroups[key]) monthlyGroups[key] = [];
    monthlyGroups[key].push(point);
  }

  const results: { month: string; apy: number }[] = [];

  for (const [month, points] of Object.entries(monthlyGroups)) {
    const start = points[0];
    const end = points[points.length - 1];

    const days =
      (end.date.getTime() - start.date.getTime()) / (1000 * 60 * 60 * 24);
    const totalReturn = end.price / start.price;

    if (days <= 0) continue;

    const avgDailyReturn = Math.pow(totalReturn, 1 / days) - 1;
    const monthlyAPY = Math.pow(1 + avgDailyReturn, 30) - 1;

    results.push({ month, apy: monthlyAPY * 100 });
  }

  return results;
}

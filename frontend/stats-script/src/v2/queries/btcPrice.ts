import { BTC_PRICE } from "../../constants";

import { duneFetch, type DuneResponse, isDuneResponse } from "../../dune";

type PricePoint = {
  price: number;
  time: string;
};

const isDuneValidResponse = (
  data: unknown
): data is DuneResponse<{
  btc_price: number;
  day: string;
}> =>
  isDuneResponse(data) &&
  data.result.rows.length > 0 &&
  data.result.rows.every(
    (row: unknown) =>
      typeof row === "object" &&
      row !== null &&
      "btc_price" in row &&
      typeof row.btc_price === "number" &&
      "day" in row &&
      typeof row.day === "string"
  );

export const fetchDailyBTCPrice = async ({
  apiKey,
  network,
}: {
  apiKey: string;
  network: "bnb" | "mainnet" | "katana";
}) => {
  // const url = network === "sepolia"
  //   ? DUNE_SPV2_AVERAGE_APY_URL_SEPOLIA
  //   : DUNE_SPV2_AVERAGE_APY_URL_MAINNET;

  const url = BTC_PRICE;

  // disabled when DUNE_SPV2_AVERAGE_APY_URL_* is null
  if (!url) {
    return null;
  }

  const {
    result: { rows },
  } = await duneFetch({
    apiKey,
    id: url,
    maxResults: "1000",
    validate: isDuneValidResponse,
  });

  //   console.log(rows);
  return monthlyAvgPrice(
    rows.map((r) => ({
      time: r.day.substring(0, 10),
      price: r.btc_price,
    }))
  );
};

function monthlyAvgPrice(
  data: PricePoint[]
): { month: string; average: number }[] {
  // Parse and sort the data
  const parsed = data
    .map((d) => ({
      date: new Date(d.time),
      price: d.price,
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const monthlyGroups: Record<string, number[]> = {};

  parsed.forEach((point) => {
    const key = `${point.date.getUTCFullYear()}-${String(
      point.date.getUTCMonth() + 1
    ).padStart(2, "0")}`;
    if (!monthlyGroups[key]) {
      monthlyGroups[key] = [];
    }
    monthlyGroups[key].push(point.price);
  });

  // avg
  const result: { month: string; average: number }[] = [];

  for (const [month, prices] of Object.entries(monthlyGroups)) {
    const avg = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    result.push({ month, average: avg });
  }

  return result;
}

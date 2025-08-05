import { BTC_PRICE, MFONE_PRICE } from "../../constants";

import { duneFetch, type DuneResponse, isDuneResponse } from "../../dune";

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
  return rows.map((r) => ({
    time: r.day.substring(0,10),
    price: r.btc_price
  }));
};
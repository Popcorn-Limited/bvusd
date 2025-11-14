import { BGBTC, ENZO_BTC } from "../../constants";
import { duneFetch, type DuneResponse, isDuneResponse } from "../../dune";

const isDuneValidResponse = (
  data: unknown
): data is DuneResponse<{time: number, amount: number}> =>
  isDuneResponse(data) &&
  data.result.rows.every(
    (row: unknown) =>
      typeof row === "object" &&
      row !== null &&
      "time" in row &&
      typeof row.time === "string" &&
      "amount" in row &&
      typeof row.amount === "number"
  );

export const fetchBTCReserves = async (apiKey: string) => {
  const bgBTC = BGBTC;
  const enzoBTC = ENZO_BTC;

  if (!bgBTC || !enzoBTC) {
    return 0;
  }

  const {
    result: { rows: bgBTCAmount },
  } = await duneFetch({
    apiKey,
    id: bgBTC,
    maxResults: "1000",
    validate: isDuneValidResponse,
  });

  const {
    result: { rows: enzoBTCAmount },
  } = await duneFetch({
    apiKey,
    id: enzoBTC,
    maxResults: "1000",
    validate: isDuneValidResponse,
  });

  console.log({enzoBTCAmount, bgBTCAmount})

  return enzoBTCAmount[0]?.amount + bgBTCAmount[0]?.amount;
};

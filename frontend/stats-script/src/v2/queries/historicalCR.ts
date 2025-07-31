import { COLLATERAL_RATIO_QUERY } from "../../constants";
import { duneFetch, type DuneResponse, isDuneResponse } from "../../dune";

const isDuneHistoricalCRResponse = (
  data: unknown
): data is DuneResponse<{
  hour: string;
  col_ratio_perc: number;
  avg_col_ratio_perc: number;
  collateral_type: string;
}> =>
  isDuneResponse(data) &&
  data.result.rows.every(
    (row: unknown) =>
      typeof row === "object" &&
      row !== null &&
      "hour" in row &&
      typeof row.hour === "string" &&
      "col_ratio_perc" in row &&
      typeof row.col_ratio_perc === "number" &&
      "avg_col_ratio_perc" in row &&
      typeof row.avg_col_ratio_perc === "number" &&
      "collateral_type" in row &&
      typeof row.collateral_type === "string"
  );



  export const fetchHistCRFromDune = async ({
    apiKey,
    network,
  }: {
    apiKey: string;
    network: "bnb" | "mainnet" | "katana";
  }) => {
    // TODO use network for different queries
    const url = COLLATERAL_RATIO_QUERY;
  
    if (!url) {
      return null;
    }
  
    const {
      result: { rows: histCR },
    } = await duneFetch({
      apiKey,
      id: url,
      maxResults: "1000",
      validate: isDuneHistoricalCRResponse,
    });
  
    return histCR;
  };
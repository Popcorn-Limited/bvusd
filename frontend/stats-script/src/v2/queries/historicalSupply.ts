import { BOLD_SUPPLY_DAILY_QUERY } from "../../constants";
import { duneFetch, type DuneResponse, isDuneResponse } from "../../dune";

const emptySupplyData = () =>
  Promise.resolve([
    {
      day: "",
      holders: 0,
      supply: 0,
    },
  ]);

const isDuneHistoricalSupplyResponse = (
  data: unknown
): data is DuneResponse<{
  day: string;
  num_holders: number;
  total_supply: number;
}> =>
  isDuneResponse(data) &&
  data.result.rows.every(
    (row: unknown) =>
      typeof row === "object" &&
      row !== null &&
      "day" in row &&
      typeof row.day === "string" &&
      "num_holders" in row &&
      typeof row.num_holders === "number" &&
      "total_supply" in row &&
      typeof row.total_supply === "number"
  );



export const fetchHistSupplyFromDune = async ({
    apiKey,
    network,
  }: {
    apiKey: string;
    network: "bnb" | "mainnet" | "katana";
  }) => {
    // TODO use network for different queries
    const url = BOLD_SUPPLY_DAILY_QUERY;
  
    if (!url) {
      return emptySupplyData();
    }
  
    const {
      result: { rows: histSupply },
    } = await duneFetch({
      apiKey,
      id: url,
      maxResults: "1000",
      validate: isDuneHistoricalSupplyResponse,
    });
  
    return histSupply.map((daily) => {
      return {
        day: daily.day,
        holders: daily.num_holders,
        supply: daily.total_supply,
      };
    });
  };
  
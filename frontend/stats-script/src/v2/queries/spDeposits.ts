import { SP_DEPOSITS_QUERY } from "../../constants";
import { duneFetch, type DuneResponse, isDuneResponse } from "../../dune";


// collateral_type: 'rETH',
//     contract_address: '0xd442e41019b7f5c4dd78f50dc03726c446148695',
//     created_time: '2025-06-06 12:54:35.000 UTC',
//     deposited_bold: 1301260.335407139,
//     depositor: "<a href='https://etherscan.io/address/0x50bd66d59911f5e086ec87ae43c811e0d059dd11' target='_blank'>0x50b...dd11</a>",
//     depositor_age: '6 weeks',
//     last_modified: '2025-07-18 01:30:59.000 UTC',
//     unclaimed_bold: 0,
//     unclaimed_eth: 0

const isValidResponse = (
  data: unknown
): data is DuneResponse<{
  deposited_bold: number;
  collateral_type: string;
  depositor: string;
  depositor_age: string;
  last_modified: string;
  unclaimed_eth: number;
  unclaimed_bold: number;
}> =>
  isDuneResponse(data) &&
  data.result.rows.length > 0 &&
  data.result.rows.every(
    (row: unknown) =>
      typeof row === "object" &&
      row !== null &&
      "collateral_type" in row &&
      typeof row.collateral_type === "string" &&
      "created_time" in row &&
      typeof row.created_time === "string" &&
      "deposited_bold" in row &&
      typeof row.deposited_bold === "number" &&
      "depositor" in row &&
      typeof row.depositor === "string" &&
      "depositor_age" in row &&
      typeof row.depositor_age === "string" &&
      "last_modified" in row &&
      typeof row.last_modified === "string" &&
      "unclaimed_bold" in row &&
      typeof row.unclaimed_bold === "number" &&
      "unclaimed_eth" in row &&
      typeof row.unclaimed_eth === "number"
  );

export const fetchStabilityPoolDeposits = async ({
  apiKey,
  network,
}: {
  apiKey: string;
  network: "bnb" | "mainnet" | "katana";
}) => {
  const url = SP_DEPOSITS_QUERY;

  if (!url) {
    return null;
  }

  const {
    result: { rows: deposits },
  } = await duneFetch({
    apiKey,
    url: `${url}`,
    validate: isValidResponse,
  });

  return deposits.map((t) => ({
    depositor: t.depositor.match(/0x[a-fA-F0-9]{40}/)?.[0], // todo
    time: t.last_modified,
    amount: t.deposited_bold
  }));
};

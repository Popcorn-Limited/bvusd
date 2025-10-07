"use server";

import type { TypedDocumentString } from "@/src/graphql/graphql";
import type { Token, TokenSymbol } from "@/src/types";

import * as v from "valibot";
import { Address } from "viem";

import { getProtocolContract } from "./contracts";
import { fmtnum } from "./formatting";

export type EnsoForecast = {
  value: string;
  status: "idle" | "loading" | "success" | "error";
};

interface EnsoRouteProps {
  inputValue: string;
  inputSymbol: Token["symbol"];
  outputSymbol: Token["symbol"];
  account: Address;
  slippage?: number;
}

export async function getOutputValue({
  inputValue,
  inputSymbol,
  outputSymbol,
  account,
  slippage = 50,
}: EnsoRouteProps): Promise<EnsoForecast> {
  if (!inputValue || inputValue === "0") {
    return { value: "0", status: "success" };
  }

  const url =
    `https://api.enso.finance/api/v1/shortcuts/route?chainId=747474&slippage=${slippage}&destinationChainId=747474&receiver=${account}&spender=${account}&refundReceiver=${account}&fromAddress=${account}&amountIn=${inputValue}&tokenIn=${
      getProtocolContract(inputSymbol).address
    }&tokenOut=${getProtocolContract(outputSymbol).address}&routingStrategy=router`;
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${process.env.ENSO_API_KEY}`,
    },
    body: undefined,
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (data.error) {
      return { value: "0", status: "error" };
    }
    return {
      value: fmtnum(
        Number(data.amountOut) / 10 ** (outputSymbol.includes("bvUSD") ? 18 : 6),
      ),
      status: "success",
    };
  } catch (error) {
    return { value: "0", status: "error" };
  }
}

export async function getEnsoRoute({
  inputValue,
  inputSymbol,
  outputSymbol,
  account,
  slippage = 50,
}: EnsoRouteProps): Promise<any> {
  const url =
    `https://api.enso.finance/api/v1/shortcuts/route?chainId=747474&slippage=${slippage}&destinationChainId=747474&receiver=${account}&spender=${account}&refundReceiver=${account}&fromAddress=${account}&amountIn=${inputValue}&tokenIn=${
      getProtocolContract(inputSymbol).address
    }&tokenOut=${getProtocolContract(outputSymbol).address}&routingStrategy=router`;
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${process.env.ENSO_API_KEY}`,
    },
    body: undefined,
  };

  const response = await fetch(url, options);
  const data = await response.json();
  return data;
}

export async function getDefiLlamaPrices(defiLlamaTokenIds: {}): Promise<any> {
  const url = new URL(
    `https://pro-api.llama.fi/${process.env.DEFILLAMA_API_KEY}/coins/prices/current/ethereum:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2,ethereum:0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599,ethereum:0xB8c77482e45F1F44dE1745F52C74426C631bDD52`,
  );

  const headers: HeadersInit = { accept: "application/json" };

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch price for ${
        Object.keys(defiLlamaTokenIds).join(
          ",",
        )
      }`,
    );
  }

  const result = await response.json();
  return result;
}

type CoinGeckoIDs = {
  [key in TokenSymbol & ("BVBTC")]: string;
};

export async function getCoingeckoPrice(coinGeckoTokenIds: CoinGeckoIDs): Promise<any> {
  const url = new URL("https://api.coingecko.com/api/v3/simple/price");
  url.searchParams.set("vs_currencies", "usd");
  url.searchParams.set("ids", Object.values(coinGeckoTokenIds).join(","));

  const headers: HeadersInit = { accept: "application/json" };

  const [apiType, apiKey] = process.env.COINGECKO_API_KEY.split("|");

  if (apiType === "demo") {
    headers["x-cg-demo-api-key"] = apiKey;
  } else if (apiType === "pro") {
    headers["x-cg-pro-api-key"] = apiKey;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch price for ${
        Object.keys(coinGeckoTokenIds).join(
          ",",
        )
      }`,
    );
  }

  const result = v.parse(
    v.object(
      v.entriesFromList(
        Object.values(coinGeckoTokenIds),
        v.object({ usd: v.number() }),
      ),
    ),
    await response.json(),
  );
  return result;
}

export async function getGraphQuery<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  variables: TVariables,
): Promise<any> {
  const response = await fetch(process.env.SUBGRAPH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/graphql-response+json",
      "Authorization": `Bearer ${process.env.SUBGRAPH_API_KEY}`,
    },
    body: JSON.stringify(
      { query, variables },
      (_, value) => typeof value === "bigint" ? String(value) : value,
    ),
  });

  if (!response.ok) {
    throw new Error("Error while fetching data from the subgraph");
  }

  const result = await response.json();
  return result;
}
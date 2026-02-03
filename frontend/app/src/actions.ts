"use server";

import type { TypedDocumentString } from "@/src/graphql/graphql";
import type { Token, TokenSymbol } from "@/src/types";
import { createClient } from "@supabase/supabase-js";
import * as v from "valibot";
import { Address } from "viem";
import { fmtnum } from "./formatting";
import { ChainEnv } from "./services/ChainConfigProvider";

type EnsoForecast = {
  value: string;
  status: "idle" | "loading" | "success" | "error";
};

interface EnsoRouteProps {
  chainConfig: ChainEnv;
  inputValue: string;
  inputAddress: string;
  outputAddress: string;
  account: Address;
  slippage?: number;
}

export async function getOutputValue({
  chainConfig,
  inputValue,
  inputAddress,
  outputAddress,
  decimals,
  account,
  slippage = 50,
}: EnsoRouteProps & { decimals: number }): Promise<EnsoForecast> {
  if (!inputValue || inputValue === "0") {
    return { value: "0", status: "success" };
  }
  const url = `https://api.enso.finance/api/v1/shortcuts/route?chainId=${chainConfig.CHAIN_ID}&slippage=${slippage}&destinationChainId=${chainConfig.CHAIN_ID}&receiver=${account}&spender=${account}&refundReceiver=${account}&fromAddress=${account}&amountIn=${inputValue}&tokenIn=${inputAddress}&tokenOut=${outputAddress}&routingStrategy=router`;
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
      value: fmtnum(Number(data.amountOut) / 10 ** decimals),
      status: "success",
    };
  } catch (error) {
    return { value: "0", status: "error" };
  }
}

export async function getEnsoRoute({
  chainConfig,
  inputValue,
  inputAddress,
  outputAddress,
  account,
  slippage = 50,
}: EnsoRouteProps): Promise<any> {
  const url = `https://api.enso.finance/api/v1/shortcuts/route?chainId=${chainConfig.CHAIN_ID}&slippage=${slippage}&destinationChainId=${chainConfig.CHAIN_ID}&receiver=${account}&spender=${account}&refundReceiver=${account}&fromAddress=${account}&amountIn=${inputValue}&tokenIn=${inputAddress}&tokenOut=${outputAddress}&routingStrategy=router`;
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
    `https://pro-api.llama.fi/${process.env.DEFILLAMA_API_KEY}/coins/prices/current/ethereum:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2,ethereum:0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599,ethereum:0xB8c77482e45F1F44dE1745F52C74426C631bDD52`
  );

  const headers: HeadersInit = { accept: "application/json" };

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch price for ${Object.keys(defiLlamaTokenIds).join(",")}`
    );
  }

  const result = await response.json();
  return result;
}

type CoinGeckoIDs = {
  [key in TokenSymbol & "BVBTC"]: string;
};

export async function getCoingeckoPrice(
  coinGeckoTokenIds: CoinGeckoIDs
): Promise<any> {
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
      `Failed to fetch price for ${Object.keys(coinGeckoTokenIds).join(",")}`
    );
  }

  const result = v.parse(
    v.object(
      v.entriesFromList(
        Object.values(coinGeckoTokenIds),
        v.object({ usd: v.number() })
      )
    ),
    await response.json()
  );
  return result;
}

export async function getGraphQuery<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  variables: TVariables
): Promise<any> {
  const response = await fetch(process.env.SUBGRAPH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/graphql-response+json",
      Authorization: `Bearer ${process.env.SUBGRAPH_API_KEY}`,
    },
    body: JSON.stringify({ query, variables }, (_, value) =>
      typeof value === "bigint" ? String(value) : value
    ),
  });

  if (!response.ok) {
    throw new Error("Error while fetching data from the subgraph");
  }

  const result = await response.json();
  return result;
}

type Assets = {
  [key: string]: boolean;
};

type InstititutionalRequest = {
  name: string;
  email: string;
  telegram: string;
  amount: string;
  assets: Assets;
  newsletter: boolean;
};

export async function postInstitutionalRequest(
  req: InstititutionalRequest
): Promise<any> {
  try {
    const { name, email, telegram, amount, assets, newsletter } = req;

    const assetsArray = Object.keys(assets)
      .filter((key) => assets[key])
      .join(", ");

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );

    const { data, error } = await supabase
      .from("Instititutional")
      .insert([
        { name, email, telegram, amount, assets: assetsArray, newsletter },
      ])
      .select();

    if (error) {
      return { error: "Supabase error" };
    }

    return { data };
  } catch {
    return { error: "Invalid body" };
  }
}

type WhitelistRequest = {
  email: string;
  telegram: string;
  evmAddress: string;
  newsletter: boolean;
};

export type Referral = {
  referrer: string;
  user: string;
  created_at: string;
};

export async function postWhitelistRequest(
  req: WhitelistRequest
): Promise<any> {
  try {
    const { email, telegram, evmAddress, newsletter } = req;

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );
    const { data, error } = await supabase
      .from("Whitelist")
      .insert([{ email, telegram, evmAddress, newsletter }])
      .select();

    if (error) {
      console.log("2");
      return { error: "Supabase error" };
    }

    return { data };
  } catch {
    console.log("3");
    return { error: "Invalid body" };
  }
}

export async function addReferral(
  referrerAddress: string,
  userAddress: string
): Promise<any> {
  console.log(process.env.SUPABASE_URL);
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );

    // check if user has already a referral
    const { data: existingRefs } = await supabase
      .from("referalls")
      .select("*")
      .eq("user", userAddress);

    if (existingRefs.length === 0) {
      const { error } = await supabase.from("referalls").insert([
        {
          referrer: referrerAddress,
          user: userAddress,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.log("Error adding referral", error);
        return { error: "Error adding referral" };
      }

      return { data: "Ref added" };
    } else {
      console.log("Already referred")
      return { data: "Already referred" };
    }
  } catch (error) {
    console.log("Error adding referral", error);
    return { error: "Error adding referral" };
  }
}

export async function getUserReferrals(userAddress: string): Promise<Referral[]> {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );

    const { data: ref, error } = await supabase
      .from("referalls")
      .select("*")
      .eq("user", userAddress);

    if (error) {
      console.log("Error fetching referral", error);
      return [];
    }
    return ref;
  } catch (error) {
    console.log("Error fetching referral 2", error);
    return [];
  }
}

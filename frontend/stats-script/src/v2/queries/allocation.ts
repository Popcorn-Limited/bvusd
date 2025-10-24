import axios from "axios";
import allocations from "../../allocations.json";
import { getParadexTVL, getParadexWalletData } from "./paradex";

type Res = {
  label: string;
  usdValue: string;
  wallet: string;
};

const FILTERED_ASSETS = [
  "PT Autonomous Liquidity USD 11DEC2025",
  "AI Chain Coin"
]

export const getAllocations = async (debank: string) => {
  let res: Res[] = [];

  for (const allocation of allocations.allocations) {
    const usd_value = await getAllocation(debank, allocation.wallet);
    res.push({
      label: allocation.label,
      usdValue: usd_value.toString(),
      wallet: allocation.wallet,
    });
  }
  return res;
};

const getAllocation = async (debank: string, wallet: string) => {
  const { data: holdingsData } = await axios.get(
    "https://pro-openapi.debank.com/v1/user/total_balance",
    {
      params: {
        id: wallet,
      },
      headers: {
        accept: "application/json",
        AccessKey: debank,
      },
    }
  );
  
  return wallet === "0x353F009029f35D743d4d14D390d66813d28FE4E6"
    ? holdingsData.total_usd_value + 293447.34 + await getParadexTVL()
    : holdingsData.total_usd_value;
};

type Allo = {
  balance: string;
  logo: string;
  chains: string[];
};

export const getTokenAllocations = async (debank: string) => {
  const global = new Map<string, Allo>();

  for (const allocation of allocations.allocations) {
    const { data: holdingsData } = await axios.get(
      "https://pro-openapi.debank.com//v1/user/all_token_list",
      {
        params: {
          id: allocation.wallet,
        },
        headers: {
          accept: "application/json",
          AccessKey: debank,
        },
      }
    );

    const protocolRes = await fetch(
      `https://pro-openapi.debank.com/v1/user/all_simple_protocol_list?id=${allocation.wallet}&chain_ids=eth,arb`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          AccessKey: debank,
        },
      }
    );
    const protocolData = await protocolRes.json();

    const paradex = allocation.paradex
      ? await getParadexWalletData()
      : { positions: [] };

    const hardcodedDeltaNeutral = [
      {
        asset: "PT-mHYPER-20NOV2025",
        balance: "293447.34",
        logo: "https://static.debank.com/image/project/logo_url/pendle2/d5cfacd3b8f7e0ec161c0de9977cabbd.png",
        chain: "arb",
      },
      ...paradex.positions,
    ];

    let data = [
      ...protocolData
        .filter((d) => d.net_usd_value >= 1000 && !FILTERED_ASSETS.includes(d.name))
        .map((item) => {
          return {
            asset: item.name,
            chain: item.chain,
            balance: item.net_usd_value,
            logo: item.logo_url,
          };
        }),

      ...holdingsData
        .filter((d) => d.amount * d.price >= 1000 && !FILTERED_ASSETS.includes(d.name))
        .map((h) => {
          return {
            asset: h.name,
            balance: h.amount * h.price,
            logo: h.logo_url,
            chain: h.chain,
          };
        }),
    ];

    allocation.wallet === "0x353F009029f35D743d4d14D390d66813d28FE4E6"
      ? data.push(...hardcodedDeltaNeutral)
      : null;

    for (const { asset, balance, logo, chain } of data) {
      const prev = global.get(asset);

      if (!prev) {
        global.set(asset, {
          balance: balance.toString(),
          logo: logo ?? "",
          chains: [chain],
        });
        continue;
      }

      // sum amount
      const allChains = prev.chains.includes(chain)
        ? prev.chains
        : [...prev.chains, chain];

      global.set(asset, {
        balance: (Number(prev.balance) + balance).toString(),
        logo,
        chains: allChains,
      });
    }
  }

  const globalArr = [...global].map(([asset, amount]) => ({
    asset,
    ...amount,
  }));
  return globalArr;
};

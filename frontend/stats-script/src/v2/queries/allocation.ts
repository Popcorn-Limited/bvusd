import axios from "axios";
import allocations from "../../allocations.json";

type Res = {
  label: string;
  usdValue: string;
  wallet: string;
};

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

  return holdingsData.total_usd_value;
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

    const balances = holdingsData
      .filter((d) => d.price > 0 && d.amount >= 0.001)
      .map((h) => {
        return { asset: h.name, balance: h.amount * h.price, logo: h.logo_url, chain: h.chain };
      });

    for (const { asset, balance, logo, chain } of balances) {
      const prev = global.get(asset);

      if (!prev) {
        global.set(asset, { balance: balance.toString(), logo: logo ?? "", chains: [chain] });
        continue;
      }

      // sum amount
      const allChains = prev.chains.includes(chain) ? prev.chains : [...prev.chains, chain];

      global.set(asset, { balance: (Number(prev.balance) + balance).toString(), logo, chains: allChains });
    }
  }

  const globalArr = [...global].map(([asset, amount]) => ({
    asset,
    ...amount,
  }));
  return globalArr;
};

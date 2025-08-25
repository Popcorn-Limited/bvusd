import axios from "axios";
import allocations from "../../allocations.json";

type Res = {
  label: string;
  usdValue: string;
};

export const getAllocations = async (debank: string) => {
  let res: Res[] = [];

  for (const allocation of allocations) {
    const usd_value = await getAllocation(debank, allocation.wallet);
    res.push({ label: allocation.label, usdValue: usd_value.toString() });
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

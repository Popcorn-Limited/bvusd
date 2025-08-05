import type { BlockTag, Provider } from "@ethersproject/abstract-provider";
import { BigNumber } from "@ethersproject/bignumber";
import { Decimal } from "@liquity/lib-base";
import { fetchMFOneVaultPrice } from "./queries";

const mapObj = <T extends Record<string, any>, U>(
  t: T,
  f: (v: T[keyof T]) => U
) =>
  Object.fromEntries(Object.entries(t).map(([k, v]) => [k, f(v)])) as {
    [K in keyof T]: U;
  };

type FetchConfig = {
  apiKey: string;
  network: "katana" | "mainnet";
};

export const fetchAllStrategies = async ({
  provider,
  duneKey,
}: {
  provider: Provider;
  duneKey: string;
}) => {
  const fetchConfig: FetchConfig = {
    apiKey: duneKey,
    network: "mainnet",
  };

  const [mfOnePrice] = await Promise.all([
    // mf one vault price
    fetchMFOneVaultPrice(fetchConfig),
  ]);

  return {
    mfOnePrice: mfOnePrice!.map((price) =>
      mapObj(
        {
          ...price,
        },
        (x) => `${x}`
      )
    ),
  };
};

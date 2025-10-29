import type { BlockTag, Provider } from "@ethersproject/abstract-provider";
import { Decimal } from "@liquity/lib-base";
import {
  getContracts,
  VaultsDeployment,
  erc20Abi,
  type LiquityV2Deployment,
  ERC20,
} from "./contracts";
import {  
  fetchHistSupplyFromDune,
  fetchStableVaultTVLFromDune,
  decimalify,
  fetchVaultAPYFromDune,
  latestApyByVault
} from "./queries";
import { Contract } from "@ethersproject/contracts";

const mapObj = <T extends Record<string, any>, U>(
  t: T,
  f: (v: T[keyof T]) => U
) =>
  Object.fromEntries(Object.entries(t).map(([k, v]) => [k, f(v)])) as {
    [K in keyof T]: U;
  };

type FetchConfig = {
  apiKey: string;
  network: "katana" | "bnb";
};

export const fetchV2Stats = async ({
  provider,
  ethProvider,
  deployment,
  vaults,
  blockTag = "latest",
  duneKey,
}: {
  provider: Provider;
  ethProvider: Provider;
  deployment: LiquityV2Deployment;
  vaults: VaultsDeployment;
  blockTag?: BlockTag;
  duneKey: string;
}) => {

  const contracts = getContracts(provider, deployment);

  const fetchConfig: FetchConfig = {
    apiKey: duneKey,
    network: "katana",
  };

  // counts all assets (stables) in the vaults safes
  // TODO multichain
  const reserves = await Promise.all(
    vaults.stableVaults.map(async (vault) => {
      const asset = new Contract(
        vault.asset,
        erc20Abi,
        provider
      ) as unknown as ERC20;
      return {
        asset: vault.symbol,
        balance:
          Number(await asset.balanceOf(vault.safe, { blockTag })) /
          10 ** vault.assetDecimals,
        wallet: vault.safe,
        chain: vault.chain,
      };
    })
  );

  const sbvUSD = await Promise.all(
    vaults.sbvUSD.map(async (vault) => {
      const c = new Contract(
        vault.address,
        erc20Abi,
        vault.chain === "Katana" ? provider : ethProvider
      ) as unknown as ERC20;
      return {
        address: vault.address,
        supply: Number(await c.totalSupply({ blockTag })) / 10 ** 18,
        safe: vault.safe,
        chain: vault.chain,
      };
    })
  );

  const mainnetBVUSD =  new Contract(
    "0x9bc2f611fa2196e097496b722f1cbcdfe2303855",
    erc20Abi,
    ethProvider
  ) as unknown as ERC20; 

  const mainnetBVUSDSupply = await mainnetBVUSD.totalSupply({ blockTag }).then(decimalify);

  const deployed = true;

  const [
    total_bold_supply,
    historicalSupply,
    vault_tvl,
    vaultsApy,
  ] = deployed
    ? await Promise.all([
        // total bvUSD supply
        (await contracts.boldToken.totalSupply({ blockTag }).then(decimalify)).add(mainnetBVUSDSupply),

        // HISTORICAL SUPPLY
        fetchHistSupplyFromDune(fetchConfig),

        // TVL
        fetchStableVaultTVLFromDune(fetchConfig),

        // vaults daily apy
        fetchVaultAPYFromDune(fetchConfig),
      ])
    : await Promise.all([
        Decimal.ZERO, // total_bold_supply
        null, // historicalSupply
        Decimal.ZERO, // vault_tvl
        null,
      ]);

  const apyMap = latestApyByVault(vaultsApy!);

  return {
    total_bold_supply: `${total_bold_supply}`,
    total_vault_tvl: `${vault_tvl}`,
    total_reserve: `${reserves.map((r) => r.balance).reduce((a, b) => a + b)}`,
    reserves_assets: reserves!.map((r) =>
      mapObj(
        {
          ...r,
        },
        (x) => `${x}`
      )
    ),
    sbvUSD: sbvUSD!.map((r) =>
      mapObj(
        {
          ...r,
          apy7: apyMap.get(r.address.trim().toLowerCase())?.apy7 ?? "0",
          apy30: apyMap.get(r.address.trim().toLowerCase())?.apy30 ?? "0",
        },
        (x) => `${x}`
      )
    ),
    day_supply: historicalSupply!.map((daily) =>
      mapObj(
        {
          ...daily,
        },
        (x) => `${x}`
      )
    ),
    vaultsApy: vaultsApy!.map((apy) =>
      mapObj(
        {
          ...apy,
        },
        (x) => `${x}`
      )
    ),
  };
};

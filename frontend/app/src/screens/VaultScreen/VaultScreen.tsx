"use client";

import { Screen } from "@/src/comps/Screen/Screen";
import { TokenIcon, TokenSymbol } from "@liquity2/uikit";
import { VaultPanel } from "./VaultPanel";
import { VaultFAQPanel } from "./VaultFAQPanel";
import { getAllVaults } from "@/src/config/chains";
import { useChainConfig } from "@/src/services/ChainConfigProvider";
import { ProductCard } from "@/src/comps/ProductCard/ProductCard";
import { ProductCardGroup } from "@/src/comps/ProductCard/ProductCardGroup";
import { Field } from "@/src/comps/Field/Field";

export function VaultPoolScreen({ asset }: { asset: string }) {
  const { chainConfig } = useChainConfig();

  const vaultAsset = asset ? asset.split("-")[0] : "bvUSD";
  const { vaults } = getAllVaults();
  const vault = vaults[asset];

  // switch to mainnet if it's a bvUSD vault
  const chainId =
    vault !== undefined
      ? vault.chainId
      : chainConfig.CHAIN_ID !== 1 && chainConfig.CHAIN_ID !== 747474
        ? 1
        : chainConfig.CHAIN_ID;

  const chainName = vault !== undefined ? vault.chainName : chainConfig.CHAIN_NAME;
  return (
    <Screen
      ready={true}
      back={{ href: "/vaults", label: "Back to Vaults" }}
    >
      <VaultPanel vault={vault} symbol={vaultAsset} chainId={chainId} chainName={chainName} />
      <VaultFAQPanel />      
    </Screen>
  );
}

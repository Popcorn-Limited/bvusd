"use client";

import { Screen } from "@/src/comps/Screen/Screen";
import { VaultPanel } from "./VaultPanel";
import { VaultFAQPanel } from "./VaultFAQPanel";
import { getAllVaults } from "@/src/config/chains";
import { useChainConfig } from "@/src/services/ChainConfigProvider";

export function VaultPoolScreen({ asset, referralCode }: { asset: string, referralCode: string }) {
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
  const isHomeLink = ["sWBTC", undefined].includes(vault?.outputSymbol)
  
  return (
    <Screen
      ready={true}
      back={{ href: isHomeLink ? "/" : "/vaults", label: isHomeLink ? "Back to Home" : "Back to Vaults" }}
    >
      <VaultPanel vault={vault} symbol={vaultAsset} chainId={chainId} chainName={chainName} referralCode={referralCode} />
      <VaultFAQPanel vaultAddress={vault?.address}/>      
    </Screen>
  );
}

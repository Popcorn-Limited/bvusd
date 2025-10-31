"use client";

import { Screen } from "@/src/comps/Screen/Screen";
import content from "@/src/content";
import { css } from "@/styled-system/css";
import { HFlex } from "@liquity2/uikit";
import { VaultPanel } from "./VaultPanel";
import { VaultFAQPanel } from "./VaultFAQPanel";
import { CHAINS, getAllVaults, Vault } from "@/src/config/chains";
import { useChainConfig } from "@/src/services/ChainConfigProvider";

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

  console.log(chainId);

  const chainName = vault !== undefined ? vault.chainName : chainConfig.CHAIN_NAME;
  return (
    <Screen
      ready={true}
      heading={{
        title:
          vaultAsset === "bvUSD"
            ? content.vaultScreen.headline
            : "Put your BTC to Work",
        subtitle: (
          <HFlex gap={16}>
            {vaultAsset === "bvUSD"
              ? content.vaultScreen.subheading(
                <HFlex gap={16}>
                  <img
                    src="/investors/fasanara.svg"
                    alt="Fasanara"
                    className={css({
                      width: 85,
                      height: 24,
                    })}
                  />
                  <img
                    src="/investors/LM5.svg"
                    alt="LM5"
                    className={css({
                      width: 125,
                      height: 24,
                    })}
                  />
                  <img
                    src="/investors/M1.svg"
                    alt="M1"
                    className={css({
                      width: 56,
                      height: 24,
                    })}
                  />
                </HFlex>
              )
              : "Deposit your BTC Wrapped Token"}
          </HFlex>
        ),
      }}
    >
      <VaultPanel vault={vault} symbol={vaultAsset} chainId={chainId} chainName={chainName} />
      <VaultFAQPanel />
    </Screen>
  );
}

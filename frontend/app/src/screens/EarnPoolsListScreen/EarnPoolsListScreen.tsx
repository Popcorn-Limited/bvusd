"use client";

import { Screen } from "@/src/comps/Screen/Screen";
import content from "@/src/content";
import {
  TokenIcon,
  TokenSymbol,
} from "@liquity2/uikit";
import { useTransition } from "@react-spring/web";
import { VaultPositionSummary } from "@/src/comps/VaultPositionSummary/VaultPositionSummary";
import { DNUM_0 } from "@/src/dnum-utils";
import { css } from "@/styled-system/css";
import { CHAINS, Vault } from "@/src/config/chains";

export function EarnPoolsListScreen() {
  let vaultAssets = [];

  const vaults = Object.values(CHAINS).reduce((acc, chain) => {
    for (const [key, v] of Object.entries(chain.VAULTS)) {
      vaultAssets.push(key);
      acc[key] = { chainId: chain.CHAIN_ID, chainName: chain.CHAIN_NAME, ...v };
    }
    return acc;
  }, {} as Record<string, { chainId: number; chainName: string } & Vault>);

  const vaultsObj = Object.entries(vaults);
    
  const poolsTransition = useTransition(
    Object.entries(vaults).map(([symbol, vault]) => symbol),
    {
      from: { opacity: 0, transform: "scale(1.1) translateY(64px)" },
      enter: { opacity: 1, transform: "scale(1) translateY(0px)" },
      leave: { opacity: 0, transform: "scale(1) translateY(0px)" },
      trail: 80,
      config: {
        mass: 1,
        tension: 1800,
        friction: 140,
      },
    }
  );

  return (
    <Screen
      heading={{
        title: (
          <div
            className={css({
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            })}
          >
            {content.vaultsHome.headline(
              <TokenIcon.Group>
                {[...vaultAssets].map((symbol) => (
                  <TokenIcon key={symbol} symbol={symbol as TokenSymbol} />
                  
                ))}
              </TokenIcon.Group>
            )}
          </div>
        ),
        subtitle: <>{content.vaultsHome.subheading} </>,
      }}
      width={67 * 8}
      gap={16}
    >
      {vaultsObj.map(([symbol, vault]) => {
        return (
          <VaultPositionSummary
            earnPosition={null}
            requestBalance={{
              pendingShares: DNUM_0,
              requestTime: 0,
              claimableAssets: DNUM_0,
              claimableShares: DNUM_0,
            }}
            linkToScreen={true}
            chainId={vault.chainId}
            vaultAddress={vault.address}
            vaultName={vault.name}
            vaultAsset={symbol}
          />
        );
      })}
    </Screen>
  );
}

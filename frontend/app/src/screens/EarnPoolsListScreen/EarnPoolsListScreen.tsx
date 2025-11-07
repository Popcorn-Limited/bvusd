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
import { getAllVaults } from "@/src/config/chains";

export function EarnPoolsListScreen() {
  const {vaults, vaultAssets, vaultsArray} = getAllVaults();

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
                {[...vaultAssets].map((symbol) => {
                  return (<TokenIcon key={"symbol"} symbol={symbol as TokenSymbol} />)
                  
                })}
              </TokenIcon.Group>
            )}
          </div>
        ),
        subtitle: <>{content.vaultsHome.subheading} </>,
      }}
      width={67 * 8}
      gap={16}
    >
      {vaultsArray.map(([symbol, vault]) => {
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
            chainName={vault.chainName}
            vaultAddress={vault.address}
            vaultName={vault.name}
            vaultSymbol={vault.outputSymbol}
            vaultAsset={symbol.split("-")[0]}
          />
        );
      })}
    </Screen>
  );
}

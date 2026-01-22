"use client";

import { Screen } from "@/src/comps/Screen/Screen";
import content from "@/src/content";
import {
  TokenIcon,
  TokenSymbol,
} from "@liquity2/uikit";
import { VaultPositionSummary } from "@/src/comps/VaultPositionSummary/VaultPositionSummary";
import { DNUM_0 } from "@/src/dnum-utils";
import { css } from "@/styled-system/css";
import { getAllVaults } from "@/src/config/chains";
import { useAccount } from "@/src/wagmi-utils";
import { useVaultPosition, useVaultRequestPosition } from "@/src/bitvault-utils";

export function EarnPoolsListScreen() {
  const account = useAccount();
  const {vaults, vaultAssets, vaultsArray} = getAllVaults();

  let filteredVaultsArray = vaultsArray.filter(([symbol]) => symbol !== "WBTC-1");

  let vaultPositions = [];
  let queries = filteredVaultsArray.map(([, vault]) =>
    useVaultPosition(account.address, vault.inputDecimals, vault.chainId, vault.address)
  );

  let allSuccess = queries.every(q => q.status === "success");

  if(allSuccess)
    vaultPositions = queries.map(q => q.data)

  let vaultReqPositions = [];
  queries = filteredVaultsArray.map(([, vault]) =>
    useVaultRequestPosition(account.address, vault.inputDecimals, vault.chainId, vault.address)
  );

  allSuccess = queries.every(q => q.status === "success");

  if(allSuccess)
    vaultReqPositions = queries.map(q => q.data)

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
                  return (<TokenIcon key={symbol} symbol={symbol as TokenSymbol} />)
                  
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
      {filteredVaultsArray.map(([symbol, vault], index) => {
        return (
          <VaultPositionSummary
            earnPosition={vaultPositions[index]?? null}
            requestBalance={vaultReqPositions[index]?? {
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

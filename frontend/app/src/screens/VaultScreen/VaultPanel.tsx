"use client";

import { useVault, useVaultPosition } from "@/src/liquity-utils";
import { useAccount } from "@/src/wagmi-utils";
import { css } from "@/styled-system/css";
import { a, useTransition } from "@react-spring/web";
import { VaultPositionSummary } from "@/src/comps/VaultPositionSummary/VaultPositionSummary";
import { PanelVaultUpdate } from "./PanelVaultUpdate";
import { getProtocolContract } from "@/src/contracts";
import { useReadContract } from "wagmi";
import { RequestBalance } from "@/src/types";
import { dnum18, DNUM_0 } from "@/src/dnum-utils";
import { zeroAddress } from "viem";

const EMPTY_REQUEST_BALANCE: RequestBalance = {
  pendingShares: DNUM_0,
  requestTime: 0,
  claimableShares: DNUM_0,
  claimableAssets: DNUM_0,
};

export function VaultPanel() {
  const account = useAccount();

  const vaultPosition = useVaultPosition(account.address ?? null);
  const vault = useVault();
  const requestBalance = useReadContract({
    address: getProtocolContract("Vault").address,
    abi: getProtocolContract("Vault").abi,
    functionName: "getRequestBalance",
    args: [account.address ?? zeroAddress],
    query: {
      select: (data) => ({
        pendingShares: dnum18(data.pendingShares),
        requestTime: Number(data.requestTime),
        claimableShares: dnum18(data.claimableShares),
        claimableAssets: dnum18(data.claimableAssets),
      }),
    },
  });
  const loadingState = vault.isLoading || requestBalance.isLoading || vaultPosition.status === "pending" ? "loading" : "success";

  const tabsTransition = useTransition(loadingState, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: {
      mass: 1,
      tension: 2000,
      friction: 120,
    },
  });
  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: 24,
      })}
    >
      {tabsTransition((style, item) => (
        item === "success" && (
          <a.div
            className={css({
              display: "flex",
              flexDirection: "column",
              gap: 24,
              width: "100%",
            })}
            style={{
              opacity: style.opacity,
            }}
          >
            <VaultPositionSummary
              earnPosition={vaultPosition.data}
              requestBalance={requestBalance.data as RequestBalance ?? EMPTY_REQUEST_BALANCE}
            />
          </a.div>
        )
      ))}
      {tabsTransition((style, item) => (
        item === "success" && (
          <a.div
            className={css({
              display: "flex",
              flexDirection: "column",
              gap: 24,
              width: "100%",
            })}
            style={{
              opacity: style.opacity,
            }}
          >
            <PanelVaultUpdate requestBalance={requestBalance.data as RequestBalance ?? EMPTY_REQUEST_BALANCE} />
          </a.div>
        )
      ))}
    </div>
  )
}
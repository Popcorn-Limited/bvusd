"use client";

import { Screen } from "@/src/comps/Screen/Screen";
import { ScreenCard } from "@/src/comps/Screen/ScreenCard";
import { Spinner } from "@/src/comps/Spinner/Spinner";
import content from "@/src/content";
import { useVault, useVaultPosition } from "@/src/liquity-utils";
import { useAccount } from "@/src/wagmi-utils";
import { css } from "@/styled-system/css";
import { Address, HFlex, IconEarn } from "@liquity2/uikit";
import { a, useTransition } from "@react-spring/web";
import * as dn from "dnum";
import { match } from "ts-pattern";
import { VaultPositionSummary } from "@/src/comps/VaultPositionSummary/VaultPositionSummary";
import { PanelVaultUpdate } from "./PanelVaultUpdate";
import { getProtocolContract } from "@/src/contracts";
import { useReadContract } from "wagmi";
import { RequestBalance } from "@/src/types";
import { dnum18 } from "@/src/dnum-utils";
import { zeroAddress } from "viem";


export function VaultPoolScreen() {
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
    <Screen
      ready={loadingState === "success"}
      heading={{
        title: content.vaultScreen.headline,
        subtitle: (
          <HFlex gap={16}>
            {content.vaultScreen.subheading(
              <HFlex gap={16}>
                <img
                  src="/investors/gsr.png"
                  alt="Gsr"
                  className={css({
                    width: 72,
                    height: 18
                  })}
                />
                <img
                  src="/investors/auros.png"
                  alt="Auros"
                  className={css({
                    width: 92,
                    height: 18
                  })}
                />
              </HFlex>
            )}
          </HFlex>
        ),
      }}
    >
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: 24,
        })}
      >
        <ScreenCard
          mode={match(loadingState)
            .returnType<"ready" | "loading">()
            .with("success", () => "ready")
            .with("loading", () => "loading")
            .exhaustive()}
          finalHeight={140}
        >
          {loadingState === "success"
            ? (
              <VaultPositionSummary
                earnPosition={vaultPosition.data}
                requestBalance={requestBalance.data as RequestBalance}
              />
            )
            : (
              <>
                <div
                  className={css({
                    position: "absolute",
                    top: 16,
                    left: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    textTransform: "uppercase",
                    userSelect: "none",
                    fontSize: 12,
                  })}
                >
                  <div
                    className={css({
                      display: "flex",
                    })}
                  >
                    <IconEarn size={16} />
                  </div>
                  <div>
                    Earn Pool
                  </div>
                </div>
                <HFlex gap={8}>
                  Fetching Vault…
                  <Spinner size={18} />
                </HFlex>
              </>
            )}
        </ScreenCard>
      </div>
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
            <PanelVaultUpdate requestBalance={requestBalance.data as RequestBalance} />
          </a.div>
        )
      ))}
    </Screen>
  );
}

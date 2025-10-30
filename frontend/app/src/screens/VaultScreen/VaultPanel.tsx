"use client";

import { useVault, useVaultPosition } from "@/src/bitvault-utils";
import { VaultPositionSummary } from "@/src/comps/VaultPositionSummary/VaultPositionSummary";
import { Vault } from "@/src/config/chains";
import { getProtocolContract } from "@/src/contracts";
import { dnum18, DNUM_0, dnumOrNull } from "@/src/dnum-utils";
import { useChainConfig } from "@/src/services/ChainConfigProvider";
import { RequestBalance } from "@/src/types";
import { useAccount, useEnforceChain } from "@/src/wagmi-utils";
import { css } from "@/styled-system/css";
import { a, useTransition } from "@react-spring/web";
import { useEffect } from "react";
import { Address, zeroAddress } from "viem";
import { useChainId, useReadContract, useSwitchChain } from "wagmi";
import { PanelVaultUpdate } from "./PanelVaultUpdate";

const EMPTY_REQUEST_BALANCE: RequestBalance = {
  pendingShares: DNUM_0,
  requestTime: 0,
  claimableShares: DNUM_0,
  claimableAssets: DNUM_0,
};

export function VaultPanel({
  vault,
  symbol,
  chainId,
}: {
  vault: Vault;
  symbol: string;
  chainId: number;
}) {
  const { switchChainAsync } = useSwitchChain();

  useEffect(() => {
    (async () => {
      try {
        await switchChainAsync({ chainId });
      } catch (err) {
        console.warn("Failed to switch chain:", err);
      }
    })();
  }, [chainId]);

  const { chainConfig } = useChainConfig();

  const vaultAddress = vault?.address?? getProtocolContract(chainConfig, "Vault").address;
  const vaultName = vault?.name?? "sbvUSD";

  const account = useAccount();
  const vaultPosition = useVaultPosition(
    account.address ?? null,
    vaultAddress
  );

  const requestBalance = useReadContract({
    address: vaultAddress,
    abi: getProtocolContract(chainConfig, "Vault").abi,
    functionName: "getRequestBalance",
    args: [account.address ?? zeroAddress],
    query: {
      select: (data) => ({
        pendingShares: dnumOrNull(data.pendingShares, vault.inputDecimals),
        requestTime: Number(data.requestTime),
        claimableShares: dnumOrNull(data.claimableShares, vault.inputDecimals),
        claimableAssets: dnumOrNull(data.claimableAssets, vault.inputDecimals),
      }),
    },
  });
  const loadingState = requestBalance.isLoading || vaultPosition.status === "pending"
    ? "loading"
    : "success";
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
      {tabsTransition(
        (style, item) =>
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
                requestBalance={(requestBalance.data as RequestBalance)
                  ?? EMPTY_REQUEST_BALANCE}
                chainId={chainId ?? chainConfig.CHAIN_ID}
                vaultAsset={symbol}
                vaultAddress={vaultAddress}
                vaultName={vaultName}
              />
            </a.div>
          ),
      )}
      {tabsTransition(
        (style, item) =>
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
              <PanelVaultUpdate
                decimals={vault.inputDecimals}
                vaultAddress={vaultAddress}
                vaultInput={symbol}
                vaultOutput={vault?.outputSymbol ?? "sbvUSD"}
                requestBalance={(requestBalance.data as RequestBalance)
                  ?? EMPTY_REQUEST_BALANCE}
              />
            </a.div>
          ),
      )}
    </div>
  );
}

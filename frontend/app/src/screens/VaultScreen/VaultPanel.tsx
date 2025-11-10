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
import { fmtnum } from "@/src/formatting";

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
  chainName,
}: {
  vault: Vault;
  symbol: string;
  chainId: number;
  chainName: string;
}) {
  const { switchChainAsync } = useSwitchChain();
  const walletChainId = useChainId();

  useEffect(() => {
    if(chainId !== walletChainId) {
      (async () => {
        try {
          await switchChainAsync({ chainId });
        } catch (err) {
          console.warn("Failed to switch chain:", err);
        }
      })();
    }
  }, [chainId]);

  const { chainConfig } = useChainConfig();

  const vaultAddress = vault?.address?? getProtocolContract(chainConfig, "Vault").address;
  const vaultName = vault?.name?? "sbvUSD";
  const vaultSymbol = vault?.outputSymbol?? "sbvUSD";
  const vaultDecimals = vault?.inputDecimals?? 18;

  const account = useAccount();
  const vaultPosition = useVaultPosition(
    account.address ?? null,
    vaultDecimals,
    chainId,
    vaultAddress,
  );
  const vaultPrice = useVault({ chainId, vaultAddress, vaultSymbol }).data?.price ?? dnumOrNull(1, vaultDecimals);

  const requestBalance = useReadContract({
    address: vaultAddress,
    abi: getProtocolContract(chainConfig, "Vault").abi,
    functionName: "getRequestBalance",
    args: [account.address ?? zeroAddress],
    query: {
      select: (data) => ({
        pendingShares: dnumOrNull(Number(data.pendingShares) / 10 ** vaultDecimals, vaultDecimals),
        requestTime: Number(data.requestTime),
        claimableShares: dnumOrNull(Number(data.claimableShares) / 10 ** vaultDecimals, vaultDecimals),
        claimableAssets: dnumOrNull(Number(data.claimableAssets) / 10 ** vaultDecimals, vaultDecimals),
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
                chainName={chainName}
                vaultAddress={vaultAddress}
                vaultName={vaultName}
                vaultSymbol={vaultSymbol}
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
                decimals={vaultDecimals}
                vaultPrice={vaultPrice}
                vaultAddress={vaultAddress}
                vaultInput={symbol}
                vaultOutput={vaultSymbol}
                requestBalance={(requestBalance.data as RequestBalance)
                  ?? EMPTY_REQUEST_BALANCE}
              />
            </a.div>
          ),
      )}
    </div>
  );
}

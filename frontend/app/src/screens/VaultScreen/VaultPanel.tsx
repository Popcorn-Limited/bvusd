"use client";

import { useVault, useVaultPosition } from "@/src/bitvault-utils";
import { VaultPositionSummary } from "@/src/comps/VaultPositionSummary/VaultPositionSummary";
import { Vault } from "@/src/config/chains";
import { getProtocolContract } from "@/src/contracts";
import { dnum18, DNUM_0, dnumOrNull } from "@/src/dnum-utils";
import { useChainConfig } from "@/src/services/ChainConfigProvider";
import { RequestBalance } from "@/src/types";
import { useAccount } from "@/src/wagmi-utils";
import { css } from "@/styled-system/css";
import { a, useTransition } from "@react-spring/web";
import { useEffect } from "react";
import { Address, zeroAddress } from "viem";
import { useChainId, useReadContract, useSwitchChain } from "wagmi";
import { PanelVaultUpdate } from "./PanelVaultUpdate";
import { Field } from "@/src/comps/Field/Field";

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
  referralCode,
}: {
  vault: Vault;
  symbol: string;
  chainId: number;
  chainName: string;
  referralCode: string;
}) {
  const { switchChainAsync } = useSwitchChain();
  const walletChainId = useChainId();

  useEffect(() => {
    if (chainId !== walletChainId) {
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

  const vaultAddress = vault?.address ?? getProtocolContract(chainConfig, "Vault").address;
  const vaultName = vault?.name ?? "sbvUSD";
  const vaultSymbol = vault?.outputSymbol ?? "sbvUSD";
  const vaultDecimals = vault?.inputDecimals ?? 18;

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
                flexDirection: { base: "column", medium: "row" },
                gap: 24,
                width: "100%",
                height: "fit-content"
              })}
              style={{
                opacity: style.opacity,
              }}
            >
              <div className={css({ width: { base: "100%", medium: "40%" } })}>
                <PanelVaultUpdate
                  decimals={vaultDecimals}
                  vaultPrice={vaultPrice}
                  vaultAddress={vaultAddress}
                  vaultInput={symbol}
                  vaultOutput={vaultSymbol}
                  requestBalance={(requestBalance.data as RequestBalance)
                    ?? EMPTY_REQUEST_BALANCE}
                    referralCode={referralCode}
                />
              </div>
              <div className={css({ width: { base: "100%", medium: "60%" } })}>
                <div
                  className={css({
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    background: `fieldSurface`,
                    border: "1px solid token(colors.fieldBorder)",
                    borderRadius: 8,
                    padding: 16,
                    gap: 16
                  })}
                >
                  <p>Historical Returns</p>
                  <div className={css({ display: "flex", flexDirection: "row", gap: 16})}>
                    <Field
                      label="7D APY"
                      field="6%"
                    />
                    <Field
                      label="30D APY"
                      field="4%"
                    />
                  </div>
                  <svg id="staticChart" viewBox="0 0 600 300" style={{ width: "100%", height: "100%" }}>
                    <line x1="50" y1="30" x2="580" y2="30" stroke="rgba(255,255,255,0.05)" stroke-width="1"></line>
                    <line x1="50" y1="90" x2="580" y2="90" stroke="rgba(255,255,255,0.05)" stroke-width="1"></line>
                    <line x1="50" y1="150" x2="580" y2="150" stroke="rgba(255,255,255,0.05)" stroke-width="1"></line>
                    <line x1="50" y1="210" x2="580" y2="210" stroke="rgba(255,255,255,0.05)" stroke-width="1"></line>

                    <text x="590" y="35" fill="#71717a" font-size="11" text-anchor="start">10%</text>
                    <text x="590" y="95" fill="#71717a" font-size="11" text-anchor="start">8%</text>
                    <text x="590" y="155" fill="#71717a" font-size="11" text-anchor="start">6%</text>
                    <text x="590" y="215" fill="#71717a" font-size="11" text-anchor="start">4%</text>
                    <text x="590" y="275" fill="#71717a" font-size="11" text-anchor="start">2%</text>

                    <text x="50" y="295" fill="#71717a" font-size="11" text-anchor="middle">Oct</text>
                    <text x="140" y="295" fill="#71717a" font-size="11" text-anchor="middle">Nov</text>
                    <text x="230" y="295" fill="#71717a" font-size="11" text-anchor="middle">Nov</text>
                    <text x="320" y="295" fill="#71717a" font-size="11" text-anchor="middle">Dec</text>
                    <text x="410" y="295" fill="#71717a" font-size="11" text-anchor="middle">Dec</text>
                    <text x="500" y="295" fill="#71717a" font-size="11" text-anchor="middle">Jan</text>

                    <defs>
                      <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: "#f39c12", stopOpacity: 0.3 }}></stop>
                        <stop offset="100%" style={{ stopColor: "#f39c12", stopOpacity: 0.02 }}></stop>
                      </linearGradient>
                    </defs>

                    <path d="M50,204 L100,186 L160,168 L220,178 L280,150 L340,138 L400,156 L460,176 L520,154 L570,162 L570,270 L50,270 Z" fill="url(#chartGradient)"></path>

                    <path d="M50,204 L100,186 L160,168 L220,178 L280,150 L340,138 L400,156 L460,176 L520,154 L570,162" fill="none" stroke="#f39c12" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>

                    <circle cx="50" cy="204" r="5" fill="#f39c12" stroke="#fff" stroke-width="2"></circle>
                    <circle cx="100" cy="186" r="5" fill="#f39c12" stroke="#fff" stroke-width="2"></circle>
                    <circle cx="160" cy="168" r="5" fill="#f39c12" stroke="#fff" stroke-width="2"></circle>
                    <circle cx="220" cy="178" r="5" fill="#f39c12" stroke="#fff" stroke-width="2"></circle>
                    <circle cx="280" cy="150" r="5" fill="#f39c12" stroke="#fff" stroke-width="2"></circle>
                    <circle cx="340" cy="138" r="5" fill="#f39c12" stroke="#fff" stroke-width="2"></circle>
                    <circle cx="400" cy="156" r="5" fill="#f39c12" stroke="#fff" stroke-width="2"></circle>
                    <circle cx="460" cy="176" r="5" fill="#f39c12" stroke="#fff" stroke-width="2"></circle>
                    <circle cx="520" cy="154" r="5" fill="#f39c12" stroke="#fff" stroke-width="2"></circle>
                    <circle cx="570" cy="162" r="5" fill="#f39c12" stroke="#fff" stroke-width="2"></circle>
                  </svg>
                </div>
              </div>
            </a.div>
          ),
      )
      }
    </div >
  );
}

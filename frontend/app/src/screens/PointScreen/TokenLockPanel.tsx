import type { Address } from "@/src/types";
import { ConnectWarningBox } from "@/src/comps/ConnectWarningBox/ConnectWarningBox";
import { Field } from "@/src/comps/Field/Field";
import content from "@/src/content";
import { parseInputFloatWithDecimals } from "@/src/form-utils";
import { fmtnum } from "@/src/formatting";
import { useTransactionFlow } from "@/src/services/TransactionFlow";
import { useAccount, useBalance } from "@/src/wagmi-utils";
import { Button, InputField, Tabs, TextButton, TokenIcon } from "@liquity2/uikit";
import * as dn from "dnum";
import { useState } from "react";
import { css } from "@/styled-system/css";
import { getProtocolContract } from "@/src/contracts";
import { getNextWithdrawalDate } from "../VaultScreen/PanelVaultUpdate";
import { useQuery } from "@tanstack/react-query";
import { useConfig as useWagmiConfig } from "wagmi";
import { readContract } from "wagmi/actions";
import { useChainConfig } from "@/src/services/ChainConfigProvider";

type ConvertMode = "lock" | "unlock";

export function useUnlockDate(account: Address) {
  const wagmiConfig = useWagmiConfig();
  const { chainConfig } = useChainConfig();

  let queryFn = async () => {
    const tokenLocker = getProtocolContract(chainConfig, "TokenLocker");
    const unlockDate = await readContract(wagmiConfig, {
      address: tokenLocker.address,
      abi: tokenLocker.abi,
      functionName: "getUnlockableTimestamp",
      args: [account],
    });

    return getNextWithdrawalDate(Number(unlockDate) * 1000);
  };

  return useQuery({
    queryKey: ["unlockDate", account],
    queryFn,
  });
}

export function TokenLockPanel() {
  const account = useAccount();
  const txFlow = useTransactionFlow();

  const [mode, setMode] = useState<ConvertMode>("lock");
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);

  const parsedValue = parseInputFloatWithDecimals(value, 18);

  const value_ = (focused || !parsedValue || dn.lte(parsedValue, 0)) ? value : `${fmtnum(parsedValue, "full")}`;

  const balance = useBalance(account.address, "bvUSD");
  const lockedBalance = useBalance(account.address, "LbvUSD");

  const unlockDate = useUnlockDate(account.address);

  const insufficientLockedBalance = parsedValue && lockedBalance.data && dn.lt(lockedBalance.data, parsedValue);
  const insufficientBalance = parsedValue && balance.data && dn.lt(balance.data, parsedValue);

  const allowSubmit = account.isConnected
    && parsedValue
    && dn.gt(parsedValue, 0)
    && !insufficientBalance
    && (mode === "unlock" ? (unlockDate.data?.timeDiff <= 0 && !insufficientLockedBalance) : true)

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
        gap: 16,
        padding: "24px 0 24px 0",
        borderTop: "1px solid token(colors.fieldBorder)",
      })}
    >
      <div>
        <h2
          className={css({
            fontSize: 24,
          })}>
          Lock bvUSD
        </h2>
        <p
          className={css({
            fontSize: 16,
            color: "contentAlt",
          })}
        >
          Lock your bvUSD to earn points.
        </p>
      </div>
      <Field
        field={
          <InputField
            drawer={mode === "lock" && insufficientBalance
              ? {
                mode: "error",
                message: `Insufficient balance. You have ${fmtnum(balance.data ?? 0)} bvUSD.`,
              }
              : mode === "unlock" && insufficientLockedBalance ? {
                mode: "error",
                message: `Insufficient balance. You have ${fmtnum(lockedBalance.data ?? 0)} lbvUSD.`,
              }
              : null
            }
            contextual={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <TokenIcon symbol={"bvUSD"} title={"bvUSD"} />
                <p style={{ fontSize: 24, fontWeight: 500, margin: 0 }}>
                  bvUSD
                </p>
              </div>}
            id="input-deposit-change"
            label={{
              start: mode === "lock"
                ? content.lockScreen.lockPanel.label
                : content.lockScreen.unlockPanel.label,
              end: (
                <Tabs
                  compact
                  items={[
                    { label: "Lock", panelId: "panel-lock", tabId: "tab-lock" },
                    { label: "Unlock", panelId: "panel-unlock", tabId: "tab-unlock" },
                  ]}
                  onSelect={(index, { origin, event }) => {
                    setMode(index === 1 ? "unlock" : "lock");
                    setValue(index === 1 ? dn.toString(lockedBalance.data) : "");
                    if (origin !== "keyboard") {
                      event.preventDefault();
                      (event.target as HTMLElement).focus();
                    }
                  }}
                  selected={mode === "unlock" ? 1 : 0}
                />
              )
            }}
            labelHeight={32}
            onFocus={() => setFocused(true)}
            onChange={setValue}
            onBlur={() => setFocused(false)}
            value={value_}
            placeholder="0.00"
            secondary={{
              start: null,
              end: balance.data && (
                <TextButton
                  label={mode === "lock" ? `Max ${fmtnum(balance.data)} bvUSD` : `Max ${fmtnum(lockedBalance.data)} lbvUSD`}
                  onClick={() => setValue(dn.toString(mode === "lock" ? balance.data: lockedBalance.data))}
                />
              )
            }}
          />
        }
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 24,
          width: "100%",
        }}
      >
        <p className={css({
          color: "content",
          fontSize: "16px",
          textAlign: "center",
        })}>
          You can withdraw your funds 30 days after your last deposit.
          Your position is unlocked for withdrawal in {unlockDate.data?.days ?? 0} days, {unlockDate.data?.hours ?? 0} hours, {unlockDate.data?.minutes ?? 0} minutes, {unlockDate.data?.seconds ?? 0} seconds.
        </p>
        <ConnectWarningBox />
        <Button
          disabled={!allowSubmit}
          label={content.earnScreen.depositPanel.action}
          mode="primary"
          size="medium"
          shape="rectangular"
          wide
          onClick={() => {
            if (!account.address || !balance.data) {
              return;
            }

            txFlow.start({
              flowId: "lockToken",
              backLink: [
                `/point`,
                "Back to Points",
              ],
              successLink: ["/", "Go to the home page"],
              successMessage: "Your lock has been processed successfully.",
              mode: mode,
              amount: parsedValue,
              token: "bvUSD",
            });
          }}
        />
      </div>
    </div>
  );
}

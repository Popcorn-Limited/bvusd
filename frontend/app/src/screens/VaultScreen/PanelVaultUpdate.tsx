import type { BranchId, PositionEarn, Token } from "@/src/types";
import type { Dnum } from "dnum";

import { Amount } from "@/src/comps/Amount/Amount";
import { ConnectWarningBox } from "@/src/comps/ConnectWarningBox/ConnectWarningBox";
import { Field } from "@/src/comps/Field/Field";
import { InputTokenBadge } from "@/src/comps/InputTokenBadge/InputTokenBadge";
import content from "@/src/content";
import { DNUM_0, dnumMax } from "@/src/dnum-utils";
import { parseInputFloat, parseInputFloatWithDecimals } from "@/src/form-utils";
import { fmtnum } from "@/src/formatting";
import { getCollToken, isEarnPositionActive } from "@/src/liquity-utils";
import { useTransactionFlow } from "@/src/services/TransactionFlow";
import { infoTooltipProps } from "@/src/uikit-utils";
import { useAccount, useBalance } from "@/src/wagmi-utils";
import { Button, bvUSD, Dropdown, HFlex, InfoTooltip, InputField, Tabs, TextButton, TokenIcon, USDT } from "@liquity2/uikit";
import * as dn from "dnum";
import { useState } from "react";
import { CONTRACT_BOLD_TOKEN, CONTRACT_VAULT } from "@/src/env";
import { STABLE_SYMBOLS } from "../BuyScreen/PanelConvert";

type ValueUpdateMode = "add" | "remove";

export function PanelVaultUpdate() {
  const account = useAccount();
  const txFlow = useTransactionFlow();

  const [mode, setMode] = useState<ValueUpdateMode>("add");
  const [inputSymbol, setInputSymbol] = useState<Token["symbol"]>("bvUSD");
  const [outputSymbol, setOutputSymbol] = useState<Token["symbol"]>("sbvUSD");
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);

  const parsedValue = parseInputFloatWithDecimals(value, inputSymbol === "bvUSD" ? 18 : 6);

  const value_ = (focused || !parsedValue || dn.lte(parsedValue, 0)) ? value : `${fmtnum(parsedValue, "full")}`;

  const balances = Object.fromEntries(["bvUSD", "sbvUSD", ...STABLE_SYMBOLS].map((symbol) => ([
    symbol,
    // known collaterals are static so we can safely call this hook in a .map()
    useBalance(account.address, symbol as Token["symbol"]),
  ] as const)));

  const insufficientBalance = parsedValue && balances[inputSymbol].data && dn.lt(balances[inputSymbol].data, parsedValue);

  const allowSubmit = account.isConnected
    && parsedValue
    && dn.gt(parsedValue, 0)
    && !insufficientBalance

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
        gap: 48,
      }}
    >
      <Field
        field={
          <InputField
            drawer={insufficientBalance
              ? {
                mode: "error",
                message: `Insufficient balance. You have ${fmtnum(balances[inputSymbol].data ?? 0)} ${inputSymbol}.`,
              }
              : null
            }
            contextual={mode === "add" ?
              <Dropdown
                items={
                  ["bvUSD", ...STABLE_SYMBOLS].map(symbol => ({
                    icon: <TokenIcon symbol={symbol as Token["symbol"]} />,
                    label: symbol,
                    value: account.isConnected
                      ? fmtnum(balances[symbol]?.data ?? 0)
                      : "−",
                  }))
                }
                menuPlacement="end"
                menuWidth={300}
                onSelect={(index) => setInputSymbol(["bvUSD", ...STABLE_SYMBOLS][index] as Token["symbol"])}
                // @ts-ignore
                selected={["bvUSD", ...STABLE_SYMBOLS].indexOf(inputSymbol)}
              />
              : <InputTokenBadge
                background={false}
                icon={<TokenIcon symbol="bvUSD" />}
                label="bvUSD"
              />
            }
            id="input-deposit-change"
            label={{
              start: mode === "add"
                ? content.earnScreen.depositPanel.label
                : content.earnScreen.withdrawPanel.label,
              end: (
                <Tabs
                  compact
                  items={[
                    { label: "Deposit", panelId: "panel-deposit", tabId: "tab-deposit" },
                    { label: "Withdraw", panelId: "panel-withdraw", tabId: "tab-withdraw" },
                  ]}
                  onSelect={(index, { origin, event }) => {
                    setMode(index === 1 ? "remove" : "add");
                    setValue("");
                    if (index === 1) {
                      setInputSymbol("sbvUSD");
                      setOutputSymbol("bvUSD");
                    }
                    else {
                      setInputSymbol("bvUSD");
                      setOutputSymbol("sbvUSD");
                    }
                    if (origin !== "keyboard") {
                      event.preventDefault();
                      (event.target as HTMLElement).focus();
                    }
                  }}
                  selected={mode === "remove" ? 1 : 0}
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
              end: balances[inputSymbol].data && (
                <TextButton
                  label={dn.gt(balances[inputSymbol].data, 0) ? `Max ${fmtnum(balances[inputSymbol].data, 2)} ${inputSymbol}` : `Max 0.00 ${inputSymbol}`}
                  onClick={() => setValue(dn.toString(balances[inputSymbol].data))}
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
        <ConnectWarningBox />
        <Button
          disabled={!allowSubmit}
          label={content.earnScreen.depositPanel.action}
          mode="primary"
          size="medium"
          shape="rectangular"
          wide
          onClick={() => {
            if (!account.address || !balances[inputSymbol].data) {
              return;
            }

            txFlow.start({
              flowId: "vaultUpdate",
              backLink: [
                `/vault`,
                "Back to editing",
              ],
              successLink: ["/", "Go to the Dashboard"],
              successMessage: `Your ${mode === "add" ? "deposit" : "withdrawal request"} has been processed successfully.`,
              mode: mode,
              amount: parsedValue,
              inputToken: inputSymbol as "bvUSD" | "sbvUSD" | "USDC" | "USDT",
              outputToken: outputSymbol as "bvUSD" | "sbvUSD",
            });
          }}
        />
      </div>
    </div>
  );
}

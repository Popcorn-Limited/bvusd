import type { Token } from "@/src/types";

import { ConnectWarningBox } from "@/src/comps/ConnectWarningBox/ConnectWarningBox";
import { Field } from "@/src/comps/Field/Field";
import content from "@/src/content";
import { parseInputFloatWithDecimals } from "@/src/form-utils";
import { fmtnum } from "@/src/formatting";
import { useTransactionFlow } from "@/src/services/TransactionFlow";
import { useAccount, useBalance } from "@/src/wagmi-utils";
import { Button, Dropdown, InputField, Tabs, TextButton, TokenIcon } from "@liquity2/uikit";
import * as dn from "dnum";
import { useState } from "react";
import useEnsoForecast from "@/src/enso-utils";
import EnsoPreview from "@/src/comps/EnsoPreview";
import { css } from "@/styled-system/css";
import { useIsWhitelistedUser } from "@/src/bitvault-utils";
import { useModal } from "@/src/services/ModalService";
import { WhitelistModal } from "../HomeScreen/WhitelistModal";

type ConvertMode = "buy" | "sell";

export const STABLE_SYMBOLS = ["USDC", "USDT"] as const;

export function PanelConvert() {
  const account = useAccount();
  const txFlow = useTransactionFlow();

  const [mode, setMode] = useState<ConvertMode>("buy");
  const [inputSymbol, setInputSymbol] = useState<Token["symbol"]>("USDC");
  const [outputSymbol, setOutputSymbol] = useState<Token["symbol"]>("bvUSD");
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);

  const { setVisible: setModalVisibility, setContent: setModalContent } = useModal()
  const isWhitelisted = useIsWhitelistedUser("0x2e9fD409760D17b1ed277e000374698d531d19CE", "0xf45346dc", account.address)

  const parsedValue = parseInputFloatWithDecimals(value, inputSymbol === "bvUSD" ? 18 : 6);
  const { value: valOut, status: valOutStatus } = useEnsoForecast({ inputValue: parsedValue[0].toString(), inputSymbol, outputSymbol, account: account.address, slippage: 50 });

  const value_ = (focused || !parsedValue || dn.lte(parsedValue, 0)) ? value : `${fmtnum(parsedValue, "full")}`;

  const balances = Object.fromEntries([...STABLE_SYMBOLS, "bvUSD"].map((symbol) => ([
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
          <>
            <InputField
              drawer={insufficientBalance
                ? {
                  mode: "error",
                  message: `Insufficient balance. You have ${fmtnum(balances[inputSymbol].data ?? 0)} ${inputSymbol}.`,
                }
                : null
              }
              contextual={
                <Dropdown
                  items={
                    STABLE_SYMBOLS.map(symbol => ({
                      icon: <TokenIcon symbol={symbol} />,
                      label: symbol,
                      value: account.isConnected
                        ? fmtnum(balances[symbol]?.data ?? 0)
                        : "−",
                    }))
                  }
                  menuPlacement="end"
                  menuWidth={300}
                  onSelect={(index) => {
                    mode === "buy" ? setInputSymbol(STABLE_SYMBOLS[index]) : setOutputSymbol(STABLE_SYMBOLS[index]);
                  }}
                  // @ts-ignore
                  selected={mode === "buy" ? STABLE_SYMBOLS.indexOf(inputSymbol) : STABLE_SYMBOLS.indexOf(outputSymbol)}
                />
              }
              id="input-deposit-change"
              label={{
                start: mode === "sell"
                  ? content.buyScreen.sellPanel.label
                  : content.buyScreen.buyPanel.label,
                end: (
                  <Tabs
                    compact
                    items={[
                      { label: "Buy", panelId: "panel-buy", tabId: "tab-buy" },
                      { label: "Sell", panelId: "panel-sell", tabId: "tab-sell" },
                    ]}
                    onSelect={(index, { origin, event }) => {
                      setMode(index === 1 ? "sell" : "buy");
                      setValue("");
                      if (index === 1) {
                        setInputSymbol("bvUSD");
                        setOutputSymbol("USDC");
                      }
                      else {
                        setInputSymbol("USDC");
                        setOutputSymbol("bvUSD");
                      }
                      if (origin !== "keyboard") {
                        event.preventDefault();
                        (event.target as HTMLElement).focus();
                      }
                    }}
                    selected={mode === "sell" ? 1 : 0}
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
                start: <EnsoPreview value={valOut} status={valOutStatus} outputSymbol={outputSymbol} />,
                end: balances[inputSymbol].data && (
                  <TextButton
                    label={dn.gt(balances[inputSymbol].data, 0) ? `Max ${fmtnum(balances[inputSymbol].data)} ${inputSymbol}` : `Max 0.00 ${inputSymbol}`}
                    onClick={() => setValue(dn.toString(balances[inputSymbol].data))}
                  />
                )
              }}
            />
            <span className={css({ display: "flex", alignItems: "center", gap: 4, color: "contentAlt2", fontSize: "14px" })}>
              <p>Built with </p>
              <img src="/icons/enso-gray.svg" alt="Enso" width={14} height={14} className={css({ color: "contentAlt2" })} />
              <p>Enso</p>
            </span>
          </>
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
        {isWhitelisted ?
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
                flowId: "convert",
                backLink: [
                  `/buy`,
                  "Back to editing",
                ],
                successLink: ["/", "Go to the home page"],
                successMessage: "Your order has been processed successfully.",
                mode: mode,
                amount: parsedValue,
                inputToken: inputSymbol as "USDC" | "USDT" | "bvUSD",
                outputToken: outputSymbol as "USDC" | "USDT" | "bvUSD",
                slippage: 50,
              });
            }}
          />
          :
          <Button
            label="Join the whitelist"
            mode="primary"
            size="medium"
            shape="rectangular"
            wide
            onClick={() => {
              setModalContent(<WhitelistModal />);
              setModalVisibility(true);
            }}
          />
        }
      </div>
    </div>
  );
}

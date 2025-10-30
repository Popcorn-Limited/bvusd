import type { RequestBalance, Token, TokenSymbol } from "@/src/types";

import { ConnectWarningBox } from "@/src/comps/ConnectWarningBox/ConnectWarningBox";
import { Field } from "@/src/comps/Field/Field";
import { InputTokenBadge } from "@/src/comps/InputTokenBadge/InputTokenBadge";
import content from "@/src/content";
import { parseInputFloatWithDecimals } from "@/src/form-utils";
import { fmtnum } from "@/src/formatting";
import { useTransactionFlow } from "@/src/services/TransactionFlow";
import { useAccount, useBalance } from "@/src/wagmi-utils";
import { Button, Dropdown, InputField, Tabs, TextButton, TokenIcon } from "@liquity2/uikit";
import * as dn from "dnum";
import { useEffect, useState } from "react";
import { STABLE_SYMBOLS } from "../BuyScreen/PanelConvert";
import { css } from "@/styled-system/css";
import ClaimAssets from "./ClaimAssets";
import useEnsoForecast from "@/src/enso-utils";
import EnsoPreview from "@/src/comps/EnsoPreview";
import { useIsWhitelistedUser } from "@/src/bitvault-utils";
import { WhitelistModal } from "../HomeScreen/WhitelistModal";
import { useModal } from "@/src/services/ModalService";
import { useChainId } from "wagmi";
import { CHAINS, Vault } from "@/src/config/chains";
import { Address, zeroAddress } from "viem";

export const BTC_SYMBOLS = ["nBTC", "bgBTC"] as const;

export async function getNextWithdrawalDate(date?: number): Promise<{ days: number, hours: number, minutes: number, seconds: number, timeDiff: number }> {
  // Get current date in CET timezone
  const now = new Date();

  // Create a date for the first day of next month at 12:00 CET
  const targetDate = date ? new Date(date) : new Date(now.getFullYear(), now.getMonth() + 1, 1, 12, 0, 0);

  // Calculate time difference in milliseconds
  const timeDiff = targetDate.getTime() - now.getTime();

  // Convert to days, hours, minutes, seconds
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    timeDiff
  };
}

type ValueUpdateMode = "add" | "remove";


export function PanelVaultUpdate({ requestBalance, vaultAddress, vaultInput, vaultOutput, decimals }: { decimals: number, requestBalance: RequestBalance, vaultAddress: Address, vaultInput: string, vaultOutput: string }) {
  const chain = useChainId();
  const account = useAccount();
  const txFlow = useTransactionFlow();

  const tokenSymbol = vaultInput as TokenSymbol;
  const vaultTokenSymbol = vaultOutput as TokenSymbol;

  const [mode, setMode] = useState<ValueUpdateMode>("add");
  const [inputSymbol, setInputSymbol] = useState<Token["symbol"]>(tokenSymbol);
  const [outputSymbol, setOutputSymbol] = useState<Token["symbol"]>(vaultTokenSymbol);
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [withdrawalDate, setWithdrawalDate] = useState<{ days: number, hours: number, minutes: number, seconds: number } | null>(null);
  const [availableAssets, setAvailableAssets] = useState<Token["symbol"][]>([tokenSymbol]);

  const { setVisible: setModalVisibility, setContent: setModalContent } = useModal()
  // const isWhitelisted = useIsWhitelistedUser(CHAINS[chain]?.CONTRACT_CONVERTER || zeroAddress, "0xf45346dc", account.address)
  const isWhitelisted = true
  useEffect(() => {
    // Initial call
    getNextWithdrawalDate().then(setWithdrawalDate);

    // Set up interval to update every 1 second
    const interval = setInterval(() => {
      getNextWithdrawalDate().then(setWithdrawalDate);
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    if (chain === 747474) {
      setAvailableAssets([tokenSymbol, ...STABLE_SYMBOLS]);
    } else {
      setAvailableAssets([tokenSymbol]);
    }
    // @ts-ignore
    if(BTC_SYMBOLS.includes(inputSymbol))
      setAvailableAssets([tokenSymbol])
  }, [chain]);

  const parsedValue = parseInputFloatWithDecimals(
    value,
    // @ts-ignore
    decimals,
  );

  console.log("H", vaultAddress, vaultInput, vaultOutput, parsedValue[0].toString());

  const { value: valOut, status: valOutStatus } = useEnsoForecast({ inputValue: parsedValue[0].toString(), inputSymbol, outputSymbol, account: account.address, decimals, slippage: 50 });

  const outputAmount = chain === 1 ? parsedValue : parseInputFloatWithDecimals(
    valOut,
    // @ts-ignore
    decimals,
  );
  console.log(valOut);

  const value_ = (focused || !parsedValue || dn.lte(parsedValue, 0)) ? value : `${fmtnum(parsedValue, "full")}`;

  // reading all balances on both chains to not lead to errors on switching available assets
  const balances = Object.fromEntries([inputSymbol, outputSymbol, ...STABLE_SYMBOLS].map((symbol) => ([
    symbol,
    // known collaterals are static so we can safely call this hook in a .map()
    useBalance(account.address, symbol as Token["symbol"]),
  ] as const)));

  const insufficientBalance = parsedValue && balances[inputSymbol].data && dn.lt(balances[inputSymbol].data, parsedValue);

  const allowSubmit = account.isConnected
    && parsedValue
    && dn.gt(parsedValue, 0)
    && !insufficientBalance
    && (chain === 1 || valOutStatus === "success")

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
              contextual={mode === "add" ?
                <Dropdown
                  items={
                    availableAssets.map(symbol => ({
                      icon: <TokenIcon symbol={symbol} />,
                      label: symbol,
                      value: account.isConnected
                        ? fmtnum(balances[symbol]?.data ?? 0)
                        : "−",
                    }))
                  }
                  menuPlacement="end"
                  menuWidth={300}
                  onSelect={(index) => setInputSymbol(availableAssets[index] as Token["symbol"])}
                  // @ts-ignore
                  selected={availableAssets.indexOf(inputSymbol)}
                />
                : <InputTokenBadge
                  background={false}
                  icon={<TokenIcon symbol={inputSymbol as TokenSymbol} />}
                  label={inputSymbol}
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
                        setInputSymbol(vaultTokenSymbol as TokenSymbol);
                        setOutputSymbol(tokenSymbol as TokenSymbol);
                      }
                      else {
                        setInputSymbol(tokenSymbol as TokenSymbol);
                        setOutputSymbol(vaultTokenSymbol as TokenSymbol);
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
                start: mode === "add"
                  ? <EnsoPreview value={chain === 1 ? value_ : valOut} status={chain === 1 ? "success" : valOutStatus} outputSymbol={outputSymbol} />
                  : <EnsoPreview value={value_ || "0"} status={"success"} outputSymbol={outputSymbol} />,
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


      {mode === "remove" && requestBalance && dn.gt(requestBalance.claimableAssets, 0) &&
        <ClaimAssets requestBalance={requestBalance} />
      }

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 24,
          width: "100%",
        }}
      >
        {mode === "remove" &&
          <p className={css({
            color: "content",
            fontSize: "16px",
            textAlign: "center",
          })}>
            Withdrawals requests will be processed every 30 days.
            Next withdrawals will be processed in {withdrawalDate.days} days, {withdrawalDate.hours} hours, {withdrawalDate.minutes} minutes, {withdrawalDate.seconds} seconds.
          </p>
        }
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
                flowId: "vaultUpdate",
                backLink: [
                  `/earn`,
                  "Back to editing",
                ],
                successLink: ["/", "Go to the home page"],
                successMessage: `Your ${mode === "add" ? "deposit" : "withdrawal request"} has been processed successfully.`,
                mode: mode,
                outputAmount: outputAmount,
                amount: parsedValue,
                inputToken: inputSymbol as TokenSymbol, 
                outputToken: outputSymbol as TokenSymbol,
                vault: vaultAddress,
                slippage: 50,
                chainId: chain,
              });
            }}
          />
          : <Button
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

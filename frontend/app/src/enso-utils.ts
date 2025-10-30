import { Address } from "viem";
import type { Token } from "@/src/types";
import { useEffect, useState } from "react";
import { useChainConfig } from "./services/ChainConfigProvider";
import { getOutputValue } from "./actions";
import { getProtocolContract } from "@/src/contracts";

interface EnsoForecastProps {
  inputValue: string;
  inputSymbol: Token["symbol"];
  outputSymbol: Token["symbol"];
  account: Address;
  decimals?: number;
  slippage?: number;
}

export type EnsoForecast = {
  value: string;
  status: "idle" | "loading" | "success" | "error";
};

export default function useEnsoForecast({
  inputValue,
  inputSymbol,
  outputSymbol,
  account,
  slippage = 50,
  decimals = 18,
}: EnsoForecastProps): EnsoForecast {
  const [value, setValue] = useState("0");
  const [status, setStatus] = useState<EnsoForecast["status"]>("idle");
  const { chainConfig } = useChainConfig();

  const getTokenAddress = (symbol: string) : Address => {
    return symbol === "bvUSD"
      ? getProtocolContract(chainConfig, "BoldToken").address
      : symbol === "sbvUSD"
      ? getProtocolContract(chainConfig, "Vault").address
      : chainConfig.TOKENS[symbol]?.address?? null
  }

  useEffect(() => {
    if (!inputValue || inputValue === "0" || !account) {
      setValue("0");
      setStatus("idle");
      return;
    }

    const timeoutId = setTimeout(() => {
      setStatus("loading");
      getOutputValue({
        chainConfig,
        inputValue,
        inputAddress: getTokenAddress(inputSymbol),
        outputAddress: getTokenAddress(outputSymbol),
        account,
        slippage,
        decimals,
      }).then((res) => {
        setValue(res.value);
        setStatus(res.status);
      });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [inputValue, inputSymbol, outputSymbol, account, slippage]);

  console.log("V", value);
  return {
    value,
    status,
  };
}

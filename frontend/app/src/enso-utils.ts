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
  slippage?: number
}

export type EnsoForecast = {
  value: string;
  status: "idle" | "loading" | "success" | "error";
}

export default function useEnsoForecast({ inputValue, inputSymbol, outputSymbol, account, slippage = 50, decimals = 18}: EnsoForecastProps): EnsoForecast {
  const [value, setValue] = useState("0");
  const [status, setStatus] = useState<EnsoForecast["status"]>("idle");
  const { chainConfig } = useChainConfig();

  const inputAddress = inputSymbol === "bvUSD" ? getProtocolContract(chainConfig, inputSymbol).address : chainConfig.VAULTS[inputSymbol]?.asset ?? chainConfig.VAULTS[outputSymbol]?.asset
  const outputAddress = outputSymbol === "sbvUSD" ? getProtocolContract(chainConfig, outputSymbol).address : chainConfig.VAULTS[inputSymbol]?.address ?? chainConfig.VAULTS[outputSymbol]?.asset

  useEffect(() => {
    if (!inputValue || inputValue === "0" || !account) {
      setValue("0");
      setStatus("idle");
      return;
    }

    const timeoutId = setTimeout(() => {
      setStatus("loading");
      getOutputValue({ chainConfig, inputValue, inputAddress, outputAddress, outputSymbol, account, slippage, decimals })
        .then(res => {
          setValue(res.value)
          setStatus(res.status)
        });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [inputValue, inputSymbol, outputSymbol, account, slippage]);

  return {
    value,
    status,
  }
}

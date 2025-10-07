import { Address } from "viem";
import type { Token } from "@/src/types";
import { useEffect, useState } from "react";
import { getOutputValue } from "./actions";

interface EnsoForecastProps {
  inputValue: string;
  inputSymbol: Token["symbol"];
  outputSymbol: Token["symbol"];
  account: Address;
  slippage?: number
}

export type EnsoForecast = {
  value: string;
  status: "idle" | "loading" | "success" | "error";
}

export default function useEnsoForecast({ inputValue, inputSymbol, outputSymbol, account, slippage = 50 }: EnsoForecastProps): EnsoForecast {
  const [value, setValue] = useState("0");
  const [status, setStatus] = useState<EnsoForecast["status"]>("idle");

  useEffect(() => {
    if (!inputValue || inputValue === "0" || !account) {
      setValue("0");
      setStatus("idle");
      return;
    }

    const timeoutId = setTimeout(() => {
      setStatus("loading");
      getOutputValue({ inputValue, inputSymbol, outputSymbol, account, slippage })
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

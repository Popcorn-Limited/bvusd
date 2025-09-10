import { Address } from "viem";
import type { Token } from "@/src/types";
import { useEffect, useState } from "react";
import { getProtocolContract } from "./contracts";
import { ENSO_API_KEY } from "./env";
import { fmtnum } from "./formatting";

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
    if (!inputValue || inputValue === "0") {
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
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [inputValue, inputSymbol, outputSymbol, account, slippage]);

  return {
    value,
    status,
  }
}

interface EnsoRouteProps {
  inputValue: string;
  inputSymbol: Token["symbol"];
  outputSymbol: Token["symbol"];
  account: Address;
  slippage?: number
}

async function getOutputValue({ inputValue, inputSymbol, outputSymbol, account, slippage = 50 }: EnsoRouteProps): Promise<EnsoForecast> {
  if (!inputValue || inputValue === "0") {
    return { value: "0", status: "success" };
  }

  const url = `https://api.enso.finance/api/v1/shortcuts/route?chainId=747474&slippage=${slippage}&destinationChainId=747474&receiver=${account}&spender=${account}&refundReceiver=${account}&fromAddress=${account}&amountIn=${inputValue}&tokenIn=${getProtocolContract(inputSymbol).address}&tokenOut=${getProtocolContract(outputSymbol).address}&routingStrategy=router`;
  const options = { method: 'GET', headers: { Accept: 'application/json', Authorization: `Bearer ${ENSO_API_KEY}` }, body: undefined };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (data.error) {
      return { value: "0", status: "error" };
    }
    return { value: fmtnum(Number(data.amountOut) / 10 ** (outputSymbol.includes("bvUSD") ? 18 : 6)), status: "success" };
  } catch (error) {
    return { value: "0", status: "error" };
  }
}

export async function getEnsoRoute({ inputValue, inputSymbol, outputSymbol, account, slippage = 50 }: EnsoRouteProps): Promise<any> {
  const url = `https://api.enso.finance/api/v1/shortcuts/route?chainId=747474&slippage=${slippage}&destinationChainId=747474&receiver=${account}&spender=${account}&refundReceiver=${account}&fromAddress=${account}&amountIn=${inputValue}&tokenIn=${getProtocolContract(inputSymbol).address}&tokenOut=${getProtocolContract(outputSymbol).address}&routingStrategy=router`;
  const options = { method: 'GET', headers: { Accept: 'application/json', Authorization: `Bearer ${ENSO_API_KEY}` }, body: undefined };

  const response = await fetch(url, options);
  const data = await response.json();
  return data;
}
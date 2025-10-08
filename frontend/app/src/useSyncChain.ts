"use client";

import { useEffect } from "react";
import { useChainId } from "wagmi";
import { useChainConfig } from "./services/ChainConfigProvider";

export function useSyncChain() {
  const chainId = useChainId();
  const { setChainId } = useChainConfig();

  useEffect(() => {
    if (chainId) setChainId(chainId);
  }, [chainId, setChainId]);
}
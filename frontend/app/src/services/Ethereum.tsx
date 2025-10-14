"use client";

import type { ReactNode } from "react";

import { blo } from "blo";
import { ConnectKitProvider } from "connectkit";
import { WagmiProvider } from "wagmi";
import { ChainConfigProvider } from "./ChainConfigProvider";
import { ChainSyncer } from "../comps/ChainSyncer";
import { wagmiChains } from "../wagmi-utils";

export function Ethereum({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiChains}>
      <ConnectKitProvider
        mode="light"
        options={{
          avoidLayoutShift: true,
          customAvatar: ({ address, size }) =>
            address && (
              <img
                alt={address}
                src={blo(address)}
                width={size}
                height={size}
              />
            ),
          embedGoogleFonts: false,
          hideBalance: true,
          hideQuestionMarkCTA: true,
          hideRecentBadge: true,
          language: "en-US",
          overlayBlur: 0,
          reducedMotion: true,
          walletConnectCTA: "link",
          walletConnectName: "WalletConnect",
        }}
      >
        <ChainConfigProvider>
          <ChainSyncer />
          {children}
        </ChainConfigProvider>
      </ConnectKitProvider>
    </WagmiProvider>
  );
}

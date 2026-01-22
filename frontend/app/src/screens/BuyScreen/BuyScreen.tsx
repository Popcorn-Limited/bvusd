"use client";

import { Screen } from "@/src/comps/Screen/Screen";
import { useAccount } from "@/src/wagmi-utils";
import { PanelConvert, STABLE_SYMBOLS } from "./PanelConvert";
import content from "@/src/content";
import { HFlex, TextButton, TokenIcon } from "@liquity2/uikit";
import { useRouter } from "next/navigation";
import { css } from "@/styled-system/css";

export function BuyScreen() {
  const account = useAccount();
  const router = useRouter();

  return (
    <Screen
      heading={{
        title: (
          <HFlex>
            {content.buyScreen.headline(
              <TokenIcon.Group>
                {STABLE_SYMBOLS.map(symbol => (
                  <TokenIcon
                    key={symbol}
                    symbol={symbol}
                  />
                ))}
              </TokenIcon.Group>,
              <TokenIcon symbol="bvUSD" />,
            )}
          </HFlex>
        ),
        subtitle: (
          <HFlex>
            {content.buyScreen.subheading(
              <TextButton label="Stake" onClick={() => {
                router.push("/");
              }} />,
              <TokenIcon symbol="bvUSD" size="mini" />,
            )}
          </HFlex>
        )
      }}
    >
      <div
        className={css({
          width: { base: "100%", medium: "50%" },
          margin: "0 auto",
        })}
      >
        <PanelConvert />
      </div>
    </Screen>
  );
}

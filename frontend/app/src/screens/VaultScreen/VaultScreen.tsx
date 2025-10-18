"use client";

import { Screen } from "@/src/comps/Screen/Screen";
import content from "@/src/content";
import { css } from "@/styled-system/css";
import { HFlex } from "@liquity2/uikit";
import { VaultPanel } from "./VaultPanel";
import { VaultFAQPanel } from "./VaultFAQPanel";


export function VaultPoolScreen() {
  return (
    <Screen
      ready={true}
      heading={{
        title: content.vaultScreen.headline,
        subtitle: (
          <HFlex gap={16}>
            {content.vaultScreen.subheading(
              <HFlex gap={16}>
                <img
                  src="/investors/fasanara.png"
                  alt="Fasanara"
                  className={css({
                    width: 85,
                    height: 24
                  })}
                />
                <img
                  src="/investors/LM5.png"
                  alt="LM5"
                  className={css({
                    width: 125,
                    height: 24
                  })}
                />
                 <img
                  src="/investors/M1.png"
                  alt="M1"
                  className={css({
                    width: 56,
                    height: 24
                  })}
                />
              </HFlex>
            )}
          </HFlex>
        ),
      }}
    >
      <VaultPanel />
      <VaultFAQPanel />
    </Screen>
  );
}
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
                  src="/investors/gsr.png"
                  alt="Gsr"
                  className={css({
                    width: 68,
                    height: 18
                  })}
                />
                <img
                  src="/investors/auros.png"
                  alt="Auros"
                  className={css({
                    width: 92,
                    height: 18
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
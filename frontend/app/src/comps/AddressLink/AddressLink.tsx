import type { Address } from "@/src/types";
import { ReactNode } from "react";

import { css } from "@/styled-system/css";
import { AnchorTextButton, shortenAddress } from "@liquity2/uikit";
import { blo } from "blo";
import Image from "next/image";
import { useChainConfig } from "@/src/services/ChainConfigProvider";

export function AddressLink({
  address,
  label,
}: {
  address: Address;
  label?: ReactNode;
}) {
  const { chainConfig } = useChainConfig();

  if (!chainConfig.CHAIN_BLOCK_EXPLORER) {
    throw new Error("CHAIN_BLOCK_EXPLORER is not defined");
  }
  return (
    <AnchorTextButton
      external
      href={`${chainConfig.CHAIN_BLOCK_EXPLORER}address/${address}`}
      label={
        <div
          className={css({
            display: "flex",
            gap: 4,
            alignItems: "center",
          })}
        >
          <Image
            alt=""
            width={16}
            height={16}
            src={blo(address)}
            className={css({
              borderRadius: "50%",
            })}
          />
          {label ?? shortenAddress(address, 3)}
        </div>
      }
    />
  );
}

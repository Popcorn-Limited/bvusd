import { useChainConfig } from "@/src/services/ChainConfigProvider";
import type { Address } from "@/src/types";

import { css } from "@/styled-system/css";
import { AnchorTextButton, shortenAddress } from "@liquity2/uikit";
import { blo } from "blo";
import Image from "next/image";

export function AccountButton({
  address,
}: {
  address: Address;
}) {
  const { chainConfig } = useChainConfig();

  return (
    <AnchorTextButton
      key="start"
      label={
        <div
          title={address}
          className={css({
            display: "flex",
            alignItems: "center",
            gap: 4,
          })}
        >
          <Image
            alt=""
            width={16}
            height={16}
            src={blo(address)}
            className={css({
              display: "block",
              borderRadius: 4,
            })}
          />
          {shortenAddress(address, 4).toLowerCase()}
        </div>
      }
      href={`${chainConfig.CHAIN_BLOCK_EXPLORER}address/${address}`}
      external
    />
  );
}

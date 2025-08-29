import { css } from "@/styled-system/css";
import { Spoiler } from "@liquity2/uikit";

export function VaultFAQPanel() {
  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
        gap: 16,
        padding: "24px 0 24px 0",
        borderTop: "1px solid token(colors.fieldBorder)",
      })}
    >
      <div>
        <h2
          className={css({
            fontSize: 28,
            marginBottom: 4,
          })}>
          FAQ
        </h2>
        <Spoiler title="What is the Vault?" marginBottom={4}>
          <p className={css({
            color: "contentAlt",
            fontWeight: 300,
            letterSpacing: 0.01,
          })}>
            The Vault is a pool of funds that is used to provide liquidity to the BitVault protocol.
          </p>
        </Spoiler>
        <Spoiler title="What is the Vault?" marginBottom={4}>
          <p className={css({
            color: "contentAlt",
            fontWeight: 300,
            letterSpacing: 0.01,
          })}>
            The Vault is a pool of funds that is used to provide liquidity to the BitVault protocol.
          </p>
        </Spoiler>
        <Spoiler title="What is the Vault?" marginBottom={4}>
          <p className={css({
            color: "contentAlt",
            fontWeight: 300,
            letterSpacing: 0.01,
          })}>
            The Vault is a pool of funds that is used to provide liquidity to the BitVault protocol.
          </p>
        </Spoiler>
      </div>
    </div>
  )
}
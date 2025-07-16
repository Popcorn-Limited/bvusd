import { useAccount } from "@/src/wagmi-utils";
import { css } from "@/styled-system/css";
import { TextButton } from "@liquity2/uikit";

export function ConnectWarningBox() {
  const account = useAccount();

  return !account.isConnected && (
    <div
      className={css({
        padding: "16px 24px",
        textAlign: "center",
        background: "none",
        color: "content",
        borderRadius: 8,
        border: "1px solid token(colors.accent)",
      })}
    >
      Please{" "}
      <TextButton
        label="connect"
        onClick={() => {
          account.connect();
        }}
      />{" "}
      your wallet to continue.
    </div>
  );
}

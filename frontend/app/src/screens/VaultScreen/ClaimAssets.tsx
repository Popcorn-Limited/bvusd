import { fmtnum } from "@/src/formatting";
import { useTransactionFlow } from "@/src/services/TransactionFlow";
import { RequestBalance } from "@/src/types";
import { css } from "@/styled-system/css";
import { TokenIcon } from "@liquity2/uikit";
import { Button } from "@liquity2/uikit";
import { useAccount } from "wagmi";

export default function ClaimAssets({ requestBalance }: { requestBalance: RequestBalance }) {
  const account = useAccount();
  const txFlow = useTransactionFlow();

  return (
    <div
      className={css({
        position: "relative",
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        background: `fieldSurface`,
        border: "1px solid token(colors.fieldBorder)",
        borderRadius: 8,
        padding: 16,
      })}
    >
      <p className={css({
        fontSize: "16px",
        color: "contentAlt",
        whiteSpace: "nowrap",
      })}>
        Claimable Asssets
      </p>
      <div className={css({
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      })}>
        <div className={css({
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: 5
        })}>
          <p>{fmtnum(requestBalance.claimableAssets)}</p>
          <TokenIcon symbol="bvUSD" size="mini" title={null} />
        </div>
        <Button
          label="Claim"
          mode="primary"
          size="mini"
          shape="rounded"
          onClick={() => {
            if (!account.address || !requestBalance) {
              return;
            }

            txFlow.start({
              flowId: "vaultUpdate",
              backLink: [
                `/vault`,
                "Back to editing",
              ],
              successLink: ["/", "Go to the home page"],
              successMessage: `Your claim has been processed successfully.`,
              mode: "claim",
              amount: requestBalance.claimableAssets,
              inputToken: "sbvUSD",
              outputToken: "bvUSD",
              slippage: 50,
            });
          }}
        >
          Claim
        </Button>
      </div>
    </div>
  );
}
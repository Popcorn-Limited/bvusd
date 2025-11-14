import type { FlowDeclaration } from "@/src/services/TransactionFlow";

import { TransactionDetailsRow } from "@/src/screens/TransactionsScreen/TransactionsScreen";
import { TransactionStatus } from "@/src/screens/TransactionsScreen/TransactionStatus";
import { vDnum } from "@/src/valibot-utils";
import * as v from "valibot";
import { createRequestSchema, verifyTransaction } from "./shared";
import { erc20Abi, erc4626Abi, maxUint256 } from "viem";
import { readContract, sendTransaction } from "wagmi/actions";

import { fmtnum } from "../formatting";
import { getProtocolContract } from "../contracts";
import { STABLE_SYMBOLS } from "../screens/BuyScreen/PanelConvert";
import { Vault } from "../abi/Vault";
import { getEnsoRoute } from "@/src/actions";

const RequestSchema = createRequestSchema(
  "vaultUpdate",
  {
    amount: vDnum(),
    outputAmount: vDnum(),
    inputToken: v.union([v.literal("USDC"), v.literal("USDT"), v.literal("bvUSD"), v.literal("sbvUSD")]),
    outputToken: v.union([v.literal("bvUSD"), v.literal("sbvUSD")]),
    mode: v.union([v.literal("remove"), v.literal("add"), v.literal("claim")]),
    slippage: v.number(),
    chainId: v.number(),
  },
);

export type VaultUpdateRequest = v.InferOutput<typeof RequestSchema>;

export const vaultUpdate: FlowDeclaration<VaultUpdateRequest> = {
  title: "Review & Send Transaction",

  Summary({ request }) {
    return (<></>
      // <VaultPositionSummary
      //   earnPosition={{
      //     ...request.earnPosition,

      //     // compound bvUSD rewards if not claiming
      //     deposit: request.earnPosition.deposit,
      //     rewards: {
      //       // bvUSD rewards are claimed or compounded
      //       bold: DNUM_0,
      //       coll: DNUM_0
      //     },
      //   }}
      //   prevEarnPosition={dn.eq(request.prevEarnPosition.deposit, 0)
      //     ? null
      //     : request.prevEarnPosition}
      //   txPreviewMode
      // />
    );
  },

  Details({ request }) {
    const { amount, outputAmount, inputToken, outputToken } = request;

    return (
      <>
        <TransactionDetailsRow
          label="Input Amount"
          value={[
            `${fmtnum(amount)} ${inputToken}`,
          ]}
        />
        <TransactionDetailsRow
          label="Output Amount"
          value={[
            `${fmtnum(outputAmount)} ${outputToken}`,
          ]}
        />
      </>
    );
  },

  steps: {
    // Approve
    approve: {
      name: (ctx) => {
        return `Approve Token`;
      },
      Status: (props) => (
        <TransactionStatus
          {...props}
          approval="approve-only"
        />
      ),
      async commit(ctx) {
        return ctx.writeContract({
          address: getProtocolContract(ctx.contractConfig, ctx.request.inputToken).address,
          abi: erc20Abi,
          functionName: "approve",
          args: [
            // @ts-ignore
            STABLE_SYMBOLS.includes(ctx.request.inputToken) ? ctx.contractConfig.ENSO_ROUTER : ctx.contractConfig.CONTRACT_VAULT,
            ctx.preferredApproveMethod === "approve-infinite"
              ? maxUint256 // infinite approval
              : ctx.request.amount[0], // exact amount
          ],
        });
      },
      async verify(ctx, hash) {
        await verifyTransaction(ctx.wagmiConfig, ctx.account, hash, ctx.isSafe);
      },
    },

    deposit: {
      name: () => "Deposit",
      Status: TransactionStatus,
      async commit(ctx) {
        return ctx.writeContract({
          address: ctx.contractConfig.CONTRACT_VAULT,
          abi: erc4626Abi,
          functionName: "deposit",
          args: [ctx.request.amount[0], ctx.account],
        });
      },
      async verify(ctx, hash) {
        await verifyTransaction(ctx.wagmiConfig, ctx.account, hash, ctx.isSafe);
      },
    },

    zapDeposit: {
      name: () => "Zap Deposit",
      Status: TransactionStatus,
      async commit(ctx) {
        const ensoData = await getEnsoRoute({
          chainConfig: ctx.contractConfig,
          inputValue: ctx.request.amount[0].toString(),
          inputAddress: getProtocolContract(ctx.contractConfig, ctx.request.inputToken).address,
          outputAddress: getProtocolContract(ctx.contractConfig, ctx.request.outputToken).address,
          account: ctx.account,
          slippage: ctx.request.slippage
        });

        return sendTransaction(ctx.wagmiConfig, {
          account: ctx.account,
          to: ensoData.tx.to,
          data: ensoData.tx.data,
          value: ensoData.tx.value,
        });
        // return ctx.writeContract({
        //   address: CONTRACT_STABLE_VAULT_ZAPPER,
        //   abi: StableToVaultZapper,
        //   functionName: "deposit",
        //   args: [getProtocolContract(ctx.request.inputToken).address, ctx.request.amount[0]],
        // });
      },
      async verify(ctx, hash) {
        await verifyTransaction(ctx.wagmiConfig, ctx.account, hash, ctx.isSafe);
      },
    },

    requestWithdrawal: {
      name: () => "Request Withdrawal",
      Status: TransactionStatus,
      async commit(ctx) {
        return ctx.writeContract({
          address: ctx.contractConfig.CONTRACT_VAULT,
          abi: Vault,
          functionName: "requestRedeem",
          args: [ctx.request.amount[0]],
        });
      },
      async verify(ctx, hash) {
        await verifyTransaction(ctx.wagmiConfig, ctx.account, hash, ctx.isSafe);
      },
    },
    claimWithdrawal: {
      name: () => "Claim Withdrawal",
      Status: TransactionStatus,
      async commit(ctx) {
        return ctx.writeContract({
          address: ctx.contractConfig.CONTRACT_VAULT,
          abi: Vault,
          functionName: "redeem",
          args: [ctx.request.amount[0]],
        });
      },
      async verify(ctx, hash) {
        await verifyTransaction(ctx.wagmiConfig, ctx.account, hash, ctx.isSafe);
      }
    }
  },

  async getSteps(ctx) {
    const steps: string[] = [];
    const { inputToken, outputToken, mode, amount } = ctx.request;

    switch (mode) {
      case "add":
        // @ts-ignore
        const addAllowance = await readContract(ctx.wagmiConfig, {
          address: getProtocolContract(ctx.contractConfig, inputToken).address,
          abi: erc20Abi,
          functionName: "allowance",
          args: [
            ctx.account,
            // @ts-ignore
            STABLE_SYMBOLS.includes(ctx.request.inputToken) ? ctx.contractConfig.ENSO_ROUTER : ctx.contractConfig.CONTRACT_VAULT
          ],
        });
        if (addAllowance < amount[0]) {
          steps.push("approve");
        }
        // @ts-ignore
        if (STABLE_SYMBOLS.includes(ctx.request.inputToken)) {
          steps.push("zapDeposit");
        }
        else {
          steps.push("deposit");
        }
        return steps
      case "remove":
        // @ts-ignore
        const removeAllowance = await readContract(ctx.wagmiConfig, {
          address: getProtocolContract(ctx.contractConfig, inputToken).address,
          abi: erc20Abi,
          functionName: "allowance",
          args: [ctx.account, ctx.contractConfig.CONTRACT_VAULT],
        });
        if (removeAllowance < amount[0]) {
          steps.push("approve");
        }
        steps.push("requestWithdrawal");
        return steps
      case "claim":
        steps.push("claimWithdrawal");
        return steps
    }
  },

  parseRequest(request) {
    return v.parse(RequestSchema, request);
  },
};
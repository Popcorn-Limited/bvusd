import type { FlowDeclaration } from "@/src/services/TransactionFlow";

import { TransactionDetailsRow } from "@/src/screens/TransactionsScreen/TransactionsScreen";
import { TransactionStatus } from "@/src/screens/TransactionsScreen/TransactionStatus";
import { vDnum } from "@/src/valibot-utils";
import * as v from "valibot";
import { createRequestSchema, verifyTransaction } from "./shared";
import { readContract, sendTransaction } from "wagmi/actions";
import { erc20Abi, maxUint256 } from "viem";
import { fmtnum } from "@/src/formatting";
import { getProtocolContract } from "../contracts";
import { getEnsoRoute } from "@/src/actions";

const RequestSchema = createRequestSchema(
  "convert",
  {
    amount: vDnum(),
    outputAmount: vDnum(),
    inputToken: v.union([v.literal("USDC"), v.literal("USDT"), v.literal("bvUSD")]),
    outputToken: v.union([v.literal("USDC"), v.literal("USDT"), v.literal("bvUSD")]),
    mode: v.union([v.literal("buy"), v.literal("sell")]),
    slippage: v.number(),
  },
);

export type ConvertRequest = v.InferOutput<typeof RequestSchema>;

export const convert: FlowDeclaration<ConvertRequest> = {
  title: "Review & Send Transaction",

  Summary({ request }) {
    return <></>
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
            ctx.contractConfig.ENSO_ROUTER,
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

    // buy bvUSD
    buy: {
      name: () => "Buy bvUSD",
      Status: TransactionStatus,

      async commit(ctx) {
        const ensoData = await getEnsoRoute({
          chainConfig: ctx.contractConfig,
          inputValue: ctx.request.amount[0].toString(),
          inputSymbol: ctx.request.inputToken,
          outputSymbol: ctx.request.outputToken,
          account: ctx.account,
          slippage: ctx.request.slippage
        });

        return sendTransaction(ctx.wagmiConfig, {
          account: ctx.account,
          to: ensoData.tx.to,
          data: ensoData.tx.data,
          value: ensoData.tx.value,
        });

          // Only using Enso for now
          // const Converter = getProtocolContract("Converter");

        // return ctx.writeContract({
        //   address: Converter.address,
        //   abi: Converter.abi,
        //   functionName: "deposit",
        //   args: [getProtocolContract(ctx.request.inputToken).address, ctx.request.amount[0]],
        // });
      },

      async verify(ctx, hash) {
        await verifyTransaction(ctx.wagmiConfig, ctx.account, hash, ctx.isSafe);
      },
    },

    // sell bvUSD
    sell: {
      name: () => "Sell bvUSD",
      Status: TransactionStatus,

      async commit(ctx) {
        const ensoData = await getEnsoRoute({
          chainConfig: ctx.contractConfig,
          inputValue: ctx.request.amount[0].toString(),
          inputSymbol: ctx.request.inputToken,
          outputSymbol: ctx.request.outputToken,
          account: ctx.account,
          slippage: ctx.request.slippage
        });

        return sendTransaction(ctx.wagmiConfig, {
          account: ctx.account,
          to: ensoData.tx.to,
          data: ensoData.tx.data,
          value: ensoData.tx.value,
        });
      },

      async verify(ctx, hash) {
        await verifyTransaction(ctx.wagmiConfig, ctx.account, hash, ctx.isSafe);
      },
    },
  },

  async getSteps(ctx) {
    // Check if approval is needed
    // @ts-ignore
    const allowance = await readContract(ctx.wagmiConfig, {
      address: getProtocolContract(ctx.contractConfig, ctx.request.inputToken).address,
      abi: erc20Abi,
      functionName: "allowance",
      args: [ctx.account, ctx.contractConfig.ENSO_ROUTER],
    });

    const steps: string[] = [];

    if (allowance < ctx.request.amount[0]) {
      steps.push("approve");
    }

    if (ctx.request.mode === "buy") {
      steps.push("buy");
    }
    else {
      steps.push("sell");
    }

    return steps;
  },

  parseRequest(request) {
    return v.parse(RequestSchema, request);
  },
};

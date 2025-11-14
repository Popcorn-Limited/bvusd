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
import { Converter } from "../abi/Converter";

const RequestSchema = createRequestSchema(
  "convert",
  {
    amount: vDnum(),
    outputAmount: vDnum(),
    inputToken: v.union([v.literal("USDC"), v.literal("USDT"), v.literal("bvUSD")]),
    outputToken: v.union([v.literal("USDC"), v.literal("USDT"), v.literal("bvUSD")]),
    mode: v.union([v.literal("buy"), v.literal("sell")]),
    slippage: v.number(),
    chainId: v.number(),
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
        const target = ctx.request.chainId === 747474 ? ctx.contractConfig.ENSO_ROUTER : ctx.contractConfig.CONTRACT_CONVERTER;
        return ctx.writeContract({
          address: getProtocolContract(ctx.contractConfig, ctx.request.inputToken).address,
          abi: erc20Abi,
          functionName: "approve",
          args: [
            target,
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
        if (ctx.request.chainId === 747474) {
          const ensoData = await getEnsoRoute({
            chainConfig: ctx.contractConfig,
            inputValue: ctx.request.amount[0].toString(),
            inputAddress: getProtocolContract(ctx.contractConfig, ctx.request.inputToken).address,
            outputAddress: getProtocolContract(ctx.contractConfig, ctx.request.outputToken).address,
            account: ctx.account,
            slippage: ctx.request.slippage,
          });

          return sendTransaction(ctx.wagmiConfig, {
            account: ctx.account,
            to: ensoData.tx.to,
            data: ensoData.tx.data,
            value: ensoData.tx.value,
          });
        } else {
          return ctx.writeContract({
            address: ctx.contractConfig.CONTRACT_CONVERTER,
            abi: Converter,
            functionName: "deposit",
            args: [getProtocolContract(ctx.contractConfig, ctx.request.inputToken).address, ctx.request.amount[0]],
          });
        }
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
          inputAddress: getProtocolContract(ctx.contractConfig, ctx.request.inputToken).address,
          outputAddress: getProtocolContract(ctx.contractConfig, ctx.request.outputToken).address,
          account: ctx.account,
          slippage: ctx.request.slippage,
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
    const target = ctx.request.chainId === 747474 ? ctx.contractConfig.ENSO_ROUTER : ctx.contractConfig.CONTRACT_CONVERTER;
    // @ts-ignore
    const allowance = await readContract(ctx.wagmiConfig, {
      address: getProtocolContract(ctx.contractConfig, ctx.request.inputToken).address,
      abi: erc20Abi,
      functionName: "allowance",
      args: [ctx.account, target],
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

import type { FlowDeclaration } from "@/src/services/TransactionFlow";

import { Amount } from "@/src/comps/Amount/Amount";
import { TransactionDetailsRow } from "@/src/screens/TransactionsScreen/TransactionsScreen";
import { TransactionStatus } from "@/src/screens/TransactionsScreen/TransactionStatus";
import { vAddress, vDnum, vUnderlyingToken } from "@/src/valibot-utils";
import * as dn from "dnum";
import * as v from "valibot";
import { createRequestSchema, verifyTransaction } from "./shared";
import { readContract, sendTransaction } from "wagmi/actions";
import { erc20Abi, maxUint256 } from "viem";
import { fmtnum } from "@/src/formatting";
import { usePrice } from "@/src/services/Prices";
import { CONTRACT_CONVERTER, ENSO_API_KEY } from "@/src/env";
import { Converter } from "../abi/Converter";
import { getProtocolContract } from "../contracts";

const ENSO_ROUTER = "0x3067BDBa0e6628497d527bEF511c22DA8b32cA3F"

const RequestSchema = createRequestSchema(
  "convert",
  {
    amount: vDnum(),
    inputToken: v.union([v.literal("USDC"), v.literal("USDT"), v.literal("bvUSD")]),
    outputToken: v.union([v.literal("USDC"), v.literal("USDT"), v.literal("bvUSD")]),
    mode: v.union([v.literal("buy"), v.literal("sell")]),
  },
);

export type ConvertRequest = v.InferOutput<typeof RequestSchema>;

export const convert: FlowDeclaration<ConvertRequest> = {
  title: "Review & Send Transaction",

  Summary({ request }) {
    return <></>
  },

  Details({ request }) {
    const { amount, inputToken, outputToken } = request;

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
            `${fmtnum(amount)} ${outputToken}`,
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
          address: getProtocolContract(ctx.request.inputToken).address,
          abi: erc20Abi,
          functionName: "approve",
          args: [
            ctx.request.mode === "buy" ? CONTRACT_CONVERTER : ENSO_ROUTER,
            ctx.preferredApproveMethod === "approve-infinite"
              ? maxUint256 // infinite approval
              : ctx.request.amount[0], // exact amount
          ],
        });
      },
      async verify(ctx, hash) {
        await verifyTransaction(ctx.wagmiConfig, hash, ctx.isSafe);
      },
    },

    // buy bvUSD
    buy: {
      name: () => "Buy bvUSD",
      Status: TransactionStatus,

      async commit(ctx) {
        const Converter = getProtocolContract("Converter");

        return ctx.writeContract({
          address: Converter.address,
          abi: Converter.abi,
          functionName: "deposit",
          args: [getProtocolContract(ctx.request.inputToken).address, ctx.request.amount[0]],
        });
      },

      async verify(ctx, hash) {
        await verifyTransaction(ctx.wagmiConfig, hash, ctx.isSafe);
      },
    },

    // sell bvUSD
    sell: {
      name: () => "Sell bvUSD",
      Status: TransactionStatus,

      async commit(ctx) {
        const ensoRes = await fetch(`https://api.enso.finance/api/v1/shortcuts/route?chainId=747474&fromAddress=${ctx.account}&receiver=${ctx.account}&spender=${ctx.account}&refundReceiver=${ctx.account}&amountIn=${ctx.request.amount[0].toString()}&slippage=50&fee=10&feeReceiver=0x22f5413C075Ccd56D575A54763831C4c27A37Bdb&tokenIn=0x876aac7648D79f87245E73316eB2D100e75F3Df1&tokenOut=${getProtocolContract(ctx.request.outputToken).address}`)
        const ensoData = await ensoRes.json()

        return sendTransaction(ctx.wagmiConfig, {
          account: ctx.account,
          to: ensoData.tx.to,
          data: ensoData.tx.data,
          value: ensoData.tx.value,
        });
      },

      async verify(ctx, hash) {
        await verifyTransaction(ctx.wagmiConfig, hash, ctx.isSafe);
      },
    },
  },

  async getSteps(ctx) {
    // Check if approval is needed
    const allowance = await readContract(ctx.wagmiConfig, {
      address: getProtocolContract(ctx.request.inputToken).address,
      abi: erc20Abi,
      functionName: "allowance",
      args: [ctx.account, ctx.request.mode === "buy" ? CONTRACT_CONVERTER : ENSO_ROUTER],
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

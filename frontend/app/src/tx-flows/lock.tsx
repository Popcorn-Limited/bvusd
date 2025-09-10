import type { FlowDeclaration } from "@/src/services/TransactionFlow";

import { TransactionDetailsRow } from "@/src/screens/TransactionsScreen/TransactionsScreen";
import { TransactionStatus } from "@/src/screens/TransactionsScreen/TransactionStatus";
import { vDnum } from "@/src/valibot-utils";
import * as v from "valibot";
import { createRequestSchema, verifyTransaction } from "./shared";
import { readContract } from "wagmi/actions";
import { erc20Abi, maxUint256 } from "viem";
import { fmtnum } from "../formatting";
import { getProtocolContract } from "../contracts";

const RequestSchema = createRequestSchema(
  "lockToken",
  {
    amount: vDnum(),
    token: v.literal("bvUSD"),
    mode: v.union([v.literal("lock"), v.literal("unlock")]),
  },
);

export type LockTokenRequest = v.InferOutput<typeof RequestSchema>;

export const lockToken: FlowDeclaration<LockTokenRequest> = {
  title: "Review & Send Transaction",

  Summary({ request }) {
    return <></>
  },

  Details({ request }) {
    const { amount, token } = request;

    return (
      <>
        <TransactionDetailsRow
          label={request.mode === "lock" ? "Lock Amount" : "Unlock Amount"}
          value={[
            `${fmtnum(amount)} ${token}`,
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
          address: getProtocolContract(ctx.request.token).address,
          abi: erc20Abi,
          functionName: "approve",
          args: [
            getProtocolContract("TokenLocker").address,
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

    // lock Token
    lockToken: {
      name: () => "Lock Token",
      Status: TransactionStatus,

      async commit(ctx) {
        const locker = getProtocolContract("TokenLocker");
        return ctx.writeContract({
          address: locker.address,
          abi: locker.abi,
          functionName: "deposit",
          args: [ctx.request.amount[0]],
        });
      },

      async verify(ctx, hash) {
        await verifyTransaction(ctx.wagmiConfig, ctx.account, hash, ctx.isSafe);
      },
    },

    // unlock Token
    unlockToken: {
      name: () => "Unlock Token",
      Status: TransactionStatus,

      async commit(ctx) {
        const locker = getProtocolContract("TokenLocker");
        return ctx.writeContract({
          address: locker.address,
          abi: locker.abi,
          functionName: "withdraw",
          args: [ctx.request.amount[0], ctx.account],
        });
      },

      async verify(ctx, hash) {
        await verifyTransaction(ctx.wagmiConfig, ctx.account, hash, ctx.isSafe);
      },

    },
  },

  async getSteps(ctx) {
    const steps: string[] = [];

    if (ctx.request.mode === "lock") {
      // Check if approval is needed
      const allowance = await readContract(ctx.wagmiConfig, {
        address: getProtocolContract(ctx.request.token).address,
        abi: erc20Abi,
        functionName: "allowance",
        args: [ctx.account, getProtocolContract("TokenLocker").address],
      });

      if (allowance < ctx.request.amount[0]) {
        steps.push("approve");
      }
      steps.push("lockToken");
    } else {
      steps.push("unlockToken");
    }

    return steps;
  },

  parseRequest(request) {
    return v.parse(RequestSchema, request);
  },
};

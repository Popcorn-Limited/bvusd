import "server-only";
import { NextResponse } from "next/server";

type ChainId = "1" | "747474"; // supported chains

const RPC_URL = {
  "1": `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
  "747474": "https://rpc.katana.network",
} satisfies Record<ChainId, string>;

// TODO method evaluation?
export async function POST(
  req: Request,
  { params }: { params: { chain: string } },
) {
  const chain = params.chain as ChainId;

  const upstream = RPC_URL[chain];
  if (!upstream) {
    return NextResponse.json({ error: "Unsupported chain" }, { status: 400 });
  }

  const bodyText = await req.text();

  // rpc call
  const upstreamRes = await fetch(upstream, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: bodyText,
  });

  return new NextResponse(upstreamRes.body, {
    status: upstreamRes.status,
    headers: { "content-type": "application/json" },
  });
}

import "server-only";
import { NextResponse } from "next/server";

type ChainId = "1" | "747474" | "43111"; // supported chains

const RPC_URL: Record<ChainId, string> = {
  "1": `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
  "747474": "https://rpc.katana.network",
  "43111": "https://rpc.hemi.network/rpc"
};

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS() {
  // preflight
  return new Response(null, { status: 204, headers: cors() });
}

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

  const text = await upstreamRes.text();

  return new NextResponse(text, {
    status: upstreamRes.status,
    headers: {
      "content-type": "application/json",
      ...cors(),
    },
  });
}

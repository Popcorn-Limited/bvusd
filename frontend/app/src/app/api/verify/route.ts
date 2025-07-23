import { NextResponse } from "next/server";
import { verifyMessage } from "viem";
import { keccak256 } from "viem";
import allowlist from './allowList.json';

export async function POST(req: Request) {
  try {
    const { account, message, signature } = await req.json();

    const verified = await verifyMessage({
      address: account,
      message,
      signature,
    });
    return allowlist.includes(keccak256(account)) && verified
      ? NextResponse.json({ success: true })
      : NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to parse or verify" },
      { status: 500 }
    );
  }
}
// const getAllowList = () => {
//   const filePath = join(__dirname, "allowList.json");
//   const raw = readFileSync(filePath, "utf-8");
//   const allowlist: string[] = JSON.parse(raw);
//   return allowlist.map((addr) => addr.toLowerCase());
// };

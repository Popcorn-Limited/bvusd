"use client";

import { VaultPoolScreen } from "@/src/screens/VaultScreen/VaultScreen";
import { useSearchParams } from "next/navigation";

type Params = { symbol: string };

export default function VaultPage({ params }: { params: Params }) {
  const searchParams = useSearchParams();
  const referralCode = searchParams.get("referralCode");

  return <VaultPoolScreen asset={params.symbol} referralCode={referralCode ?? ""} />;
}
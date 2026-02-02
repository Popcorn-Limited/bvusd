"use client";

import { getLocalReferralCode } from "@/src/utils";
import { VaultPoolScreen } from "@/src/screens/VaultScreen/VaultScreen";

type Params = { symbol: string };

export default function VaultPage({ params }: { params: Params }) {
  const referral_code = getLocalReferralCode();

  return <VaultPoolScreen asset={params.symbol} referralCode={referral_code ?? ""} />;
}
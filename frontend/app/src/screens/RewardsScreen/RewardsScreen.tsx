"use client";

import { Screen } from "@/src/comps/Screen/Screen";
import { css } from "@/styled-system/css";
import { useAccount } from "@/src/wagmi-utils";
import { useEffect, useState } from "react";
import { getUserReferrals, type Referral } from "@/src/actions";
import { StatsHeader } from "./StatsHeader";
import { ShareAndEarn } from "./ShareAndEarn";
import { YourDeposits } from "./YourDeposits";
import { YourReferrals } from "./YourReferrals";
import { Leaderboard } from "./Leaderboard";

export function RewardsScreen() {
  const account = useAccount();
  const [userReferrals, setUserReferrals] = useState<Referral[]>([]);

  useEffect(() => {
    if (!account.address) return;

    const fetchReferrals = async () => {
      const r = await getUserReferrals(account.address);
      setUserReferrals(r);
    };
    fetchReferrals();
  }, [account.address]);

  return (
    <Screen
      back={{
        href: "/",
        label: "Back",
      }}
      gap={24}
    >
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: 24,
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
        })}
      >
        <StatsHeader />
        <ShareAndEarn />

        <div
          className={css({
            display: "grid",
            gridTemplateColumns: { base: "1fr", large: "1fr 1fr" },
            gap: 24,
          })}
        >
          <YourDeposits />
          <YourReferrals refs={userReferrals} />
        </div>

        <Leaderboard />
      </div>
    </Screen>
  );
}

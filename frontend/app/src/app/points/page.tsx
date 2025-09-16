"use client"

import { ConnectWarningBox } from "@/src/comps/ConnectWarningBox/ConnectWarningBox";
import { Screen } from "@/src/comps/Screen/Screen";
import PointsPanel from "@/src/screens/PointScreen/PointsPanel";
import { TokenLockPanel } from "@/src/screens/PointScreen/TokenLockPanel";

export default function Page() {
  return (
    <Screen
      heading={{
        title: "Bits Program",
        subtitle: "Earn Bits by contributing to BitVault’s ecosystem-whether minting bvUSD, staking for sbvUSD, or adding liquidity. The Bits Program rewards users for actions that strengthen protocol utility and growth, with evolving incentives across future seasons.",
      }} 
    >
      <ConnectWarningBox />
      <PointsPanel showHeader={false} />
      {/* <TokenLockPanel /> */}
    </Screen>
  );
}
"use client";

import { css } from "@/styled-system/css";
import PointsPanel from "@/src/screens/PointScreen/PointsPanel";
import { BalancesPanel } from "./BalancesPanel";


export function AccountScreen() {
  return (
    <div
      className={css({
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        gap: 64,
        width: "100%",
      })}
    >
      {/* <Positions address={account.address ?? null} showNewPositionCard={false} /> */}
      <BalancesPanel />
      <PointsPanel />
    </div>
  );
}


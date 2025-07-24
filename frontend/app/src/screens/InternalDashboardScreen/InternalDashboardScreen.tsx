"use client";

import { useLiquityStats } from "@/src/liquity-utils";
import { match } from "ts-pattern";
import { HFlex, LoadingSurface } from "@liquity2/uikit";
import { css } from "@/styled-system/css";
import { StatsScreenCard } from "@/src/comps/Screen/StatsScreenCard";
import { DepthChart } from "./Depth";
import { VolumeChart } from "./PoolVolume";
import { GatedContent } from "./Gate";
import { PoolSwaps } from "./PoolSwaps";

export function InternalDashboardScreen() {
  const liquityStats = useLiquityStats();
  const loadingState =
    liquityStats.isLoading || liquityStats.status === "pending"
      ? "loading"
      : liquityStats.status === "error"
      ? "error"
      : "success";

  return (
    <div
      className={css({
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        gap: 64,
        width: "100%",
        padding: "0 12px",
      })}
    >
      <GatedContent>
        <StatsScreenCard
          mode={match(loadingState)
            .returnType<"ready" | "loading" | "error">()
            .with("loading", () => "loading")
            .with("error", () => "error")
            .otherwise(() => "ready")}
        >
          {match(loadingState)
            .with("loading", () => (
              <div
                className={css({
                  display: "grid",
                  placeItems: "center",
                  height: "100%",
                })}
              >
                <LoadingSurface />
              </div>
            ))
            .with("error", () => (
              <HFlex gap={8}>
                Error fetching data
                {/* <Button
              mode="primary"
              label="Try again"
              size="mini"
              onClick={onRetry}
            /> */}
              </HFlex>
            ))
            .otherwise(() => {
              if (!liquityStats) {
                <HFlex gap={8}>Invalid Data</HFlex>;
              }
              return (
                <div style={{ width: "100%", minHeight: "calc(100vh - 80px)" }}>
                  <div
                    style={{
                      maxWidth: 1400,
                      margin: "0 auto",
                      display: "flex",
                      flexDirection: "column",
                      gap: "32px",
                    }}
                  >
                    <DepthChart depth={liquityStats.data.poolDepth} />
                    <VolumeChart volume={liquityStats.data.poolVolume} />
                    <PoolSwaps swaps={liquityStats.data.poolSwaps} />
                  </div>
                </div>
              );
            })}
        </StatsScreenCard>
      </GatedContent>
    </div>
  );
}

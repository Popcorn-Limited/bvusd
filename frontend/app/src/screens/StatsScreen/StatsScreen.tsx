"use client";

import { getBranches, useLiquityStats } from "@/src/liquity-utils";
import { TransparencyMetrics } from "./TransparencyMetrics";
import { ChartsPanel } from "./ChartsPanel";
import { VenueAndSupplyPanel } from "./VenueAndSupplyPanels";
import { BackingTablePanel } from "./BackingTablePanel";
import { AttestationsAndProofPanel } from "./AttestationsAndProofPanel";
import { useState } from "react";
import { MarketStatPanel } from "./MarketStatsPanel";
import { MarketChartPanel } from "./MarketChartPanel";
import { FundingBreakdownPanel } from "./FundingBreakdownPanel";
import { SpreadAndDistributionPanel } from "./SpreadAndDistributionPanel";
import { match } from "ts-pattern";
import { HFlex, LoadingSurface } from "@liquity2/uikit";
import { css } from "@/styled-system/css";
import { StatsScreenCard } from "@/src/comps/Screen/StatsScreenCard";
import { fmtnum } from "@/src/formatting";
import { COLLATERALS, USDT } from "@liquity2/uikit";
import { VaultsPanel } from "./VaultsPanel";
import { TrovesPanel } from "./TrovesPanel";

export function StatsScreen() {
  const [activeTab, setActiveTab] = useState<"Protocol" | "transparency">(
    "Protocol"
  );

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
              <div style={{ width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    gap: 32,
                    marginBottom: 24,
                    justifyContent: "center",
                  }}
                >
                  <button
                    onClick={() => setActiveTab("Protocol")}
                    style={{
                      fontSize: 16,
                      color: activeTab === "Protocol" ? "#fff" : "#aaa",
                      fontWeight: activeTab === "Protocol" ? 600 : 400,
                      paddingBottom: 4,
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Protocol
                  </button>
                  <button
                    onClick={() => setActiveTab("transparency")}
                    style={{
                      fontSize: 16,
                      color: activeTab === "transparency" ? "#fff" : "#aaa",
                      fontWeight: activeTab === "transparency" ? 600 : 400,
                      paddingBottom: 4,
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Transparency
                  </button>
                </div>

                {activeTab === "Protocol" && (
                  <div
                    style={{
                      maxWidth: 1400,
                      margin: "0 auto",
                      display: "flex",
                      flexDirection: "column",
                      gap: "32px",
                    }}
                  >
                    <TransparencyMetrics
                      totalBacking={{
                        totalCollaterals: liquityStats.data.totalCollValue,
                        totalReserves: liquityStats.data.totalReserves,
                      }}
                      avgCR={
                        liquityStats.data.historicalGlobalCR[0].collateral_ratio
                      }
                      totalSupply={liquityStats.data.totalBoldSupply}
                      tvl={liquityStats.data.totalValueLocked}
                    />
                    <ChartsPanel
                      data={liquityStats.data.historicalGlobalCR}
                      supply={liquityStats.data.historicalSupply}
                    />
                    {/* <VenueAndSupplyPanel data={liquityStats.data.historicalSupply}/> */}
                    <VaultsPanel />
                    <TrovesPanel troves={liquityStats.data.troves} />
                  </div>  
                )}

                {activeTab === "transparency" && (
                  <div
                    style={{
                      maxWidth: 1400,
                      margin: "0 auto",
                      display: "flex",
                      flexDirection: "column",
                      gap: "32px",
                    }}
                  >
                    <AttestationsAndProofPanel />

                    {/* <MarketStatPanel />
                  <MarketChartPanel />
                  <FundingBreakdownPanel />
                  <SpreadAndDistributionPanel /> */}
                  </div>
                )}
              </div>
            );
          })}
      </StatsScreenCard>
    </div>
  );
}

"use client";

import { useLiquityStats } from "@/src/liquity-utils";
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

export function StatsScreen() {
  const [activeTab, setActiveTab] = useState<"transparency" | "market">(
    "transparency"
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
                  onClick={() => setActiveTab("transparency")}
                  style={{
                    fontSize: 16,
                    color: activeTab === "transparency" ? "#fff" : "#aaa",
                    fontWeight: activeTab === "transparency" ? 600 : 400,
                    borderBottom:
                      activeTab === "transparency" ? "2px solid #fff" : "none",
                    paddingBottom: 4,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Transparency
                </button>
                <button
                  onClick={() => setActiveTab("market")}
                  style={{
                    fontSize: 16,
                    color: activeTab === "market" ? "#fff" : "#aaa",
                    fontWeight: activeTab === "market" ? 600 : 400,
                    borderBottom:
                      activeTab === "market" ? "2px solid #fff" : "none",
                    paddingBottom: 4,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Market Data
                </button>
              </div>

              {activeTab === "transparency" && (
                <div
                  style={{
                    padding: "32px 32px",
                    maxWidth: 1400,
                    margin: "0 auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 48,
                  }}
                >
                  <TransparencyMetrics
                    protocolBackingRatio={`${fmtnum(
                          Number(liquityStats.data.totalCollValue)>
                            0
                            ? (Number(liquityStats.data.totalCollValue) /
                                Number(liquityStats.data.totalBoldSupply)) *
                                100
                            : 0,
                          "2z"
                        )} %`}
                    totalBacking={liquityStats.data.totalCollValue}
                    totalSupply={liquityStats.data.totalBoldSupply}
                    price="1 $"
                  />
                  <ChartsPanel data={liquityStats.data.historicalGlobalCR}/>
                  <VenueAndSupplyPanel data={liquityStats.data.historicalSupply}/>
                  <BackingTablePanel />
                  <AttestationsAndProofPanel />
                </div>
              )}

              {activeTab === "market" && (
                <div
                  style={{
                    padding: "32px 32px",
                    maxWidth: 1400,
                    margin: "0 auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 48,
                  }}
                >
                  <MarketStatPanel />
                  <MarketChartPanel />
                  <FundingBreakdownPanel />
                  <SpreadAndDistributionPanel />
                </div>
              )}
            </div>
          );
        })}
    </StatsScreenCard>
    </div>
  );
}

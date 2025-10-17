"use client";

import { useLiquityStats } from "@/src/liquity-utils";
import { TransparencyMetrics } from "./TransparencyMetrics";
import { ChartsPanel } from "./ChartsPanel";
// import { VenueAndSupplyPanel } from "./VenueAndSupplyPanels";
// import { BackingTablePanel } from "./BackingTablePanel";
// import { AttestationsAndProofPanel } from "./AttestationsAndProofPanel";
import { useState } from "react";
// import { MarketStatPanel } from "./MarketStatsPanel";
// import { MarketChartPanel } from "./MarketChartPanel";
// import { FundingBreakdownPanel } from "./FundingBreakdownPanel";
// import { SpreadAndDistributionPanel } from "./SpreadAndDistributionPanel";
import { match } from "ts-pattern";
import { HFlex, LoadingSurface } from "@liquity2/uikit";
import { css } from "@/styled-system/css";
import { StatsScreenCard } from "@/src/comps/Screen/StatsScreenCard";
// import { fmtnum } from "@/src/formatting";
// import { COLLATERALS, USDT } from "@liquity2/uikit";
// import { ReservesPanel } from "./ReservesPanel";
// import { TrovesPanel } from "./TrovesPanel";
// import { SPDepositsPanel } from "./SPDepositsPanel";
import { VaultsPanel } from "./VaultsPanel";
import { AllocationPanel } from "./Allocations";
import { ReservesPanel } from "./ReservesPanel";
import { LoansPanel } from "./LoansPanel";
// import { HoldersPanel } from "./HoldersPanel";
// import { VaultsApy } from "./VaultsApy";
// import { AllocationPanel } from "./Allocations";
// import { LoansPanel } from "./LoansPanel";

export function StatsScreen() {
  const [activeTab, setActiveTab] = useState<"Core" | "BTC Institutional">(
    "Core"
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
              <div style={{ width: "100%", minHeight: "calc(100vh - 80px)" }}>
                <div
                  style={{
                    display: "flex",
                    gap: 32,
                    marginBottom: 24,
                    justifyContent: "center",
                  }}
                >
                  <button
                    onClick={() => setActiveTab("Core")}
                    style={{
                      fontSize: 16,
                      color: activeTab === "Core" ? "#fff" : "#aaa",
                      fontWeight: activeTab === "Core" ? 600 : 400,
                      paddingBottom: 4,
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Core
                  </button>
                  <button
                    onClick={() => setActiveTab("BTC Institutional")}
                    style={{
                      fontSize: 16,
                      color:
                        activeTab === "BTC Institutional" ? "#fff" : "#aaa",
                      fontWeight: activeTab === "BTC Institutional" ? 600 : 400,
                      paddingBottom: 4,
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    BTC Institutional
                  </button>
                </div>

                {activeTab === "Core" && (
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
                        totalAllocations: liquityStats.data.totalAllocations,
                        totalBTC: liquityStats.data.btcTVL,
                      }}
                      totalSupply={liquityStats.data.totalBoldSupply}
                      tvl={liquityStats.data.totalValueLocked}
                      sbvUSD={liquityStats.data.sbvUSD}
                    />
                    <AllocationPanel data={liquityStats.data.allocations} />
                    <ChartsPanel
                      // data={liquityStats.data.historicalGlobalCR}
                      supply={liquityStats.data.historicalSupply}
                    />
                    {/* TODO add branch collaterals when present*/}
                    <ReservesPanel
                      reserves={liquityStats.data.tokenAllocations}
                    />
                    <VaultsPanel />
                    {/* <VaultsApy data={liquityStats.data.vaultsApy}/> */}
                  </div>
                )}

                {activeTab === "BTC Institutional" && (
                  <div
                    style={{
                      maxWidth: 1400,
                      margin: "0 auto",
                      display: "flex",
                      flexDirection: "column",
                      gap: "32px",
                    }}
                  >
                    <LoansPanel btcTVL={liquityStats.data.btcTVL} />
                  </div>
                )}
              </div>
            );
          })}
      </StatsScreenCard>
    </div>
  );
}

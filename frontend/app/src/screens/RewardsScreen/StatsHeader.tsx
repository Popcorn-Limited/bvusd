"use client";

import { css } from "@/styled-system/css";
import { Button } from "@liquity2/uikit";
import { useState } from "react";
import { RulesModal } from "./RulesModal";
import { CalculatorModal } from "./CalculatorModal";

const mockStats = {
  totalPoints: 1166,
  depositPoints: 966,
  referralPoints: 266,
  attributedTvl: 10666,
};

function formatNumber(num: number): string {
  return num.toLocaleString();
}

function formatUsd(num: number): string {
  return `$${num.toLocaleString()}`;
}

function StatCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: 16,
        background: "token(colors.infoSurface)",
        borderRadius: 8,
        border: "1px solid token(colors.neutral100)",
      })}
    >
      <span
        className={css({
          fontSize: 12,
          color: "contentAlt",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        })}
      >
        {label}
      </span>
      <span
        className={css({
          fontSize: 24,
          fontWeight: 700,
          color: highlight ? "#F7931A" : "content",
          fontVariantNumeric: "tabular-nums",
        })}
      >
        {value}
      </span>
    </div>
  );
}

export function StatsHeader() {
  const [showRules, setShowRules] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  return (
    <>
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: 16,
          width: "100%",
        })}
      >
        <div
          className={css({
            display: "flex",
            flexDirection: { base: "column", medium: "row" },
            justifyContent: "space-between",
            alignItems: { base: "flex-start", medium: "center" },
            gap: 16,
          })}
        >
          <h2
            className={css({
              fontSize: 24,
              fontWeight: 600,
            })}
          >
            Your Stats
          </h2>
          <div
            className={css({
              display: "flex",
              gap: 8,
            })}
          >
            <Button label="Calculator" mode="primary" size="small" onClick={() => setShowCalculator(true)} />
            <Button label="Rules" mode="primary" size="small" onClick={() => setShowRules(true)} />
          </div>
        </div>
        <div
          className={css({
            display: "grid",
            gridTemplateColumns: { base: "repeat(2, 1fr)", medium: "repeat(4, 1fr)" },
            gap: 16,
          })}
        >
          <StatCard label="Total Points" value={formatNumber(mockStats.totalPoints)} highlight />
          <StatCard label="Deposit Points" value={formatNumber(mockStats.depositPoints)} />
          <StatCard label="Referral Points" value={formatNumber(mockStats.referralPoints)} highlight />
          <StatCard label="Attributed TVL" value={formatUsd(mockStats.attributedTvl)} />
        </div>
      </div>

      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
      {showCalculator && <CalculatorModal onClose={() => setShowCalculator(false)} />}
    </>
  );
}

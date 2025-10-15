"use client";
import Image from "next/image";

import tokenBvusd from "../../../../uikit/src/token-icons/bvusd.svg";
import tokenBtcb from "../../../../uikit/src/token-icons/btcb.svg";
import tokenUsdc from "../../../../uikit/src/token-icons/usdc.svg";
import eth from "../../../../uikit/src/token-icons/eth.svg";
import katana from "../../../../uikit/src/token-icons/katana.svg";

import { PanelHeader } from "./PanelTitle";
import {
  PieChart,
  ResponsiveContainer,
  Pie,
  Tooltip as PieTooltip,
  Cell,
} from "recharts";

type ReserveProps = {
  reserves: {
    asset: string;
    balance: string;
    logo: string;
  }[];
};

const colors = ["#F6B73C", "#4BA4F0", "green", "red"];

const icons = {
  USDC: tokenUsdc,
  ETH: eth,
  bvUSD: tokenBvusd,
  BTC: tokenBtcb,
  Katana: katana,
};

export function ReservesPanel({ reserves }: ReserveProps) {
  let pie = reserves.map((c, i) => ({
    name: c.asset,
    value: Number(c.balance),
    color: colors[i],
  }));

  return (
    <div
      style={{
        userSelect: "text",
        display: "flex",
        alignItems: "stretch",
        flexDirection: "row",
        gap: "24px",
        fontFamily: "KHTeka",
      }}
    >
      {/* Left Card: 40% width */}
      <div
        style={{
          flexBasis: "40%",
          flexGrow: 0,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          background: "transparent",
          borderRadius: "16px",
          border: "1px solid var(--Neutral-100, #353945)",
          fontFamily: "KHTeka",
        }}
      >
        <PanelHeader title="Asset reserves" line={false} />

        <ResponsiveContainer width="100%" height={360}>
          <PieChart>
            <Pie
              data={pie}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={110}
              paddingAngle={2}
              stroke="none"
              label={({ percent, value }) => `${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {pie.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 24,
            marginTop: 16,
            marginBottom: 16,
          }}
        >
          {pie.map((entry, idx) => (
            <div
              key={idx}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: entry.color,
                }}
              />
              <span style={{ color: "#aaa", fontSize: 12 }}>{entry.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Card: 60% width */}
      <div
        style={{
          flexBasis: "60%",
          flexGrow: 0,
          flexShrink: 0,
          padding: 24,
          display: "flex",
          flexDirection: "column",
          background: "transparent",
          borderRadius: "16px",
          border: "1px solid var(--Neutral-100, #353945)",
          minHeight: 0,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: "20px",
          }}
        >
          <h3
            style={{
              color: "var(--Primary-White, #FFF)",
              fontFamily: "KHTeka",
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: "400",
              lineHeight: "120%",
            }}
          >
            Reserves
          </h3>
        </div>
        {/* Table Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            padding: "10px",
            gap: 10,
            borderBottom: "1px solid #333",
            color: "#fff",
            fontSize: 14,
            fontFamily: "KHTeka",
            fontWeight: "400",
            textTransform: "uppercase",
          }}
        >
          <div>Asset</div>
          <div>Amount</div>
          <div>Chain</div>
        </div>

        {/* Table Rows */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: "grid",
            gridTemplateRows: `repeat(${reserves.length}, 1fr)`,
            overflow: "auto",
          }}
        >
          {reserves.map((row, idx) => (
            <div
              key={idx}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                padding: "12px",
                gap: 16,
                borderBottom: "1px solid #23262F",
                color: "#fff",
                fontSize: 18,
                fontFamily: "KHTeka",
                fontWeight: "400",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Image
                  src={row.logo}
                  alt={row.asset}
                  width={24}
                  height={24}
                  style={{ borderRadius: "50%" }}
                />
                <span>{row.asset}</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    backgroundColor: "#2b1b0a",
                    color: "#f9a825",
                    padding: "4px 10px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 500,
                    fontFamily: "Inter, sans-serif",
                    display: "inline-block",
                  }}
                >
                  ${Number(row.balance).toFixed(2)}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Image
                  src={icons["ETH"]}
                  alt={"ETH"}
                  width={24}
                  height={24}
                  style={{ borderRadius: "50%" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

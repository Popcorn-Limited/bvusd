import React from "react";
import { PanelHeader } from "../StatsScreen/PanelTitle";

type VolumeData = {
  pool: string;
  count1d: string;
  count7d: string;
  token0: string;
  token1: string;
  volume1d: string;
  volume7d: string;
};

type VolumetProps = {
  volume: VolumeData[];
};

function display(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

export const VolumeChart = ({ volume }: VolumetProps) => {
  return (
    <div
      style={{
        userSelect: "text",
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "row",
        gap: "24px",
        fontFamily: "KHTeka",
      }}
    >
      <div
        style={{
          flexBasis: "100%",
          flexGrow: 0,
          flexShrink: 0,
          padding: 24,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          background: "transparent",
          borderRadius: "16px",
          border: "1px solid var(--Neutral-100, #353945)",
        }}
      >
        <PanelHeader title="Sushi Pool Stats" line={true} />

        {/* Table Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
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
          <div>Pool Address</div>
          <div>Volume 1 Day</div>
          <div>Swaps Count 1 Day</div>
          <div>Volume 7 Day</div>
          <div>Swaps Count 7 Day</div>
        </div>

        {/* Table Rows */}
        {volume.map((row, idx) => (
          <div
            key={idx}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
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
                {`${row.pool.slice(0, 6)}...${row.pool.slice(-3)}`}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {`$ ${display(Number(row.volume1d))}`}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {display(Number(row.count1d))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {`$ ${display(Number(row.volume7d))}`}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {display(Number(row.count7d))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

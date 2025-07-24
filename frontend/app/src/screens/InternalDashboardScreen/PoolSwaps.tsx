"use client";

import { useState } from "react";

interface SwapRow {
  pool: string;
  amount0: string;
  amount1: string;
  token0: string;
  token1: string;
  sender: string;
  time: string;
  txHash: string;
  type: string;
}

type TroveProps = {
  swaps: SwapRow[];
};

const MIN_USDC_AMOUNT = 1000;

const sliceAmount = (amount: string) => {
  const index = amount.indexOf(".");
  if (index > 0) return amount.slice(0, index + 3);
  else return amount;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleString("en-US", {
    timeZone: "UTC",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export function PoolSwaps({ swaps }: TroveProps) {
  const [filterAmount, setFilterAmount] = useState(MIN_USDC_AMOUNT);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setFilterAmount(value);
    }
  };

  const displayed = swaps
    .filter((s) => Number(s.amount0) > filterAmount)
    .map((s) => {
      return {
        action:
          s.type === "buy"
            ? `Buy ${sliceAmount(s.amount1)} ${s.token1} for ${sliceAmount(
                s.amount0
              )} ${s.token0}`
            : `Sell ${sliceAmount(s.amount1)} ${s.token1} for ${sliceAmount(
                s.amount0
              )} ${s.token0}`,
        time: s.time,
        hash: s.txHash,
      };
    });
  return (
    <div
      style={{
        background: "transparent",
        border: "1px solid var(--Neutral-100, #353945)",
        borderRadius: 16,
        padding: 24,
        gap: "100px",
        width: "100%",
        height: "100%",
        userSelect: "text",
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
          Recent Swaps
        </h3>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <label style={{ color: "#fff" }}>Min USDC:</label>
          <input
            type="number"
            value={filterAmount}
            onChange={handleChange}
            min={0}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 16,
              background: "#111",
              color: "#fff",
            }}
          />
        </div>
      </div>
      <div
        style={{
          border: "1px solid #353945",
          borderRadius: 16,
          overflow: "hidden",
          fontFamily: "KHTeka",
          color: "#fff",
        }}
      >
        {/* Table Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(160px, 1fr) minmax(100px, 1fr) minmax(280px, 2fr)",
            alignItems: "center",
            gap: 16,
            fontSize: 14,
            fontWeight: 500,
            textTransform: "uppercase",
            padding: "12px",
            background: "#1a1a1a",
            borderBottom: "1px solid #333",
          }}
        >
          <div>Action</div>
          <div>Time</div>
          <div>Tx Hash</div>
        </div>

        {/* Scrollable Table Body */}
        <div
          style={{
            maxHeight: 5 * 52,
            overflowY: "auto",
          }}
        >
          {displayed.map((row, idx) => (
            <div
              key={idx}
              style={{
                display: "grid",
                gridTemplateColumns:
                  "minmax(160px, 1fr) minmax(100px, 1fr) minmax(280px, 2fr)",
                alignItems: "center",
                gap: 16,
                padding: "12px",
                borderBottom: "1px solid #23262F",
                fontSize: 16,
              }}
            >
              <div>{row.action}</div>
              <div>{formatDate(row.time.slice(0, 19))} UTC</div>
              <div
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {row.hash}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

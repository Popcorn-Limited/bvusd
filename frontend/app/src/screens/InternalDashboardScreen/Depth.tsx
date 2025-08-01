import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { PanelHeader } from "../StatsScreen/PanelTitle";
import {getTokenAmounts} from "@/src/diff-utils";

type DepthDataPoint = {
  tick: string;
  price: string;
  liquidity: string;
};

type DepthChartProps = {
  depth: DepthDataPoint[];
};

export function displayValue(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(3)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(3)}K`;
  return value.toString();
}

// group buckets of price
function groupByPriceTickSize(
  data: { price: string; token0: number; token1: number }[],
  bucketSize: number
) {
  const grouped = new Map<
    string,
    { price: string; token0: number; token1: number }
  >();

  data.forEach((item) => {
    const priceFloat = parseFloat(item.price);
    const bucket = (Math.floor(priceFloat / bucketSize) * bucketSize).toFixed(
      6
    );

    if (!grouped.has(bucket)) {
      grouped.set(bucket, {
        price: bucket,
        token0: 0,
        token1: 0,
      });
    }

    const entry = grouped.get(bucket)!;
    entry.token0 += item.token0;
    entry.token1 += item.token1;
  });

  return Array.from(grouped.values()).sort(
    (a, b) => parseFloat(a.price) - parseFloat(b.price)
  );
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  const price = Number(label).toFixed(6);

  return (
    <div
      style={{
        background: "#1e1e1e",
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #444",
        color: "#fff",
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 6 }}>Price: {price}</div>
      {payload.map((entry, idx) => (
        <div key={idx} style={{ color: entry.color }}>
          {entry.name}:{" "}
          {Number(entry.value).toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}
        </div>
      ))}
    </div>
  );
};

export const DepthChart = ({ depth }: DepthChartProps) => {
  // console.log(data);
  const [minTickSize, setMinTickSize] = useState(10000);

  let totalToken0 = 0;
  let totalToken1 = 0;

  const chartData = depth
    .slice(0, -1)
    .map((item, idx) => {
      const tick = parseInt(item.tick);
      const nextTick = parseInt(depth[idx + 1].tick);
      const liquidity = Number(item.liquidity);

      const { token0, token1 } = getTokenAmounts(liquidity, tick, nextTick, 6);

      // Accumulate totals
      totalToken0 += token0;
      totalToken1 += token1;

      return {
        price: Number(item.price).toFixed(6),
        token0,
        token1,
      };
    })
    .filter((tick) => tick.token0 + tick.token1 > minTickSize);

  // const groupedData = groupByPriceTickSize(chartData, 0.00025);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setMinTickSize(value);
    }
  };

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
          flexBasis: "30%",
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
        {" "}
        <PanelHeader title="Sushi Pool Liquidity" line={true} />
        {/* Table Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
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
          <div>Tokens</div>
          <div>USD Liquidity</div>
        </div>
        {/* Table Rows */}
        <div
          key={0}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
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
            {"USDC"}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {`$ ${displayValue(Number(totalToken0))}`}
          </div>
        </div>
        <div
          key={0}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
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
            {"aUSD"}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {`$ ${displayValue(Number(totalToken1))}`}
          </div>
        </div>
      </div>

      <div
        style={{
          flexBasis: "70%",
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
            Pool Depth
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <label style={{ color: "#fff" }}>Tick Size (USD):</label>
            <input
              type="number"
              value={minTickSize}
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
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} barCategoryGap={0} barGap={0}>
            <XAxis dataKey="price" tick={{ fontSize: 10 }} interval={4} />
            <YAxis
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => {
                if (value >= 1_000_000)
                  return `${(value / 1_000_000).toFixed(1)}M`;
                if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
                return value.toFixed(0);
              }}
            />{" "}
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "transparent" }}
            />
            <Bar dataKey="token0" stackId="a" fill="#f9a825" name="USDC" />
            <Bar dataKey="token1" stackId="a" fill="#d8d1c7ff" name="bvUSD" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

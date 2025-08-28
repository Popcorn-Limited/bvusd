"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell,
  Tooltip as LineTooltip,
} from "recharts";
import { PanelHeader } from "./PanelTitle";
import { SmallLegend } from "./SmallChartLegend";
import { CustomTooltip } from "./CustomTooltip";
import { fmtnum } from "@/src/formatting";

type CRProps = {
  data: {
    day: string;
    collateral_ratio: string;
  }[];
  supply: {
    day: string;
    holders: string;
    supply: string;
  }[];
};

function displayCR(cr: number): string {
  return `${cr.toFixed(0)}%`;
}

const CustomXAxisTick = ({ x, y, payload, index }) => {
  if (index === 0) return null;
  return (
    <text
      x={x}
      y={y + 10}
      fill="#fff"
      fontSize={12}
      fontWeight={400}
      textAnchor="middle"
    >
      {payload.value}
    </text>
  );
};

// TODO - build query in dune of collaterals backing amount over time
export function ChartsPanel({ data, supply }: CRProps) {
  const day_CR = [...data]
    .reverse()
    .map((item) => ({
      day: item.day.split(" ")[0].slice(0, 7),
      CR: parseFloat(fmtnum(Number(item.collateral_ratio)).replace(/,/g, "")),
    }));

  const day_supply = [...supply]
    .reverse()
    .map((item) => ({
      day: item.day.split(" ")[0].slice(0, 7),
      supply: parseFloat(fmtnum(Number(item.supply), "2z").replace(/,/g, "")),
      holders: parseFloat(fmtnum(Number(item.holders), "2z").replace(/,/g, "")),
    }));

  function displaySupply(supply: number): string {
    if (supply >= 1_000_000) return `${(supply / 1_000_000).toFixed(1)}M`;
    if (supply >= 1_000) return `${(supply / 1_000).toFixed(1)}K`;
    return supply.toString();
  }

  // const pieChartColors = ["#F6B73C", "#C9C9C9", "#4BA4F0", "#DB3C4B"];

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
      {/* Left Card: Supply */}

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "460px",
          flexShrink: 0,
          background: "transparent",
          borderRadius: "16px",
          border: "1px solid var(--Neutral-100, #353945)",
          fontFamily: "KHTeka",
        }}
      >
        <PanelHeader title="bvUSD Supply" line={true} />
        <ResponsiveContainer
          width="98%"
          height={360}
          style={{ padding: 1, overflow: "hidden", position: "relative" }}
        >
          <LineChart
            data={day_supply}
            margin={{ top: 5, right: 5, bottom: 0, left: -20 }}
          >
            <XAxis
              axisLine={false}
              tickLine={false}
              dataKey="day"
              stroke="#fff"
              minTickGap={30}
              padding={{ left: 20 }}
              style={{ marginRight: 15 }}
              tick={{ fontSize: 12, fontWeight: 400, fill: "#fff" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              stroke="#fff"
              tickFormatter={(value) => {
                return displaySupply(value);
              }}
              tick={CustomXAxisTick}
            />
            <LineTooltip
              content={<CustomTooltip transformValue={displaySupply} />}
            />
            <Line
              type="monotone"
              dataKey="supply"
              stroke="#F6B73C"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Right Card: Collateral Ratio Historical */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          width: "676px",
          height: "460px",
          flexShrink: 0,
          background: "transparent",
          borderRadius: "16px",
          border: "1px solid var(--Neutral-100, #353945)",
        }}
      >
        <PanelHeader title="Global Collateral Ratio" line={true} />
        <ResponsiveContainer
          width="100%"
          height={360}
          style={{
            padding: "0 24px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <AreaChart data={day_CR} margin={{ left: -20 }}>
            <XAxis
              axisLine={false}
              tickLine={false}
              dataKey="day"
              stroke="#fff"
              minTickGap={20}
              padding={{ left: 20 }}
              style={{ marginRight: 15 }}
              tick={{ fontSize: 12, fontWeight: 400, fill: "#fff" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              domain={[150, "auto"]}
              stroke="#777"
              tickFormatter={(value) => displayCR(value)}
              tick={CustomXAxisTick}
            />
            <Tooltip content={<CustomTooltip transformValue={displayCR} />} />
            <Area
              type="monotone"
              dataKey="CR"
              stroke="#FFB11B"
              fill="rgba(255, 177, 27, 0.2)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

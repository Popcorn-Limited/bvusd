"use client";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as PieTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as LineTooltip,
} from "recharts";
import { PanelHeader } from "./PanelTitle";
import { fmtnum } from "@/src/formatting";

const pieData = [
  { name: "A", value: 40, color: "#F6B73C" },
  { name: "B", value: 30, color: "#C9C9C9" },
  { name: "C", value: 25, color: "#4BA4F0" },
  { name: "D", value: 5, color: "#DB3C4B" },
];

type SupplyChartProps = {
  data: {
    day: string;
    holders: string;
    supply: string;
  }[];
};

export function VenueAndSupplyPanel({ data }: SupplyChartProps) {
  const day_supply = [...data].reverse().map((item) => ({
    day: item.day.split(" ")[0],
    supply: parseFloat(fmtnum(Number(item.supply), "2z").replace(/,/g, "")),
    holders: parseFloat(fmtnum(Number(item.holders), "2z").replace(/,/g, "")),
  }));

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "24px",
      }}
    >
      {/* Left Card: Venue Breakdown */}
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
        }}
      >
        <PanelHeader title="Venue Breakdown" line={true} />
        <ResponsiveContainer width="100%" height={360}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              innerRadius={80}
              outerRadius={110}
              paddingAngle={4}
              stroke="none"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <PieTooltip />
          </PieChart>
        </ResponsiveContainer>

        <div
          style={{
            display: "flex",
            gap: "38px",
            justifyContent: "center",
            padding: "0 4px",
            alignItems: "flex-end",
          }}
        >
          {pieData.map((entry, idx) => (
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
              <span style={{ color: "#aaa", fontSize: 12 }}>XXXXX</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Card: bvUSD Supply */}
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
        }}
      >
        <PanelHeader title="bvUSD Supply" line={true}/>
        <ResponsiveContainer width="100%" height={360}>
          <LineChart data={day_supply}>
            <XAxis
              axisLine={false}
              tickLine={false}
              dataKey="day"
              stroke="#777"
              tick={{ fontSize: 10, fill: "#aaa" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              stroke="#777"
              tickFormatter={(value) => {
                if (value >= 1_000_000)
                  return `${(value / 1_000_000).toFixed(1)}M`;
                if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
                return value.toString();
              }}
              tick={{ fontSize: 10, fill: "#aaa" }}
            />
            <LineTooltip />
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
    </div>
  );
}

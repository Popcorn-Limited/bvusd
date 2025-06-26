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
import { CustomTooltip } from "./CustomTooltip";

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

function displaySupply(supply: number): string {
  if (supply >= 1_000_000) return `${(supply / 1_000_000).toFixed(1)}M`;
  if (supply >= 1_000) return `${(supply / 1_000).toFixed(1)}K`;
  return supply.toString();
}

export function VenueAndSupplyPanel({ data }: SupplyChartProps) {
  const day_supply = [...data]
    .reverse()
    .filter((item, index) => {
      return index === 0 || index % 5 === 0;
    })
    .map((item) => ({
      day: item.day.split(" ")[0].slice(0, 7),
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
          width: "676",
          height: "460px",
          flexShrink: 0,
          background: "transparent",
          borderRadius: "16px",
          border: "1px solid var(--Neutral-100, #353945)",
        }}
      >
        <PanelHeader title="Venue Breakdown" line={true} />
        <ResponsiveContainer width="100%" height={330}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={120}
              stroke="none"
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div
          style={{
            display: "flex",
            gap: "35px",
            justifyContent: "center",
            padding: "0",
            marginTop: 10,
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
            margin={{ top: 5, right: 5, bottom: 0, left: 0 }}
          >
            <XAxis
              axisLine={false}
              tickLine={false}
              dataKey="day"
              stroke="#fff"
              minTickGap={30}
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
              tick={{ fontSize: 12, fontWeight: 400, fill: "#fff" }}
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
    </div>
  );
}

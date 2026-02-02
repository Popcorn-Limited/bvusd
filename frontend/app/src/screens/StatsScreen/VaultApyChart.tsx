"use client";

import { PanelHeader } from "./PanelTitle";
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Line,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { CustomTooltip } from "./CustomTooltip";
import { vaultsData } from "./VaultsPanel";
import { useMemo } from "react";

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


const colors = [
    "#4E79A7",
    "#F28E2B",
    "#E15759",
    "#76B7B2",
    "#59A14F",
    "#EDC948",
    "#B07AA1",
    "#FF9DA7",
    "#9C755F",
    "#BAB0AC",
  ];
  function displayApy(apy: number): string {
    return `${apy}%`;
  }
  
  type ApyData = {
    data: {
      day: string;
      apy: string;
    }[];
    apyData: {
      apy30d: string;
      apy7d: string;
    }
  };
  
  export function VaultApy({ data, apyData }: ApyData) {
    const { chartData, apy7d, apy30d } = useMemo(() => {
      const sorted = data
        .map(({ day, apy }) => ({
          day: day.split(" ")[0].slice(0, 10),
          apy: Number(Number(apy).toFixed(2)),
        }))
        .sort((a, b) => a.day.localeCompare(b.day));
  
      const last7 = sorted.slice(-7);
      const last30 = sorted.slice(-30);
  
      const avg = (arr: { apy: number }[]) =>
        arr.length ? Math.round(arr.reduce((s, d) => s + d.apy, 0) / arr.length) : 0;
  
      return {
        chartData: sorted,
        apy7d: avg(last7),
        apy30d: avg(last30),
      };
    }, [data]);
  
    const formatMonth = (day: string) => {
      const date = new Date(day);
      return date.toLocaleString("en-US", { month: "short" });
    };
  
    return (
      <div
        style={{
          userSelect: "text",
          fontFamily: "KHTeka, sans-serif",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          background: "transparent",
          borderRadius: 16,
          border: "1px solid #353945",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span style={{ color: "#fff", fontSize: 16, fontWeight: 600 }}>
            Historical Returns
          </span>
          <div style={{ display: "flex", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ color: "#808191", fontSize: 12, fontWeight: 400 }}>
                7D APY
              </span>
              <span style={{ color: "#fff", fontSize: 20, fontWeight: 600 }}>
                {Number(apyData.apy7d).toFixed(2)}%
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ color: "#808191", fontSize: 12, fontWeight: 400 }}>
                30D APY
              </span>
              <span style={{ color: "#fff", fontSize: 20, fontWeight: 600 }}>
                {Number(apyData.apy30d).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
  
        {/* Chart */}
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, bottom: 0, left: -20 }}
          >
            <defs>
              <linearGradient id="apyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F5A623" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#F5A623" stopOpacity={0.02} />
              </linearGradient>
            </defs>
  
            <XAxis
              axisLine={false}
              tickLine={false}
              dataKey="day"
              stroke="#808191"
              tickFormatter={formatMonth}
              minTickGap={40}
              tick={{ fontSize: 12, fontWeight: 400, fill: "#808191" }}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              stroke="#808191"
              tickFormatter={(v) => `${v}`}
              tick={{ fontSize: 12, fontWeight: 400, fill: "#808191" }}
              domain={["dataMin - 1", "dataMax + 1"]}
            />
  
            <Tooltip
              contentStyle={{
                background: "#1C1E2A",
                border: "1px solid #353945",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 13,
                color: "#fff",
              }}
              labelStyle={{ color: "#808191", marginBottom: 4 }}
              formatter={(value: number) => [`${value}%`, "APY"]}
            />
  
            <Area
              type="monotone"
              dataKey="apy"
              stroke="#F5A623"
              strokeWidth={2}
              fill="url(#apyGradient)"
              dot={{
                r: 4,
                fill: "#F5A623",
                stroke: "#F5A623",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                fill: "#F5A623",
                stroke: "#fff",
                strokeWidth: 2,
              }}
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }
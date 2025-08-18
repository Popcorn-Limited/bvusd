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
    vault: string;
    apy: string;
  }[];
};

export function VaultsApy({ data }: ApyData) {
  const groupedByVault = data.reduce((acc, { vault, day, apy }) => {
    const key = vault.toLowerCase();
    if (!acc[key]) acc[key] = [];
    acc[key].push({
      day: day.split(" ")[0].slice(0, 10),
      apy: Number(apy),
    });
    return acc;
  }, {});

  const { mergedData, vaultKeys } = useMemo(() => {
    const daySet = new Set<string>();
    for (const series of Object.values(groupedByVault)) {
      (series as Array<{ day: string; apy: number }>).forEach((p) =>
        daySet.add(p.day)
      );
    }
    const days = Array.from(daySet).sort((a, b) => a.localeCompare(b));

    const lookups = Object.fromEntries(
      Object.entries(groupedByVault).map(([v, series]) => [
        v,
        Object.fromEntries(
          (series as Array<{ day: string; apy: number }>).map((p) => [
            p.day,
            p.apy,
          ])
        ),
      ])
    );

    const merged = days.map((day) => {
      const row: Record<string, number | string | null> = { day };
      for (const v of Object.keys(groupedByVault))
        row[v] = lookups[v][day] ?? null;
      return row;
    });

    return { mergedData: merged, vaultKeys: Object.keys(groupedByVault) };
  }, [groupedByVault]);

  const vaultLabels = vaultsData.reduce((acc, { address, label, strategy }) => {
    const key = address.toLowerCase();
    if (!acc[key]) acc[key] = [];
    acc[key].push({
        label, strategy
    });
    return acc;
  }, {});

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
        <PanelHeader title="Vault APY" line={true} />
        <ResponsiveContainer
          width="98%"
          height={360}
          style={{ padding: 1, overflow: "hidden", position: "relative" }}
        >
          <LineChart
            data={mergedData}
            margin={{ top: 5, right: 5, bottom: 0, left: -20 }}
          >
            <XAxis
              axisLine={false}
              tickLine={false}
              dataKey="day"
              stroke="#fff"
              minTickGap={30}
              padding={{ left: 20 }}
              tick={{ fontSize: 12, fontWeight: 400, fill: "#fff" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              stroke="#fff"
              tickFormatter={(v) => displayApy(v)}
              tick={CustomXAxisTick}
            />

            <Tooltip content={<CustomTooltip transformValue={displayApy} />} formatter={(value) => [displayApy(value as number), ""] as [string, string]}/>
            <Legend formatter={(v) => vaultLabels[v as string][0].strategy} />

            {vaultKeys.map((vault, idx) => (
                
              <Line
                key={vault}
                type="monotone"
                dataKey={vault}
                strokeWidth={1}
                stroke={colors[idx % colors.length]}
                dot={false}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

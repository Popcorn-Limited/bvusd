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
  Tooltip as PieTooltip,
} from "recharts";
import { PanelHeader } from "./PanelTitle";
import { SmallLegend } from "./SmallChartLegend";
import { CustomTooltip } from "./CustomTooltip";
import { fmtnum } from "@/src/formatting";

const systemBackingData = [
  { date: "1/25", USDC: 5, BTC: 7, ETH: 3 },
  { date: "2/25", USDC: 10, BTC: 13, ETH: 6 },
  { date: "3/25", USDC: 9, BTC: 11, ETH: 8 },
  { date: "4/25", USDC: 9, BTC: 10, ETH: 5 },
  { date: "5/25", USDC: 8, BTC: 9, ETH: 4 },
  { date: "6/25", USDC: 7, BTC: 8, ETH: 3 },
  { date: "7/25", USDC: 6, BTC: 7, ETH: 2 },
];

type CRProps = {
  data: {
    day: string;
    collateral_ratio: string;
  }[];
  backing?: {
    collateralSymbol: string;
    total_amount: string;
  }[];
};

function displayCR(cr: number): string {
  return `${cr.toFixed(0)}%`;
}

// TODO - build query in dune of collaterals backing amount over time
// TODO add USDC - USDT data
export function ChartsPanel({ data, backing }: CRProps) {
  const day_CR = [...data]
    .reverse()
    .filter((item, index) => {
      return index === 0 || index % 15 === 0;
    })
    .map((item) => ({
      day: item.day.split(" ")[0].slice(0, 7),
      CR: parseFloat(fmtnum(Number(item.collateral_ratio)).replace(/,/g, "")),
    }));

  // const backingData = backing.map(b => ({
  //   collateralSymbol: b.collateralSymbol,
  //   total_amount: Number(b.total_amount)
  // }));

  const pieChartColors = ["#F6B73C", "#C9C9C9", "#4BA4F0", "#DB3C4B"];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "row",
        gap: "24px",
        fontFamily: "KHTeka",
      }}
    >
      {/* Left Card: System Backing */}
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
          overflow: "hidden",
          border: "1px solid var(--Neutral-100, #353945)",
        }}
      >
        <PanelHeader title="System Backing" line={true} />
        <ResponsiveContainer width="98%" height={360}>
          <AreaChart data={systemBackingData}>
            <XAxis
              axisLine={false}
              tickLine={false}
              dataKey="date"
              tick={{ fontSize: 12, fontWeight: 400, fill: "#fff" }}
              stroke="#777"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              stroke="#777"
              tick={{ fontSize: 12, fontWeight: 400, fill: "#fff" }}
              tickFormatter={(v) => `${v}M`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={SmallLegend} />
            <Area
              type="monotone"
              dataKey="USDC"
              stroke="#FFB11B"
              fill="rgba(255, 177, 27, 0.2)"
            />
            <Area
              type="monotone"
              dataKey="BTC"
              stroke="#DB3C4B"
              fill="rgba(255, 255, 255, 0.1)"
            />
            <Area
              type="monotone"
              dataKey="ETH"
              stroke="#39D353"
              fill="rgba(57, 211, 83, 0.1)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Right Card: Collateral Ratio Historical */}
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
        <PanelHeader title="Collateral Ratio" line={true} />
        <ResponsiveContainer
          width="98%"
          height={360}
          style={{ padding: 1, overflow: "hidden", position: "relative" }}
        >
          <LineChart data={day_CR}>
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
              domain={[150, "auto"]}
              stroke="#777"
              tickFormatter={(value) => displayCR(value)}
              tick={{ fontSize: 12, fontWeight: 400, fill: "#fff" }}
            />
            <Tooltip content={<CustomTooltip transformValue={displayCR}/>} />
            <Line
              type="monotone"
              dataKey="CR"
              stroke="#FFB11B"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

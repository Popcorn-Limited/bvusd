import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PanelHeader } from "./PanelTitle";
import { NumberToHexErrorType } from "viem";

type DepthDataPoint = {
  tick: string;
  price: string;
  liquidity: string;
};


type DepthChartProps = {
  data: DepthDataPoint[];
};

// Convert tick to sqrtPrice
function tickToSqrtPrice(tick: number): number {
  return Math.pow(1.0001, tick / 2);
}

// Convert tick liquidity to token0 & token1 amounts
function getTokenAmounts(
  liquidity: number,
  lowerTick: number,
  upperTick: number,
  decimals: number
) {
  const sqrtLower = tickToSqrtPrice(lowerTick);
  const sqrtUpper = tickToSqrtPrice(upperTick);

  const amount0 = liquidity * (1 / sqrtLower - 1 / sqrtUpper);
  const amount1 = liquidity * (sqrtUpper - sqrtLower);

  return {
    token0: amount0 / 10 ** decimals,
    token1: amount1 / 10 ** decimals,
  };
}

export const DepthChart = ({ data }: DepthChartProps) => {
  console.log(data);
  const chartData = data.slice(0, -1).map((item, idx) => {
    const tick = parseInt(item.tick);
    const nextTick = parseInt(data[idx + 1].tick);
    const liquidity = Number(item.liquidity);

    const { token0, token1 } = getTokenAmounts(liquidity, tick, nextTick, 6);

    return {
      price: Number(item.price).toFixed(6),
      token0,
      token1,
    };
  });

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
        {/* Header */}
        <PanelHeader title="bvUSD-USDC Pool Depth" line={true} />

        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} barCategoryGap={0} barGap={0}>
            <XAxis dataKey="price" tick={{ fontSize: 10 }} interval={4}/>
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
              formatter={(value: number) => {
                if (value >= 1_000_000)
                  return `${(value / 1_000_000).toFixed(2)}M`;
                if (value >= 1_000) return `${(value / 1_000).toFixed(2)}K`;
                return value.toFixed(2);
              }}
            />{" "}
            <Bar dataKey="token0" stackId="a" fill="#f9a825" />
            <Bar dataKey="token1" stackId="a" fill="#d8d1c7ff" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

'use client';
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
} from 'recharts';
import { PanelHeader } from './PanelTitle';
import { SmallLegend } from './SmallChartLegend';
import { fmtnum } from '@/src/formatting';

const systemBackingData = [
  { date: '1/25', USDC: 5, BTC: 7, ETH: 3 },
  { date: '2/25', USDC: 10, BTC: 13, ETH: 6 },
  { date: '3/25', USDC: 9, BTC: 11, ETH: 8 },
  { date: '4/25', USDC: 9, BTC: 10, ETH: 5 },
  { date: '5/25', USDC: 8, BTC: 9, ETH: 4 },
  { date: '6/25', USDC: 7, BTC: 8, ETH: 3 },
  { date: '7/25', USDC: 6, BTC: 7, ETH: 2 },
];

type CRProps = {
  data: {
    day: string;
    collateral_ratio: string;
  }[];
};

export function ChartsPanel({ data }: CRProps) {
  const day_CR = [...data].reverse().map((item) => ({
    day: item.day.split(" ")[0],
    CR: parseFloat(fmtnum(Number(item.collateral_ratio)).replace(/,/g, "")),
  }));

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 32,
        width: '100%',
        padding: 24,
        backgroundColor: '#000',
        borderRadius: 20,
        border: '1px solid #222',
      }}
    >
      {/* Left Card: System Backing */}
      <div
        style={{
          flex: 1,
          border: '1px solid #444',
          borderRadius: 16,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <PanelHeader title="System Backing" />
        <ResponsiveContainer width="100%" height={360}>
          <AreaChart data={systemBackingData}>
            <XAxis axisLine={false} tickLine={false} dataKey="date" tick={{ fontSize: 10, fill: '#aaa' }} stroke="#777" />
            <YAxis axisLine={false} tickLine={false} stroke="#777" tick={{ fontSize: 10, fill: '#aaa' }} tickFormatter={(v) => `${v}M`} />
            <Tooltip />
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
              stroke="#ffffff"
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
          border: '1px solid #444',
          borderRadius: 16,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <PanelHeader title="Collateral Ratio" />
        <ResponsiveContainer width="100%" height={360}>
          <LineChart data={day_CR}>
            <XAxis axisLine={false} tickLine={false} dataKey="day" stroke="#777" tick={{ fontSize: 10, fill: '#aaa' }} />
            <YAxis axisLine={false} tickLine={false} domain={[150, "auto"]} stroke="#777" tickFormatter={(value) => `${value.toFixed(0)}%`} tick={{ fontSize: 10, fill: '#aaa' }} />
            <Tooltip />
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

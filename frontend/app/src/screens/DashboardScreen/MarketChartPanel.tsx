'use client';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { PanelHeader } from './PanelTitle';

const chartData = [
  { date: '1/25', protocol: 20, bvusd: 19, usdc: 20, btc: 18 },
  { date: '2/25', protocol: 30, bvusd: 28, usdc: 29, btc: 26 },
  { date: '3/25', protocol: 45, bvusd: 42, usdc: 44, btc: 39 },
  { date: '4/25', protocol: 40, bvusd: 39, usdc: 38, btc: 35 },
  { date: '5/25', protocol: 35, bvusd: 34, usdc: 34, btc: 32 },
  { date: '6/25', protocol: 28, bvusd: 27, usdc: 26, btc: 25 },
  { date: '7/25', protocol: 22, bvusd: 21, usdc: 20, btc: 19 },
];

export function MarketChartPanel() {
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
      {/* Chart 1: Protocol APY and bvUSD APY */}
      <div
        style={{
          flex: 1,
          border: '1px solid #333',
          borderRadius: 16,
          padding: 10,
        }}
      >
        <PanelHeader title="Protocol APY and bvUSD APY" />
        <ResponsiveContainer width="100%" height={360}>
          <AreaChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <XAxis axisLine={false} tickLine={false} dataKey="date" stroke="#777" tick={{ fontSize: 10, fill: '#aaa' }} />
            <YAxis axisLine={false} tickLine={false} stroke="#777" tick={{ fontSize: 10, fill: '#aaa' }} tickFormatter={(v) => `${v}%`} />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="protocol"
              stroke="#FFB11B"
              fill="rgba(255, 177, 27, 0.1)"
              name="Protocol APY"
            />
            <Area
              type="monotone"
              dataKey="bvusd"
              stroke="#E0E0E0"
              fill="rgba(255, 255, 255, 0.05)"
              name="bvUSD APY"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart 2: Average Funding */}
      <div
        style={{
          flex: 1,
          border: '1px solid #333',
          borderRadius: 16,
          padding: 24,
        }}
      >
        <PanelHeader title="Average Funding" />
        <ResponsiveContainer width="100%" height={360}>
          <AreaChart data={chartData}>
            <XAxis axisLine={false} tickLine={false} dataKey="date" stroke="#777" tick={{ fontSize: 10, fill: '#aaa' }}/>
            <YAxis axisLine={false} tickLine={false} stroke="#777" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10, fill: '#aaa' }}/>
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="usdc"
              stroke="#FFB11B"
              fill="rgba(255, 177, 27, 0.1)"
              name="USDC"
            />
            <Area
              type="monotone"
              dataKey="btc"
              stroke="#B5C6FF"
              fill="rgba(181, 198, 255, 0.1)"
              name="BTC"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

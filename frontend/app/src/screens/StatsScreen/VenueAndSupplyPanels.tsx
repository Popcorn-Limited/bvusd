'use client';
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
} from 'recharts';
import { PanelHeader } from './PanelTitle';

const pieData = [
  { name: 'A', value: 40, color: '#F6B73C' },
  { name: 'B', value: 30, color: '#C9C9C9' },
  { name: 'C', value: 25, color: '#4BA4F0' },
  { name: 'D', value: 5, color: '#DB3C4B' },
];

const supplyData = [
  { date: '1/25', value: 0 },
  { date: '2/25', value: 4 },
  { date: '3/25', value: 8 },
  { date: '4/25', value: 7 },
  { date: '5/25', value: 7 },
  { date: '6/25', value: 7.5 },
  { date: '7/25', value: 9 },
];

export function VenueAndSupplyPanel() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 32,
        width: '100%',
        padding: 24,
        backgroundColor: '#000', // shared black background
        borderRadius: 20,
        border: '1px solid #222',
      }}
    >
      {/* Left Card: Venue Breakdown */}
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
        <PanelHeader title="Venue Breakdown" />
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

        <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
          {pieData.map((entry, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: entry.color,
                }}
              />
              <span style={{ color: '#aaa', fontSize: 12 }}>XXXXX</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Card: bvUSD Supply */}
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
        <PanelHeader title="bvUSD Supply" />
        <ResponsiveContainer width="100%" height={360}>
          <LineChart data={supplyData}>
            <XAxis axisLine={false} tickLine={false} dataKey="date" stroke="#777" tick={{ fontSize: 10, fill: '#aaa' }}/>
            <YAxis axisLine={false} tickLine={false} stroke="#777" tickFormatter={(v) => `${v}M`} tick={{ fontSize: 10, fill: '#aaa' }}/>
            <LineTooltip />
            <Line
              type="monotone"
              dataKey="value"
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

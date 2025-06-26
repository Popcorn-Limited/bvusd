'use client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as LineTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as PieTooltip,
} from 'recharts';
import { PanelHeader } from './PanelTitle';

const spreadData = [
  { x: 'XXX', value: 0 },
  { x: 'XXX', value: 2.8 },
  { x: 'XXX', value: 5.3 },
  { x: 'XXX', value: 7.9 },
  { x: 'XXX', value: 7.2 },
  { x: 'XXX', value: 8.0 },
  { x: 'XXX', value: 8.1 },
  { x: 'XXX', value: 9.5 },
];

const distributionData = [
  { name: 'xxxxx', value: 35, color: '#F6B73C' },
  { name: 'xxxxx', value: 30, color: '#E0E0E0' },
  { name: 'xxxxx', value: 25, color: '#4BA4F0' },
  { name: 'xxxxx', value: 10, color: '#DB3C4B' },
];

export function SpreadAndDistributionPanel() {
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
      {/* Left: Line Chart */}
      <div
        style={{
          flex: 1,
          border: '1px solid #333',
          borderRadius: 16,
          padding: 24,
        }}
      >
        <PanelHeader title="bvUSD Spread vs 3m Treasury" line={true} />
        <ResponsiveContainer width="100%" height={360}>
          <LineChart data={spreadData}>
            <XAxis axisLine={false} tickLine={false} dataKey="x" stroke="#777" tick={{ fontSize: 10, fill: '#aaa' }}/>
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

      {/* Right: Donut Chart */}
      <div
        style={{
          flex: 1,
          border: '1px solid #333',
          borderRadius: 16,
          padding: 24,
        }}
      >
        <PanelHeader title="bvUSD APY Weekly Distribution" />
        <ResponsiveContainer width="100%" height={360}>
          <PieChart>
            <Pie
              data={distributionData}
              dataKey="value"
              nameKey="name"
              innerRadius={80}
              outerRadius={110}
              paddingAngle={2}
              stroke="none"
            >
              {distributionData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={entry.color} />
              ))}
            </Pie>
            <PieTooltip />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 24, marginTop: 16 }}>
          {distributionData.map((entry, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: entry.color,
                }}
              />
              <span style={{ color: '#aaa', fontSize: 12 }}>{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

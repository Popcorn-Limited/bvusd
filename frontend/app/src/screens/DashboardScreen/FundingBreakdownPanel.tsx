'use client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as BarTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as PieTooltip,
} from 'recharts';
import { PanelHeader } from './PanelTitle';

const barData = [
  { quarter: 'XXXX-XX', yield: 1.2 },
  { quarter: 'XXXX-XX', yield: 2.5 },
  { quarter: 'XXXX-XX', yield: 3.3 },
  { quarter: 'XXXX-XX', yield: 3.9 },
  { quarter: 'XXXX-XX', yield: 4.5 },
  { quarter: 'XXXX-XX', yield: 5.0 },
  { quarter: 'XXXX-XX', yield: 5.8 },
];

const pieData = [
  { name: 'Positive', value: 70, color: '#F6B73C' },
  { name: 'Negative', value: 30, color: '#4BA4F0' },
];

export function FundingBreakdownPanel() {
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
      {/* Left: Bar Chart */}
      <div
        style={{
          flex: 1,
          border: '1px solid #333',
          borderRadius: 16,
          padding: 24,
        }}
      >
        <PanelHeader title="Avg Perp Yield by Quarter" />
          <ResponsiveContainer width="100%" height={360}>
          <BarChart data={barData}>
            <XAxis axisLine={false} tickLine={false} dataKey="quarter" stroke="#777" tick={{ fontSize: 10, fill: '#aaa' }} />
            <YAxis axisLine={false} tickLine={false} stroke="#777" tick={{ fontSize: 10, fill: '#aaa' }}/>
            <BarTooltip />
            <Bar dataKey="yield" fill="url(#goldGradient)" radius={[6, 6, 0, 0]} />
            <defs>
              <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F6B73C" />
                <stop offset="100%" stopColor="#D99E2B" />
              </linearGradient>
            </defs>
          </BarChart>
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
        <PanelHeader title="Positive vs Negative Funding Days" />
        <ResponsiveContainer width="100%" height={360}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              innerRadius={80}
              outerRadius={110}
              paddingAngle={2}
              stroke="none"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <PieTooltip />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 24, marginTop: 16 }}>
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
              <span style={{ color: '#aaa', fontSize: 12 }}>{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

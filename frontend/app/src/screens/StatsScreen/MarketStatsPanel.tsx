'use client';

interface StatItem {
  label: string;
  value: string;
}

const stats: StatItem[] = [
  { label: 'bvUSD APY', value: 'XX %' },
  { label: '30D Avg bvUSD APY', value: 'XX %' },
  { label: 'Avg Funding', value: 'XX %' },
  { label: 'Bitvault % of OI', value: 'XX %' },
];

export function MarketStatPanel() {
  return (
    <div
      style={{
        display: 'flex',
        gap: 24,
        padding: 24,
        backgroundColor: '#000',
        border: '1px solid #222',
        borderRadius: 20,
        width: '100%',
        justifyContent: 'space-between',
      }}
    >
      {stats.map((item, idx) => (
        <div
          key={idx}
          style={{
            flex: 1,
            border: '1px solid #333',
            borderRadius: 16,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: 14, color: '#aaa', marginBottom: 8 }}>{item.label}</span>
          <span style={{ fontSize: 28, color: '#fff', fontWeight: 600 }}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}

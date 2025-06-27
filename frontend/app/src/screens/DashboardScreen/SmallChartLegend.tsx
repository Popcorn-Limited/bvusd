import { LegendProps } from 'recharts';

export function SmallLegend({ payload }: LegendProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8, fontSize: 12 }}>
      {payload?.map((entry, index) => (
        <div
          key={`legend-${index}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginRight: 16,
            color: entry.color,
          }}
        >
          <svg width="10" height="10" style={{ marginRight: 4 }}>
            <circle cx="5" cy="5" r="5" fill={entry.color} />
          </svg>
          {entry.value}
        </div>
      ))}
    </div>
  );
}
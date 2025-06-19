'use client';

interface PanelHeaderProps {
  title: string;
}

export function PanelHeader({ title }: PanelHeaderProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h3 style={{ color: '#fff', marginBottom: 8, fontSize: 22 }}>{title}</h3>
      <div
        style={{
          width: '100%',
          height: 1,
          border: '1px solid #222',
        }}
      />
    </div>
  );
}
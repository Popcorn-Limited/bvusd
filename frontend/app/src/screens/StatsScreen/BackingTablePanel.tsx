'use client';
import Image from 'next/image';

import tokenBvusd from "../../../../uikit/src/token-icons/bvusd.svg";
import tokenBtcb from "../../../../uikit/src/token-icons/btcb.svg";
import tokenUsdc from "../../../../uikit/src/token-icons/usdc.svg";
import { PanelHeader } from './PanelTitle';

interface BackingRow {
  icon: string;
  label: string;
  values: string[];
}

const backingData: BackingRow[] = [
  {
    icon: tokenUsdc,
    label: 'USDC',
    values: ['XX $', 'XX $', 'XX $', 'XX $'],
  },
  {
    icon: tokenBvusd,
    label: 'bvUSD',
    values: ['XX $', 'XX $', 'XX $', 'XX $'],
  },
  {
    icon: tokenBtcb,
    label: 'BTC (LBTC)',
    values: ['XX $', 'XX $', 'XX $', 'XX $'],
  },
];

export function BackingTablePanel() {
  return (
    <div
      style={{
        backgroundColor: '#000',
        border: '1px solid #222',
        borderRadius: 16,
        padding: 24,
        width: '100%',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <PanelHeader title="Backing" />
        <span style={{ color: '#aaa', fontSize: 12 }}>Last update Jun 18</span>
      </div>

      {/* Table Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
          padding: '12px 0',
          borderBottom: '1px solid #333',
          color: '#aaa',
          fontSize: 12,
          textTransform: 'uppercase',
        }}
      >
        <div></div>
        <div>Name Provider</div>
        <div>Name Provider</div>
        <div>Name Provider</div>
        <div>Name Provider</div>
      </div>

      {/* Table Rows */}
      {backingData.map((row, idx) => (
        <div
          key={idx}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
            alignItems: 'center',
            padding: '16px 0',
            borderBottom: idx !== backingData.length - 1 ? '1px solid #222' : undefined,
            color: '#fff',
          }}
        >
          {/* Icon + Label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Image
              src={row.icon}
              alt={row.label}
              width={24}
              height={24}
              style={{ borderRadius: '50%' }}
            />
            <span>{row.label}</span>
          </div>

          {/* Provider Values */}
          {row.values.map((val, i) => (
            <div key={i}>{val}</div>
          ))}
        </div>
      ))}
    </div>
  );
}
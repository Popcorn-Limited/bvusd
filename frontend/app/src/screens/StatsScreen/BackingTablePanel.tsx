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
        background: "transparent",
        border: "1px solid var(--Neutral-100, #353945)",
        borderRadius: 16,
        padding: 24,
        gap: "100px",
        width: '100%',
        height: "284px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '20px'
        }}
      >
         <h3
          style={{
            color: "var(--Primary-White, #FFF)",
            fontFamily: "KHTeka",
            fontSize: "24px",
            fontStyle: "normal",
            fontWeight: "400",
            lineHeight: "120%",
          }}
        >
          Backing
        </h3>
        {/* <PanelHeader title="Backing" line={false}/> */}
        <span style={{ color: '#aaa', fontSize: "16px" }}>Last updated: 18 June 2025</span>
      </div>

      {/* Table Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
          padding: '10px',
          gap: 10,
          borderBottom: '1px solid #333',
          color: '#fff',
          fontSize: 14,
          fontFamily: "KHTeka",
          fontWeight: "400",
          textTransform: 'uppercase',
        }}
      >
        <div></div>
        <div>NAME PROVIDER</div>
        <div>NAME PROVIDER</div>
        <div>NAME PROVIDER</div>
        <div>NAME PROVIDER</div>
      </div>

      {/* Table Rows */}
      {backingData.map((row, idx) => (
        <div
          key={idx}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
            padding: '12px',
            gap: 16,
            borderBottom: "1px solid #23262F",
            color: '#fff',
            fontSize: 18,
            fontFamily: "KHTeka",
            fontWeight: "400",
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
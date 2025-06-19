'use client';

import React from "react";
import { PanelHeader } from "./PanelTitle";

const attestationMonths = [
  'Jan 25', 'Feb 25',
  'March 25', 'April 25',
  'May 25', 'Jun 25',
  'Jul 25', 'Aug 25',
  'Sept 25', 'Oct 25',
];

const proofData = [
  { name: 'Name', over: true, delta: true },
  { name: 'Name', over: true, delta: true },
  { name: 'Name', over: true, delta: false },
  { name: 'Name', over: true, delta: true },
  { name: 'Name', over: true, delta: true },
];

export function AttestationsAndProofPanel() {
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
      {/* Left: Custodian Attestations */}
      <div
        style={{
          flex: 1,
          border: '1px solid #333',
          borderRadius: 16,
          padding: 24,
        }}
      >
        <PanelHeader title="Custodian Attestations" />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
          }}
        >
          {attestationMonths.map((label, idx) => (
            <button
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: 12,
                backgroundColor: '#1e1e24',
                color: '#fff',
                border: 'none',
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              {label}
              <span style={{ color: '#aaa', fontSize: 14 }}>↗</span>
            </button>
          ))}
        </div>
      </div>

      {/* Right: Proof of Reserves */}
      <div
        style={{
          flex: 1,
          border: '1px solid #333',
          borderRadius: 16,
          padding: 24,
        }}
      >
        <PanelHeader title="Proof of Reserves" />
        <p style={{ color: '#aaa', fontSize: 12, marginBottom: 16 }}>18 Jun 25</p>

        <div
          style={{
            backgroundColor: '#1e1e24',
            padding: 16,
            borderRadius: 12,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 12,
            color: '#fff',
            fontSize: 14,
          }}
        >
          {/* Header */}
          <div style={{ fontWeight: 500, color: '#aaa' }}> </div>
          <div style={{ fontWeight: 500, color: '#aaa' }}>Overcollateralized</div>
          <div style={{ fontWeight: 500, color: '#aaa' }}>Delta-Neutral</div>

          {/* Rows */}
          {proofData.map((row, idx) => (
            <React.Fragment key={idx}>
              <div>{row.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {row.over ? 'YES' : 'NO'}
                <span>{row.over ? '☑️' : '❌'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {row.delta ? 'YES' : 'NO'}
                <span>{row.delta ? '☑️' : '❌'}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

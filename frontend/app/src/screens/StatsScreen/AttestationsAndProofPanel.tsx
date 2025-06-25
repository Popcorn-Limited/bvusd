"use client";

import React from "react";
import { PanelHeader } from "./PanelTitle";
import { center } from "@/styled-system/patterns";
import { CheckIcon, NoIcon } from "./CheckIcon";

const attestationMonths = [
  "Jan 25",
  "Feb 25",
  "March 25",
  "April 25",
  "May 25",
  "Jun 25",
  "Jul 25",
  "Aug 25",
  "Sept 25",
  "Oct 25",
];

const proofData = [
  { name: "Name", over: true, delta: true },
  { name: "Name", over: true, delta: true },
  { name: "Name", over: true, delta: false },
  { name: "Name", over: true, delta: true },
  { name: "Name", over: true, delta: true },
];

export function AttestationsAndProofPanel() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "row",
        gap: "24px",
      }}
    >
      {/* Left: Custodian Attestations */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "460px",
          flexShrink: 0,
          background: "transparent",
          borderRadius: "16px",
          border: "1px solid var(--Neutral-100, #353945)",
        }}
      >
        <PanelHeader title="Custodian Attestations" line={true} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            padding: 24,
          }}
        >
          {attestationMonths.map((label, idx) => (
            <button
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                borderRadius: 12,
                backgroundColor: "#1e1e24",
                color: "#fff",
                border: "none",
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              {label}
              <span style={{ color: "#aaa", fontSize: 14 }}>↗</span>
            </button>
          ))}
        </div>
      </div>

      {/* Right: Proof of Reserves */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "460px",
          flexShrink: 0,
          background: "transparent",
          borderRadius: "16px",
          border: "1px solid var(--Neutral-100, #353945)",
        }}
      >
        <PanelHeader title="Proof of Reserves" line={true} />
        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            padding: 10,
          }}
        >
          <div
            style={{
              width: "33%",
              fontWeight: 500,
              color: "#fff",
              textAlign: "center",
            }}
          >
            18 June 2025
          </div>
          <div
            style={{
              width: "33%",
              fontWeight: 500,
              color: "#fff",
              textAlign: "center",
            }}
          >
            Overcollateralized
          </div>
          <div
            style={{
              width: "33%",
              fontWeight: 500,
              color: "#fff",
              textAlign: "center",
            }}
          >
            Delta-Neutral
          </div>
        </div>
        <div
          style={{
            width: "95%",
            height: 1,
            background: "#353945",
            marginBottom: "16px",
            margin: "0 auto",
          }}
        />
        <div
          style={{
            width: "100%",
            paddingTop: 20,
          }}
        >
          <div
            style={{
              width: "95%",
              backgroundColor: "#1e1e24",
              padding: 5,
              marginTop: 20,
              margin: "0 auto",
              borderRadius: 12,
              alignItems: "center",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
              color: "#fff",
              fontSize: 16,
              textAlign: "center",
            }}
          >
            {/* Rows */}
            {proofData.map((row, idx) => (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: 500,
                    height: 40, // optional: keeps rows consistent
                  }}
                >
                  {row.name}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: 500,
                    height: 40,
                  }}
                >
                  {row.over ? "YES" : "NO"}
                  <span style={{ paddingLeft: 10 }}>
                    {row.over ? <CheckIcon /> : <NoIcon />}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: 500,
                    height: 40,
                  }}
                >
                  {row.delta ? "YES" : "NO"}
                  <span style={{ paddingLeft: 10 }}>
                    {row.delta ? <CheckIcon /> : <NoIcon />}
                  </span>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

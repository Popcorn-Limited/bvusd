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
            gap: 10,
            padding: 12,
          }}
        >
          {attestationMonths.map((label, idx) => (
            <button
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "15px",
                borderRadius: 12,
                backgroundColor: "#23262F",
                color: "#fff",
                border: "1px solid #353945",
                fontSize: 20,
                fontWeight: 400,
                fontFamily: "KHTeka",
                cursor: "pointer",
              }}
            >
              {label}
              <span style={{ color: "#f6ae3f", fontSize: 19 }}>↗</span>
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
            borderBottom: "1px solid #23262F",
          }}
        >
          <div
            style={{
              width: "33%",
              fontWeight: 400,
              fontSize: 18,
              paddingLeft: 12,
              fontFamily: "KHTeka",
              color: "#fff",
            }}
          >
            18 Jun 2025
          </div>
          <div
            style={{
              width: "33%",
              fontWeight: 400,
              fontFamily: "KHTeka",
              fontSize: 14,
              color: "#fff",
              textAlign: "center",
            }}
          >
            OVERCOLLATERALIZED
          </div>
          <div
            style={{
              width: "33%",
              fontWeight: 400,
              fontSize: 14,
              fontFamily: "KHTeka",
              color: "#fff",
              textAlign: "center",
            }}
          >
            DELTA-NEUTRAL
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
              backgroundColor: "#23262F",
              border: "1px solid #353945",
              padding: 20,
              marginTop: 20,
              margin: "0 auto",
              borderRadius: 12,
              alignItems: "center",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
              color: "#fff",
              fontSize: 16,
              fontFamily: "KHTeka",
              textAlign: "center",
            }}
          >
            {/* Rows */}
            {proofData.map((row, idx) => (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "left",
                    alignItems: "left",
                    fontWeight: 400,
                    fontFamily: "KHTeka",
                    fontSize: 18,
                    height: 40,
                  }}
                >
                  {row.name}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: 400,
                    fontFamily: "KHTeka",
                    fontSize: 14,
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
                    fontWeight: 400,
                    fontFamily: "KHTeka",
                    fontSize: 14,
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

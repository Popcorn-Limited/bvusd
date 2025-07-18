"use client";

import { fmtnum } from "@/src/formatting";

interface TroveRow {
  owner: string;
  troveId: string;
  collateralAsset: string;
  collateral: string;
  debt: string;
  cr: string;
}

type TroveProps = {
  troves: TroveRow[];
};

// TODO
const maxLTV = {
  ETH: 90,
  rETH: 85,
  wstETH: 90
}

export function TrovesPanel({ troves }: TroveProps) {
  console.log(troves[0]);
  return (
    <div
      style={{
        background: "transparent",
        border: "1px solid var(--Neutral-100, #353945)",
        borderRadius: 16,
        padding: 24,
        gap: "100px",
        width: "100%",
        height: "100%",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "20px",
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
          Troves List
        </h3>
      </div>

      {/* Table Header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 1fr",
          padding: "10px",
          gap: 10,
          borderBottom: "1px solid #333",
          color: "#fff",
          fontSize: 14,
          fontFamily: "KHTeka",
          fontWeight: "400",
          textTransform: "uppercase",
        }}
      >
        <div>Owner</div>
        <div>Collateral Asset</div>
        <div>Collateral Value</div>
        <div>Debt</div>
        <div>Collateral Ratio</div>
        <div>LTV</div>
        <div>MAX LTV</div>
      </div>

      {/* Table Rows */}
      {troves.map((row, idx) => (
        <div
          key={idx}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 1fr",
            padding: "12px",
            gap: 16,
            borderBottom: "1px solid #23262F",
            color: "#fff",
            fontSize: 18,
            fontFamily: "KHTeka",
            fontWeight: "400",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {`${row.owner.slice(0, 6)}...${row.owner.slice(-3)}`}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {row.collateralAsset}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {`${fmtnum(Number(row.collateral), "2z")} $`}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {`${fmtnum(Number(row.debt), "2z")} $`}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {fmtnum(Number(row.cr) * 100, "2z")} %
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {fmtnum(1 / Number(row.cr) * 100, "2z")} %
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {fmtnum(Number(maxLTV[row.collateralAsset]), "2z")} %
          </div>
        </div>
      ))}
    </div>
  );
}

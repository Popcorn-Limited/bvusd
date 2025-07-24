"use client";

import { fmtnum } from "@/src/formatting";
import { useMemo, useState } from "react";

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
  wstETH: 90,
};

export function TrovesPanel({ troves }: TroveProps) {
  const [sortBy, setSortBy] = useState("collateral");
  const [sortDir, setSortDir] = useState("desc");

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDir("asc");
    }
  };

  const getSortableValue = (row, column) => {
    switch (column) {
      case "owner":
        return row.owner;
      case "collateral":
        return Number(row.collateral);
      case "debt":
        return Number(row.debt);
      case "cr":
        return Number(row.cr);
      case "ltv":
        return 1 / Number(row.cr);
      case "maxltv":
        return Number(maxLTV[row.collateralAsset] || 0);
      default:
        return row[column];
    }
  };

  const sortedTroves = useMemo(() => {
    return [...troves].sort((a, b) => {
      const valA = getSortableValue(a, sortBy);
      const valB = getSortableValue(b, sortBy);
      const dir = sortDir === "asc" ? 1 : -1;
      return valA > valB ? dir : valA < valB ? -dir : 0;
    });
  }, [troves, sortBy, sortDir]);

  const renderHeaderCell = (label, columnKey) => (
    <div onClick={() => handleSort(columnKey)} style={{ cursor: "pointer" }}>
      {label} {sortBy === columnKey ? (sortDir === "asc" ? "↑" : "↓") : ""}
    </div>
  );

  return (
    <div
      style={{
        userSelect: "text",
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
        <div>{renderHeaderCell("Owner", "owner")}</div>
        <div>{renderHeaderCell("Collateral Asset", "collateralAsset")}</div>
        <div>{renderHeaderCell("Collateral Value", "collateral")}</div>
        <div>{renderHeaderCell("Debt", "debt")}</div>
        <div>{renderHeaderCell("Collateral Ratio", "cr")}</div>
        <div>{renderHeaderCell("LTV", "ltv")}</div>
        <div>{renderHeaderCell("MAX LTV", "maxltv")}</div>
      </div>

      {/* Table Rows */}
      {sortedTroves.map((row, idx) => (
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
            {fmtnum((1 / Number(row.cr)) * 100, "2z")} %
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {fmtnum(Number(maxLTV[row.collateralAsset]), "2z")} %
          </div>
        </div>
      ))}
    </div>
  );
}

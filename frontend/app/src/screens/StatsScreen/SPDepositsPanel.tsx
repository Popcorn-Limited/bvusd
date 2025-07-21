"use client";

import { fmtnum } from "@/src/formatting";
import { useMemo, useState } from "react";

interface DepositRow {
  depositor: string;
  collateralAsset: string;
  amount: string;
  time: string;
}

type SPProps = {
  deposits: DepositRow[];
};

const formatDate = (input: string) => {
  return new Date(input).toISOString().slice(0, 16).replace("T", " ");
};

export function SPDepositsPanel({ deposits }: SPProps) {
  const [sortBy, setSortBy] = useState("amount");
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
      case "depositor":
        return row.depositor;
      case "collateralAsset":
        return row.collateralAsset;
      case "amount":
        return Number(row.amount);
      case "time":
        return row.time;
      default:
        return row[column];
    }
  };

  const sortedDeposits = useMemo(() => {
    return [...deposits].sort((a, b) => {
      const valA = getSortableValue(a, sortBy);
      const valB = getSortableValue(b, sortBy);
      const dir = sortDir === "asc" ? 1 : -1;
      return valA > valB ? dir : valA < valB ? -dir : 0;
    });
  }, [deposits, sortBy, sortDir]);

  const renderHeaderCell = (label, columnKey) => (
    <div onClick={() => handleSort(columnKey)} style={{ cursor: "pointer" }}>
      {label} {sortBy === columnKey ? (sortDir === "asc" ? "↑" : "↓") : ""}
    </div>
  );

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
          SP Deposits List
        </h3>
      </div>

      {/* Table Header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
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
        <div>{renderHeaderCell("Depositor", "depositor")}</div>
        <div>{renderHeaderCell("Collateral Asset", "collateralAsset")}</div>
        <div>{renderHeaderCell("Amount", "amount")}</div>
        <div>{renderHeaderCell("Time", "time")}</div>
      </div>

      {/* Table Rows */}
      {sortedDeposits.map((row, idx) => (
        <div
          key={idx}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
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
            {`${row.depositor.slice(0, 6)}...${row.depositor.slice(-3)}`}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {row.collateralAsset}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {`${fmtnum(Number(row.amount), "2z")} $`}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {formatDate(row.time)}
          </div>
        </div>
      ))}
    </div>
  );
}

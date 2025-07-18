"use client";

import { fmtnum } from "@/src/formatting";

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
    return new Date(input).toISOString().slice(0, 16).replace('T', ' ');
}

export function SPDepositsPanel({ deposits }: SPProps) {
    console.log(deposits[0])
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
        <div>Depositor</div>
        <div>Collateral Asset</div>
        <div>Amount</div>
        <div>Time</div>
      </div>

      {/* Table Rows */}
      {deposits.map((row, idx) => (
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

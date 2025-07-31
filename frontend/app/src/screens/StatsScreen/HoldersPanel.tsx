"use client";

type HoldersProps = {
  holders: {
    holder: string;
    balance: string;
    lastUpdate: string;
  }[];
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleString("en-US", {
    timeZone: "UTC",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export function HoldersPanel({ holders }: HoldersProps) {
  // console.log(holders);

  return (
    <div
      style={{
        userSelect: "text",
        display: "flex",
        alignItems: "stretch",
        flexDirection: "row",
        gap: "24px",
        fontFamily: "KHTeka",
      }}
    >
      <div
        style={{
          flexBasis: "100%",
          flexGrow: 0,
          flexShrink: 0,
          padding: 24,
          display: "flex",
          flexDirection: "column",
          background: "transparent",
          borderRadius: "16px",
          border: "1px solid var(--Neutral-100, #353945)",
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
            bvUSD Holders
          </h3>
        </div>
        {/* Table Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
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
          <div>Address</div>
          <div>Balance</div>
          <div>Last Update</div>
        </div>

        {/* Table Rows */}
        {holders.map((row, idx) => (
          <div
            key={idx}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
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
              {`${row.holder.slice(0, 8)}...${row.holder.slice(-3)}`}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {row.balance}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {formatDate(row.lastUpdate)} UTC
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

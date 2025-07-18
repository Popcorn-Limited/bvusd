"use client";
import Image from "next/image";

import tokenBvusd from "../../../../uikit/src/token-icons/bvusd.svg";
import tokenBtcb from "../../../../uikit/src/token-icons/btcb.svg";
import tokenUsdc from "../../../../uikit/src/token-icons/usdc.svg";
import eth from "../../../../uikit/src/token-icons/eth.svg";
import { PanelHeader } from "./PanelTitle";
import {
  PieChart,
  ResponsiveContainer,
  Pie,
  Tooltip as PieTooltip,
  Cell,
} from "recharts";

interface VaultRow {
  icon: string;
  label: string;
  strategy: string;
  address: string;
  chain: string;
  chainIcon: string;
}

type ReserveProps = {
  collateralReserves: {
    asset: string;
    balance: string;
  }[];
};

const colors = ["#F6B73C", "#4BA4F0"];

// values: Strategy Name - Vault Address - Chain -APY?
const vaultsData: VaultRow[] = [
  {
    icon: tokenUsdc,
    label: "USDC",
    strategy: "USDC Vault",
    address: "0x452DC676b4E377a76B4b3048eB3b511A0F1ec057",
    chain: "Ethereum",
    chainIcon: eth,
  },
  {
    icon: tokenBvusd,
    label: "bvUSD",
    strategy: "bvUSD Vault",
    address: "0x452DC676b4E377a76B4b3048eB3b511A0F1ec057",
    chain: "Ethereum",
    chainIcon: eth,
  },
  {
    icon: tokenBtcb,
    label: "LBTC",
    strategy: "LBTC Vault",
    address: "0x452DC676b4E377a76B4b3048eB3b511A0F1ec057",
    chain: "Ethereum",
    chainIcon: eth,
  },
];

export function VaultsPanel({ collateralReserves }: ReserveProps) {
  console.log(collateralReserves);

  let pie = collateralReserves.map((c, i) => ({
    name: c.asset,
    value: Number(c.balance),
    color: colors[i]
  }));

  return (
<div
  style={{
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "row",
    gap: "24px",
    fontFamily: "KHTeka",
  }}
>
  {/* Left Card: 40% width */}
  <div
    style={{
      flexBasis: "40%",
      flexGrow: 0,
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      height: "460px",
      background: "transparent",
      borderRadius: "16px",
      border: "1px solid var(--Neutral-100, #353945)",
      fontFamily: "KHTeka",
    }}
  >
    <PanelHeader title="Asset reserves" line={false} />

    <ResponsiveContainer width="100%" height={360}>
      <PieChart>
        <Pie
          data={pie}
          dataKey="value"
          nameKey="name"
          innerRadius={80}
          outerRadius={110}
          paddingAngle={2}
          stroke="none"
          label={({ percent, value }) =>
            `${(percent * 100).toFixed(0)}% (${value})`
          }
          labelLine={false}
        >
          {pie.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>

    {/* Legend */}
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 24,
        marginTop: 16,
        marginBottom: 16,
      }}
    >
      {pie.map((entry, idx) => (
        <div
          key={idx}
          style={{ display: "flex", alignItems: "center", gap: 6 }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: entry.color,
            }}
          />
          <span style={{ color: "#aaa", fontSize: 12 }}>{entry.name}</span>
        </div>
      ))}
    </div>
  </div>

  {/* Right Card: 60% width */}
  <div
    style={{
      flexBasis: "60%",
      flexGrow: 0,
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      height: "460px",
      background: "transparent",
      borderRadius: "16px",
      border: "1px solid var(--Neutral-100, #353945)",
    }}
  >
    {/* Header */}
    <PanelHeader title="sbvUSD Vaults List" line={false} />

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
      <div>Asset</div>
      <div>Strategy Name</div>
      <div>Vault Address</div>
      <div>Chain</div>
    </div>

    {/* Table Rows */}
    {vaultsData.map((row, idx) => (
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
          <Image
            src={row.icon}
            alt={row.label}
            width={24}
            height={24}
            style={{ borderRadius: "50%" }}
          />
          <span>{row.label}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              backgroundColor: "#2b1b0a",
              color: "#f9a825",
              padding: "4px 10px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 500,
              fontFamily: "Inter, sans-serif",
              display: "inline-block",
            }}
          >
            {row.strategy}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {`${row.address.slice(0, 6)}...${row.address.slice(-3)}`}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Image
            src={row.chainIcon}
            alt={row.chain}
            width={24}
            height={24}
            style={{ borderRadius: "50%" }}
          />
          {row.chain}
        </div>
      </div>
    ))}
  </div>
</div>

  );
}

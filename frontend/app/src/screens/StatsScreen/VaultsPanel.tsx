"use client";
import Image from "next/image";

import tokenBvusd from "../../../../uikit/src/token-icons/bvusd.svg";
import tokenBtcb from "../../../../uikit/src/token-icons/btcb.svg";
import tokenUsdc from "../../../../uikit/src/token-icons/usdc.svg";
import eth from "../../../../uikit/src/token-icons/eth.svg";
import katana from "../../../../uikit/src/token-icons/katana.svg";
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

const colors = ["#F6B73C", "#4BA4F0"];

// values: Strategy Name - Vault Address - Chain -APY?
export const vaultsData: VaultRow[] = [
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
    address: "0x24e2ae2f4c59b8b7a03772142d439fdf13aaf15b",
    chain: "Katana",
    chainIcon: katana,
  },
  // {
  //   icon: tokenBtcb,
  //   label: "LBTC",
  //   strategy: "LBTC Vault",
  //   address: "0x452DC676b4E377a76B4b3048eB3b511A0F1ec057",
  //   chain: "Ethereum",
  //   chainIcon: eth,
  // },
];

export function VaultsPanel() {
  return (
    <div
      style={{
        userSelect: "text",
        display: "flex",
        alignItems: "flex-start",
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
          height: "100%",
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
            sbvUSD Vaults
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

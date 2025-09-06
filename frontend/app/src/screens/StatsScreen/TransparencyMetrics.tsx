import { fmtnum } from "@/src/formatting";
import tokenBvusd from "../../../../uikit/src/token-icons/bvusd.svg";
import Image from "next/image";
import { useState } from "react";

interface BackingData {
  totalCollaterals: string;
  totalReserves: string;
}

interface sbvUSD {
  supply: string;
  chain: string;
  apy: string;
}

interface TransparencyMetricsProps {
  totalBacking: BackingData;
  avgCR: string;
  totalSupply: string;
  tvl: string;
  sbvUSD: sbvUSD[];
}

const reservesTooltip =
  "This figure shows the total \n" +
  "notional value of reserve assets, \n" +
  "comprising funds contributed to \n" +
  "mint bvUSD and assets \n" +
  "deployed into yield generation strategies";

const backingTooltip =
  "This shows the ratio of total \n" +
  "notional reserves to the total \n" +
  "supply of bvUSD, indicating the \n" +
  "protocol’s overall collateralization level.";

export function TransparencyMetrics({
  totalBacking,
  avgCR,
  totalSupply,
  tvl,
  sbvUSD,
}: TransparencyMetricsProps) {
  const backing =
    Number(totalBacking.totalCollaterals) + Number(totalBacking.totalReserves);
  const protocolBackingRatio = `${fmtnum(Number(avgCR), "2z")} %`;

  const sbvUSDApy = sbvUSD[0].apy === "0" ? "n/a" : `${sbvUSD[0].apy}%`;

  const tooltipText =
    sbvUSDApy != "n/a"
      ? `sbvUSD APY: ${sbvUSDApy}.\n` +
        "The APY is calculated using the\n" +
        "trailing one-week average of daily protocol returns,\n" +
        "which are distributed to the \n" +
        "staking rewards contract.\n\n" +
        "This is then divided by the \n" +
        "average staked sbvUSD balance each day\n" +
        "and annualized with weekly compounding.\n\n" +
        "The displayed APY is an estimate\n" +
        "and may fluctuate based on protocol performance.\n" +
        "It is not a fixed or guaranteed rate."
      : `sbvUSD APY: n/a. \n` +
        `This value will be shown after \n` +
        `one week of the protocol running`;

  const sbvUSDTotalSupply = sbvUSD.reduce(
    (sum, vault) => sum + Number(vault.supply),
    0
  );

  // TODO
  const sbvUSDAvgApy = sbvUSD.reduce(
    (sum, vault) => sum + Number(vault.supply),
    0
  );

  return (
    <div
      style={{
        userSelect: "text",
        display: "flex",
        flexDirection: "row",
        gap: "16px",
        padding: 24,
        background: "rgba(20, 20, 22, 0.30)",
        borderRadius: 16,
        border: "1px solid #333",
        color: "#fff",
        boxShadow:
          "0px 3px 8px 0px rgba(53, 57, 69, 0.40), 0px 0px 2px 0px #353945",
      }}
    >
      <MetricBox
        label="bvUSD Total Supply"
        value={`${fmtnum(Number(totalSupply), "2z")} bvUSD`}
      />
      <MetricBox
        label="Total Reserves"
        value={`$ ${fmtnum(Number(backing), "2z")}`}
        tooltip={reservesTooltip}
        above={true}
      />
      <MetricBox
        label="Backing Ratio"
        value={protocolBackingRatio}
        tooltip={backingTooltip}
        above={true}
      />
      <SBVUSDCard
        symbol="sbvUSD"
        supply={`$ ${fmtnum(Number(sbvUSDTotalSupply), "2z")}`}
        apy={sbvUSDApy}
        tooltip={tooltipText}
      />
    </div>
  );
}

function MetricBox({
  label,
  value,
  tooltip,
  above
}: {
  label: string;
  value: string;
  tooltip?: string;
  above?: boolean;
}) {
  return (
    <div
      style={{
        flex: "1 0 0",
        border: "1px solid #23262F",
        borderRadius: 16,
        padding: "20px",
        display: "flex",
        gap: 24,
        flexDirection: "column",
        justifyContent: "space-between",
        background: "rgba(20, 20, 22, 0.40)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <span
          style={{
            fontSize: 20,
            fontWeight: 400,
            fontFamily: "KHTeka",
            color: "#fff",
          }}
        >
          {label}
        </span>
        {tooltip && <InfoTooltip text={tooltip} above={above}/>}
      </div>

      <span
        style={{
          fontSize: 30,
          fontFamily: "KHTeka",
          fontWeight: 400,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function InfoTooltip({ text, above }: { text: string; above?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{ position: "relative", display: "inline-block", marginLeft: 10}}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Info icon */}
      <span
        style={{
          display: "inline-flex",
          justifyContent: "center",
          alignItems: "center",
          width: 16,
          height: 16,
          borderRadius: "50%",
          border: "1px solid white",
          color: "white",
          fontSize: 11,
          fontWeight: 700,
          cursor: "help",
          userSelect: "none",
        }}
      >
        i
      </span>

      {/* Tooltip */}
      {open && above && (
        <div
          style={{
            position: "absolute",
            bottom: "150%",
            transform: "translateX(-50%)",
            background: "black",
            color: "white",
            padding: "8px 12px",
            borderRadius: 6,
            fontSize: 14,
            wordBreak: "break-word",
            whiteSpace: "pre",
            maxWidth: 400,
            zIndex: 100,
            textAlign: "center",
            border: "1px solid #fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
        >
          {text}
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              marginLeft: -5,
              width: 0,
              height: 0,
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              borderTop: "5px solid black",
            }}
          />
        </div>
      )}

      {open && !above && (
        <div
          style={{
            position: "absolute",
            top: "150%",
            transform: "translateX(-50%)",
            background: "black",
            color: "white",
            padding: "8px 12px",
            borderRadius: 6,
            fontSize: 14,
            wordBreak: "break-word",
            whiteSpace: "pre",
            maxWidth: 400,
            zIndex: 100,
            textAlign: "center",
            border: "1px solid #fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
        >
          {text}
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              marginLeft: -5,
              width: 0,
              height: 0,
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              borderTop: "5px solid black",
            }}
          />
        </div>
      )}
    </div>
  );
}

function SBVUSDCard({
  symbol,
  supply,
  apy,
  tooltip,
}: {
  symbol: string;
  supply: string;
  apy: string;
  tooltip: string;
}) {
  return (
    <div
      style={{
        flex: "1 0 0",
        border: "1px solid #23262F",
        borderRadius: 16,
        padding: "20px",
        display: "flex",
        gap: 24,
        flexDirection: "column",
        justifyContent: "space-between",
        background: "rgba(20, 20, 22, 0.40)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center"}}>
          <div
            style={{
              width: "28px",
              height: "24px",
              borderRadius: "50%",
              backgroundColor: "black",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 20,
            }}
          >
            <Image
              src={tokenBvusd}
              alt={"sbvUSD"}
              width={24}
              height={20}
              style={{ borderRadius: "50%"}}
            />
          </div>
          <span
            style={{ fontWeight: 400, fontSize: 20, fontFamily: "KHTeka", marginLeft: "5px" }}
          >
            {symbol}
          </span>
          <InfoTooltip text={tooltip} />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column"}}>
          <span
            style={{ fontSize: "15px", color: "#666", fontFamily: "KHTeka" }}
          >
            Supply
          </span>
          <span
            style={{ fontSize: "26px", fontWeight: 400, fontFamily: "KHTeka" }}
          >
            {supply}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{ fontSize: "15px", fontFamily: "KHTeka", color: "#666" }}
            >
              APY
            </span>
          </div>
          <span
            style={{
              fontSize: "26px",
              fontWeight: 400,
              fontFamily: "KHTeka",
              color: "#F6B73C",
            }}
          >
            {apy}
          </span>
        </div>
      </div>
    </div>
  );
}

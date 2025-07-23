import { fmtnum } from "@/src/formatting";

interface BackingData {
  totalCollaterals: string;
  totalReserves: string;
}

interface TransparencyMetricsProps {
  totalBacking: BackingData;
  avgCR: string;
  totalSupply: string;
  tvl: string;
}

export function TransparencyMetrics({
  totalBacking,
  avgCR,
  totalSupply,
  tvl,
}: TransparencyMetricsProps) {
  const backing =
    Number(totalBacking.totalCollaterals) + Number(totalBacking.totalReserves);
  const protocolBackingRatio = `${fmtnum(Number(avgCR), "2z")} %`;

  // console.log(avgCR);

  return (
    <div
      style={{
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
        label="Total Backing (+ Reserve Fund)"
        value={`$ ${fmtnum(Number(backing), "2z")}`}
      />
      <MetricBox label="Collateral Ratio" value={protocolBackingRatio} />
      <MetricBox
        label="Total Value Locked"
        value={`$ ${fmtnum(Number(tvl), "2z")}`}
      />
    </div>
  );
}

function MetricBox({ label, value }: { label: string; value: string }) {
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
        background: "rgba(20, 20, 22, 0.40)",
      }}
    >
      <span
        style={{
          fontSize: 14,
          fontWeight: 400,
          fontFamily: "KHTeka",
          color: "#fff",
        }}
      >
        {label}
      </span>
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

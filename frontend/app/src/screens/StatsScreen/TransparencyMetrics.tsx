import { fmtnum } from "@/src/formatting";

interface TransparencyMetricsProps {
  protocolBackingRatio: string;
  totalBacking: string;
  totalSupply: string;
  price: string;
}

export function TransparencyMetrics({
  protocolBackingRatio,
  totalBacking,
  totalSupply,
  price,
}: TransparencyMetricsProps) {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        gap: "16px",
        padding: 24,
        background: "rgba(20, 20, 22, 0.30)",
        borderRadius: 16,
        border: "1px solid #333",
        color: "#fff",
        boxShadow: "0px 3px 8px 0px rgba(53, 57, 69, 0.40), 0px 0px 2px 0px #353945",
      }}
    >
      <MetricBox label="Protocol Backing Ratio" value={protocolBackingRatio} />
      <MetricBox label="Total Backing (+ Reserve Fund)" value={totalBacking} />
      <MetricBox
        label="bvUSD Total Supply"
        value={`${fmtnum(Number(totalSupply), "2z")} bvUSD`}
      />
      <MetricBox label="bvUSD Price" value={price} />
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
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        background: "rgba(20, 20, 22, 0.40)"
      }}
    >
      <span
        style={{
          fontSize: 14,
          color: "#aaa",
          marginBottom: 8,
          gap: "8px"
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 30,
          fontWeight: 600,
        }}
      >
        {value}
      </span>
    </div>
  );
}

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
        gap: 32,
        padding: 24,
        backgroundColor: "#000",
        borderRadius: 16,
        border: "1px solid #333",
        color: "#fff",
      }}
    >
      <MetricBox label="Protocol Backing Ratio" value={protocolBackingRatio} />
      <MetricBox label="Total Backing (+ Reserve Fund)" value={totalBacking} />
      <MetricBox label="bvUSD Total Supply" value={totalSupply} />
      <MetricBox label="bvUSD Price" value={price} />
    </div>
  );
}

function MetricBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        flex: 1,
        border: "1px solid #333",
        borderRadius: 16,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <span
        style={{
          fontSize: 14,
          color: "#aaa",
          marginBottom: 8,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 24,
          fontWeight: 600,
        }}
      >
        {value}
      </span>
    </div>
  );
}

import { fmtnum } from "@/src/formatting";
import { PanelHeader } from "./PanelTitle";

type AllocationData = {
  data: {
    label: string;
    usdValue: string;
    wallet: string;
  }[];
};

function sliceAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-3)}`;
}

export function AllocationPanel({ data }: AllocationData) {
  const total = data.reduce((sum, allo) => sum + Number(allo.usdValue), 0);

  return (
    <div
      style={{
        userSelect: "text",
        padding: 24,
        background: "rgba(20, 20, 22, 0.30)",
        borderRadius: 16,
        border: "1px solid #333",
        color: "#fff",
        boxShadow:
          "0px 3px 8px 0px rgba(53, 57, 69, 0.40), 0px 0px 2px 0px #353945",
      }}
    >
      <div style={{ paddingBottom: "15px", paddingLeft: "5px" }}>
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
          Allocation Overview
        </h3>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "16px",
        }}
      >
        {data.map((d) => (
          <MetricBox
            key={d.label}
            label={`${d.label} Allocation`}
            wallet={d.wallet}
            value={`$ ${fmtnum(Number(d.usdValue), "2z")}`}
          />
        ))}
        <MetricBox
          key={"total"}
          label={"Total Core TVL"}
          value={`$ ${fmtnum(Number(total), "2z")}`}
        />
      </div>
    </div>
  );
}

function MetricBox({
  label,
  value,
  wallet,
}: {
  label: string;
  value: string;
  wallet?: string;
}) {
  return (
    <div
      style={{
        flex: "1 0 0",
        border: "1px solid #23262F",
        borderRadius: 16,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
                justifyContent: "space-between",
        background: "rgba(20, 20, 22, 0.40)",
      }}
    >
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
      {wallet && (
        <div style={{ marginTop: 8 }}>
          <span
            style={{
              fontSize: 20,
              fontWeight: 400,
              fontFamily: "KHTeka",
              color: "#898888ff",
            }}
          >
            Sub Account: {sliceAddress(wallet)}
          </span>
        </div>
      )}

      <div style={{ marginTop: 24 }}>
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
    </div>
  );
}

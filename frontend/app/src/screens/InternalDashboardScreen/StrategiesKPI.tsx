import React, { useEffect, useState } from "react";
import { useStrategiesData } from "@/src/liquity-utils";
import { PanelHeader } from "../StatsScreen/PanelTitle";

type Inputs = {
  btcAmount: number;
  ltv: number;
  lpApy: number;
  borrowRate: number;
};

type Outputs = {
  loan: number;
  strategyYield: number;
  lpPayment: number;
  loanInterest: number;
  netProfit: number;
  yieldToBreakeven: number;
};

const sliceAmount = (amount: string) => {
  const index = amount.indexOf(".");
  if (index > 0) return amount.slice(0, index + 3);
  else return amount;
};

function display(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

export default function StrategiesKPI() {
  const strategies = useStrategiesData();
  const loadingState =
    strategies.isLoading || strategies.status === "pending"
      ? "loading"
      : strategies.status === "error"
      ? "error"
      : "success";

  // TODO input form
  const [inputs, setInputs] = useState<Inputs>({
    btcAmount: 100,
    ltv: 0.5,
    lpApy: 0.03,
    borrowRate: 0.08,
  });

  const handleChange = (field: keyof Inputs, value: string) => {
    const parsed = parseFloat(value);
    if (value === "") {
      setInputs((prev) => ({
        ...prev,
        [field]: 0,
      }));
    } else {
      if (!isNaN(parsed)) {
        if (field !== "btcAmount" && field !== "ltv")
          setInputs((prev) => ({
            ...prev,
            [field]: parsed / 100,
          }));
        else
          setInputs((prev) => ({
            ...prev,
            [field]: parsed,
          }));
      }
    }
  };

  const [outputs, setOutputs] = useState<Outputs[]>([
    {
      loan: 0,
      strategyYield: 0,
      lpPayment: 0,
      netProfit: 0,
      loanInterest: 0,
      yieldToBreakeven: 0,
    },
  ]);

  // compute outputs
  useEffect(() => {
    if (loadingState === "success") {
      const tempOutputs = strategies.data.btcPrice.map((row, index) => {
        const loan = parseFloat(row.avgPrice) * inputs.btcAmount * inputs.ltv;
        const strategyYield =
          (loan * parseFloat(strategies.data.mfOnePrice[index].apy)) / 100;
        const lpPayment =
          (parseFloat(row.avgPrice) * inputs.btcAmount * inputs.lpApy) / 12;
        const loanInterest = (loan * inputs.borrowRate) / 12;
        const netProfit = strategyYield - loanInterest - lpPayment;
        const toBreakeven = parseFloat(
          sliceAmount((((loanInterest + lpPayment) * 100) / loan).toString())
        );
        return {
          loan,
          strategyYield,
          lpPayment,
          loanInterest,
          netProfit,
          yieldToBreakeven: toBreakeven,
        };
      });

      setOutputs(tempOutputs);
    }
  }, [loadingState, inputs]);

  return (
    loadingState === "success" && (
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
          <PanelHeader title="MFOne Profitability" line={true} />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px",
              width: "100%",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              fontFamily: "sans-serif",
            }}
          >
            <div
              style={{
                padding: "16px",
                display: "flex",
                gap: "24px",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                fontFamily: "sans-serif",
              }}
            >
              <Field
                label="BTC Amount"
                value={`${inputs.btcAmount}`}
                onChange={(v) => handleChange("btcAmount", v)}
              />
              <Field
                label="LTV"
                value={`${inputs.ltv}`}
                onChange={(v) => handleChange("ltv", v)}
              />
              <Field
                label="LP APY %"
                value={`${inputs.lpApy * 100}`}
                onChange={(v) => handleChange("lpApy", v)}
              />
              <Field
                label="USDC Borrow Rate %"
                value={`${inputs.borrowRate * 100}`}
                onChange={(v) => handleChange("borrowRate", v)}
              />
            </div>
          </div>

          {/* Table Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
              alignItems: "center",
              gap: 16,
              fontSize: 14,
              fontWeight: 500,
              textTransform: "uppercase",
              padding: "12px",
              background: "#1a1a1a",
              borderBottom: "1px solid #333",
            }}
          >
            <div>Date</div>
            <div>Avg BTC Price</div>
            <div>USD LOAN AMOUNT</div>
            <div>Lp Payment</div>
            <div>Loan Interest</div>
            <div>Monthly Yield</div>
            <div>Net Profit</div>
            <div>Yield To Breakeven</div>
          </div>

          {/* Scrollable Table Body */}
          <div
            style={{
              maxHeight: 10 * 52,
              overflowY: "auto",
            }}
          >
            {outputs.length === strategies.data.btcPrice.length ? (
              strategies.data.btcPrice.map((row, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
                    alignItems: "center",
                    gap: 16,
                    padding: "12px",
                    borderBottom: "1px solid #23262F",
                    fontSize: 16,
                  }}
                >
                  <div>{row.month}</div>
                  <div>{sliceAmount(row.avgPrice)}</div>
                  <div>$ {display(outputs[idx].loan)}</div>
                  <div>$ {display(outputs[idx].lpPayment)}</div>
                  <div>$ {display(outputs[idx].loanInterest)}</div>
                  <div>
                    <span style={{ color: "green" }}>
                      $ {display(outputs[idx].strategyYield)} (
                      {sliceAmount(
                        parseFloat(
                          strategies.data.mfOnePrice[idx].apy
                        ).toString()
                      )}
                      %)
                    </span>
                  </div>
                  {outputs[idx].netProfit > 0 ? (
                    <div>
                      <span style={{ color: "green" }}>
                        $
                        {display(
                          parseFloat(
                            sliceAmount(outputs[idx].netProfit.toString())
                          )
                        )}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span style={{ color: "red" }}>
                        $
                        {display(
                          parseFloat(
                            sliceAmount(outputs[idx].netProfit.toString())
                          )
                        )}
                      </span>
                    </div>
                  )}
                  <div>{display(outputs[idx].yieldToBreakeven)}%</div>
                </div>
              ))
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    )
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

const Field: React.FC<FieldProps> = ({ label, value, onChange }) => (
  <div style={{ textAlign: "center" }}>
    <div style={{ fontSize: "14px", color: "#F6B73C", marginBottom: "4px" }}>
      {label}
    </div>
    <input
      type="number"
      value={value === "0" ? "" : value}
      step="0.01"
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: "6px 8px",
        fontSize: "16px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        textAlign: "center",
      }}
    />
  </div>
);

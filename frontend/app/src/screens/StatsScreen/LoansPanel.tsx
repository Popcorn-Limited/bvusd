import { fmtnum } from "@/src/formatting";
import { Button } from "@liquity2/uikit";

type LoanEntry = {
  protocol: string;
  wallet: string;
  collateralValue: string;
  loanValue: string;
};

type LoansData = {
  data: LoanEntry[];
};

type TotalsByProtocol = {
  [protocol: string]: {
    totalCollateral: number;
    totalLoan: number;
  };
};

export function LoansPanel(data: LoansData) {
  const totals = aggregateByProtocol(data);
  return (
    <div
      style={{
        userSelect: "text",
        padding: "30px",
        background: "rgba(20, 20, 22, 0.30)",
        borderRadius: 16,
        border: "1px solid #333",
        color: "#fff",
        boxShadow:
          "0px 3px 8px 0px rgba(53, 57, 69, 0.40), 0px 0px 2px 0px #353945",
      }}
    >
      <h3
        style={{
          color: "var(--Primary-White, #FFF)",
          fontFamily: "KHTeka",
          fontSize: "22px",
          fontStyle: "normal",
          fontWeight: "400",
          lineHeight: "120%",
          paddingLeft: "30px",
        }}
      >
        Total Value Locked
      </h3>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "16px",
        }}
      >
        {Object.entries(totals).map(
          ([protocol, { totalCollateral, totalLoan }]) => (
            <MetricBox
              key={protocol}
              value={`$ ${fmtnum(
                Number(totalCollateral) - Number(totalLoan),
                "2z"
              )}`}
            />
          )
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          paddingLeft: "30px",
        }}
      >
        <span
          style={{
            fontSize: 16,
            fontWeight: 400,
            fontFamily: "KHTeka",
            color: "#fff",
          }}
        >
          Learn more about our services
        </span>
        <span
          style={{
            fontSize: 16,
            fontFamily: "KHTeka",
            fontWeight: 400,
          }}
        >
          Institutional Contact: joshua@bitvault.finance
        </span>
      </div>
      <div
        style={{
          padding: "30px",
        }}
      >
        <Button
          label="Contact"
          mode="primary"
          size="medium"
          shape="rectangular"
          onClick={() => {
            window.location.href = "mailto:joshua@bitvault.finance";
          }}
        />
      </div>
    </div>
  );
}

function MetricBox({ value }: { value: string }) {
  return (
    <div
      style={{
        flex: "1 0 0",
        padding: "30px",
        display: "flex",
        flexDirection: "column",
      }}
    >
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

function aggregateByProtocol(loansData: LoansData): TotalsByProtocol {
  return loansData.data.reduce(
    (acc, { protocol, collateralValue, loanValue }) => {
      if (!acc[protocol]) {
        acc[protocol] = { totalCollateral: 0, totalLoan: 0 };
      }

      acc[protocol].totalCollateral += Number(collateralValue);
      acc[protocol].totalLoan += Number(loanValue);

      return acc;
    },
    {} as TotalsByProtocol
  );
}

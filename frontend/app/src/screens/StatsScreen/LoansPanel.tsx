import { fmtnum } from "@/src/formatting";
import { Button } from "@liquity2/uikit";

// type LoanEntry = {
//   protocol: string;
//   wallet: string;
//   collateralValue: string;
//   loanValue: string;
// };

// type LoansData = {
//   data: LoanEntry[];
// };

// type TotalsByProtocol = {
//   [protocol: string]: {
//     totalCollateral: number;
//     totalLoan: number;
//   };
// };

export function LoansPanel({ btcTVL }) {
  // const totals = aggregateByProtocol(data);

  return (
    <>
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
          label="Total Value Locked"
          key={btcTVL}
          value={`$ ${fmtnum(Number(btcTVL), "2z")}`}
        />
      </div>

      <div
        style={{
          userSelect: "text",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 24,
          background: "rgba(20, 20, 22, 0.30)",
          borderRadius: 16,
          border: "1px solid #333",
          color: "#fff",
          boxShadow:
            "0px 3px 8px 0px rgba(53, 57, 69, 0.40), 0px 0px 2px 0px #353945",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span
            style={{
              fontSize: 22,
              fontWeight: 400,
              fontFamily: "KHTeka",
              color: "#fff",
            }}
          >
            Learn more about our services
          </span>
          <span
            style={{
              fontSize: 20,
              fontFamily: "KHTeka",
              fontWeight: 400,
            }}
          >
            Institutional Contact:{" "}
            <span style={{ textDecoration: "underline" }}>
              joshua@bitvault.finance
            </span>
          </span>
        </div>
        <Button
          style={{ borderRadius: 30 }}
          label="Contact Us"
          mode="primary"
          size="medium"
          shape="rectangular"
          onClick={() => {
            window.location.href = "mailto:joshua@bitvault.finance";
          }}
        />
      </div>
    </>
  );
}

function MetricBox({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        flex: "1 0 0",
        borderRadius: 16,
        display: "flex",
        gap: 24,
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <span
          style={{
            fontSize: 22,
            fontWeight: 400,
            fontFamily: "KHTeka",
            color: "#fff",
          }}
        >
          {label}
        </span>
      </div>

      <span
        style={{
          fontSize: 33,
          fontFamily: "KHTeka",
          fontWeight: 400,
        }}
      >
        {value}
      </span>
    </div>
  );
}

// function aggregateByProtocol(loansData: LoansData): TotalsByProtocol {
//   return loansData.data.reduce(
//     (acc, { protocol, collateralValue, loanValue }) => {
//       if (!acc[protocol]) {
//         acc[protocol] = { totalCollateral: 0, totalLoan: 0 };
//       }

//       acc[protocol].totalCollateral += Number(collateralValue);
//       acc[protocol].totalLoan += Number(loanValue);

//       return acc;
//     },
//     {} as TotalsByProtocol
//   );
// }

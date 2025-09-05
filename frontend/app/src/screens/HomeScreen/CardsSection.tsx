import { useState, useLayoutEffect } from "react";
import tokenbvUSD from "../../../../uikit/src/token-icons/bvusd.svg";
import tokensbvUSD from "../../../../uikit/src/token-icons/sbvusd.svg";
import { Card } from "./Card";
import { BorrowModal } from "./BorrowModal";

const sbvUSDBullets = [
  "Allocated to market-neutral & private credit",
  "Managed by institutional partners",
  "Backed 100% by bluechip stablecoins",
  "Open to all (ex. U.S. persons)",
  "No minimums",
];

const bvUSDBullets = [
  "Earn REAL YIELD on your Bitcoin by",
  "Overcollateralized Borrowing",
  "KYB required, minimum 1 BTC",
];

function useSharedHeights() {
  const [vars, setVars] = useState({
    ["--intro-h" as any]: "340px",
    ["--apy-h" as any]: "36px",
  });

  useLayoutEffect(() => {
    const calc = () => {
      const intro = Math.max(280, Math.min(window.innerHeight * 0.34, 380));
      const apy = Math.max(28, Math.min(window.innerHeight * 0.05, 44));
      setVars({
        ["--intro-h" as any]: `${Math.round(intro)}px`,
        ["--apy-h" as any]: `${Math.round(apy)}px`,
      });
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  return vars as React.CSSProperties;
}

export function CardsRow({ children }: { children: React.ReactNode }) {
  const cssVars = useSharedHeights();
  return <div style={cssVars}>{children}</div>;
}

export default function CardsSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section
      style={{
        width: "63%",
        maxWidth: "1200px",
        margin: "0 auto",
        display: "grid",
        gridTemplateRows: "auto auto 1fr",
        justifyItems: "center",
        textAlign: "center",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <h1
        style={{
          color: "white",
          fontSize: "2.5rem",
          fontWeight: 400,
          lineHeight: 1,
          textAlign: "center",
        }}
      >
        Welcome to BitVault
      </h1>
      <h2
        style={{
          fontSize: 18,
          fontWeight: 300,
          color: "#a2a2a2ff",
          textAlign: "center",
        }}
      >
        Unlock capital efficiency with Bitcoin-backed borrowing or
        institutional-yield strategies
      </h2>

      {/* Cards Container */}
      <CardsRow>
        <div
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 24,
            padding: 16,
            boxSizing: "border-box",
            height: "100%",
            minHeight: 0,
          }}
        >
          <Card
            tokenImage={tokensbvUSD}
            backgroundColor="#23262F"
            textColor="white"
            imageUrl={"/images/sbvUSDBackground.jpg"}
            badgeText="sbvUSD"
            apy="12%"
            headline="Institutional-Grade Yield"
            subhead="Open to All"
            bullets={sbvUSDBullets}
            ctaText="Earn Now"
            onCta={() =>
              window.open("https://app.bitvault.finance/vault", "_blank")
            }
          />

          <Card
            tokenImage={tokenbvUSD}
            backgroundColor="#353945"
            textColor="white"
            imageUrl={"/images/bvUSDBackground.jpg"}
            badgeText="bvUSD"
            headline="Institutional Borrowing"
            bullets={bvUSDBullets}
            ctaText="Borrow Now"
            onCta={() => setIsOpen(true)}
          />
        </div>
      </CardsRow>

      {isOpen && <BorrowModal onClose={() => setIsOpen(false)} />}
    </section>
  );
}

import { useState } from "react";
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
          backgroundColor="#1A1F2B"
          textColor="white"
          imageUrl={"/sbvUSDBackground.jpg"}
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
          backgroundColor="#F9FAFB"
          textColor="black"
          imageUrl={"/bvUSDBackground.jpg"}
          badgeText="bvUSD"
          headline="Institutional Borrowing"
          bullets={bvUSDBullets}
          ctaText="Borrow Now"
          onCta={() => setIsOpen(true)}
        />
        {isOpen && <BorrowModal onClose={() => setIsOpen(false)} />}
      </div>
    </section>
  );
}

import { useState } from "react";
import { useModal } from "@/src/services/ModalService";
import { SuccessModalContent } from "./WhitelistModal";
import { Button, Checkbox, TokenIcon, TokenSymbol } from "@liquity2/uikit";
import { postInstitutionalRequest } from "@/src/actions";

const ASSETS = {
  "btc": false,
  "usdc": false,
  "usdt": false,
}

export function BorrowModal() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telegram, setTelegram] = useState("");
  const [amount, setAmount] = useState("<$1M");
  const [assets, setAssets] = useState<{ [key: string]: boolean }>(ASSETS);
  const [newsletter, setNewsletter] = useState(false);
  const { setVisible: setModalVisibility, setContent: setModalContent } = useModal()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const res = await postInstitutionalRequest({ name, email, telegram, amount, assets, newsletter })

      if (res.error) {
        alert("Error");
      } else {
        setModalContent(<SuccessModalContent />);
        setModalVisibility(true);
      }
    } catch (e) {
      alert("Error");
    }
  }

  return (
    <>
      <style jsx>{`
        .newsletter-row { grid-column: span 1; }
        @media (min-width: 768px) {
          .newsletter-row { grid-column: span 2; }
        }
      `}
      </style>
      {/* Title */}
      <h2
        style={{
          fontSize: "22px",
          fontWeight: 600,
          textAlign: "center",
          marginBottom: "8px",
        }}
      >
        Request Access
      </h2>

      {/* Subtitle */}
      <p
        style={{
          textAlign: "center",
          fontSize: "16px",
          fontWeight: 400,
          color: "#aaa",
          lineHeight: 1.4,
          width: "60%",
          margin: "8px auto 0 auto",
        }}
      >
        Provide info below and a team member
        will be in touch with you shortly.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ marginTop: "32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", margin: "24px 0" }}>
          <div className="newsletter-row">
            <label
              style={{
                display: "block",
                fontSize: "14px",
                marginBottom: "6px",
                color: "#ccc",
              }}
            >
              Name of Fund / Institutions
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your fund / institutions name"
              style={{
                width: "100%",
                background: "transparent",
                border: "1px solid #333",
                borderRadius: "6px",
                padding: "12px",
                color: "#fff",
                fontSize: "14px",
              }}
            />
          </div>

          <div style={{ gridColumn: "span 1" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                marginBottom: "6px",
                color: "#ccc",
              }}
            >
              Investing Asset
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
              <AssetButton label="BTC" symbol="BVBTC" active={assets.btc} onClick={() => setAssets({ ...assets, btc: !assets.btc })} />
              <AssetButton label="USDC" symbol="USDC" active={assets.usdc} onClick={() => setAssets({ ...assets, usdc: !assets.usdc })} />
              <AssetButton label="USDT" symbol="USDT" active={assets.usdt} onClick={() => setAssets({ ...assets, usdt: !assets.usdt })} />
            </div>
          </div>

          <div style={{ gridColumn: "span 1" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                marginBottom: "6px",
                color: "#ccc",
              }}
            >
              Amount to Invest
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
              <AmountToggle amount="$1M-$5M" active={amount === "$1M-$5M"} onClick={() => setAmount("$1M-$5M")} />
              <AmountToggle amount="$5M-$10M" active={amount === "$5M-$10M"} onClick={() => setAmount("$5M-$10M")} />
              <AmountToggle amount="$50M" active={amount === "$50M"} onClick={() => setAmount("$50M")} />
            </div>
          </div>

          <div style={{ gridColumn: "span 1" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                marginBottom: "6px",
                color: "#ccc",
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              style={{
                width: "100%",
                background: "transparent",
                border: "1px solid #333",
                borderRadius: "6px",
                padding: "12px",
                color: "#fff",
                fontSize: "14px",
              }}
            />
          </div>

          <div style={{ gridColumn: "span 1" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                marginBottom: "6px",
                color: "#ccc",
              }}
            >
              Telegram{" "}
              <span style={{ color: "#777", fontSize: "12px" }}>
                (optional)
              </span>
            </label>
            <input
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              placeholder="@MyTelegramHandle"
              style={{
                width: "100%",
                background: "transparent",
                border: "1px solid #333",
                borderRadius: "6px",
                padding: "12px",
                color: "#fff",
                fontSize: "14px",
              }}
            />
          </div>

          <div className="newsletter-row">
            <span style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: "24px", height: "24px" }}>
                <Checkbox checked={newsletter} onChange={() => setNewsletter(!newsletter)} appearance="checkbox" />
              </div>
              <p style={{ fontSize: "12px", fontWeight: 400, color: "#FFFFFF80", textAlign: "left", margin: "4px 0 0 8px" }}>
                Subscribe to the BitVault newsletter for up-to-date alerts, tutorials, and partner drops. Unsubscribe anytime.
              </p>
            </span>
          </div>
        </div>

        {/* Submit */}
        <Button
          label="Request Access"
          mode="primary"
          size="medium"
          shape="rectangular"
          wide
          type="submit"
          disabled={!name || !email || !amount || !Object.values(assets).some(Boolean)}
        />
      </form>
    </>
  );
}


function AssetButton({ label, symbol, active, onClick }: { label: string, symbol: TokenSymbol, active: boolean, onClick: () => void }) {
  return (
    <div
      style={{ background: "transparent", borderRadius: "18px", padding: "4px 8px", cursor: "pointer", border: active ? "1px solid #f4b400" : "1px solid #333" }}
      onClick={onClick}
    >
      <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <TokenIcon symbol={symbol} size="small" />
        <p style={{ fontSize: "14px", color: "#fff" }}>{label}</p>
      </span>
    </div>
  )
}

function AmountToggle({ amount, active, onClick }: { amount: string, active: boolean, onClick: () => void }) {
  return (
    <div
      style={{ background: "transparent", borderRadius: "18px", padding: "4px 8px", cursor: "pointer", border: active ? "1px solid #f4b400" : "1px solid #333" }}
      onClick={onClick}
    >
      <p style={{ fontSize: "14px", color: "#fff", textAlign: "center" }}>{amount}</p>
    </div>
  )
}
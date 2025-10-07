import { useState } from "react";
import { Button, Checkbox } from "@liquity2/uikit";
import { useModal } from "@/src/services/ModalService";
import { BorrowModal } from "./BorrowModal";
import { postWhitelistRequest } from "@/src/actions";

const BENEFITS = [
  "Exact launch date/time + early how-tos",
  "Pool menu & integration updates",
  "Eligibility reminders for the Bits Program"
];

export function WhitelistModal() {
  const [email, setEmail] = useState("");
  const [telegram, setTelegram] = useState("");
  const [evmAddress, setEvmAddress] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const { setVisible: setModalVisibility, setContent: setModalContent } = useModal()


  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const res = await postWhitelistRequest({ email, telegram, evmAddress, newsletter });

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
      {/* Title */}
      <h2
        style={{
          fontSize: "22px",
          fontWeight: 600,
          textAlign: "center",
        }}
      >
        Join the Whitelist
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
        Get alerted the moment deposits open.
        Earn Bits from day one once available.
      </p>

      {/* Benefits */}
      <div style={{ marginTop: "24px" }}>
        <p style={{ textAlign: "start", fontSize: "16px", marginBottom: "8px" }}>Benefits</p>
        <ul
          style={{
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            fontSize: "16px",
            fontWeight: 400,
            padding: "12px 0",
            borderTop: "1px solid #333",
            borderBottom: "1px solid #333",
            gap: "12px",
          }}
        >
          {BENEFITS.map((b, i) => (
            <li
              key={i}
              style={{
                textAlign: "left",
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 18,
                  height: 18,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 4,
                  fontSize: 18,
                }}
              >
                ✓
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", margin: "24px 0" }}>
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
                fontSize: "14px",
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

          <div style={{ gridColumn: "span 2" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                marginBottom: "6px",
                color: "#ccc",
              }}
            >
              EVM Address{" "}
            </label>
            <input
              value={evmAddress}
              onChange={(e) => setEvmAddress(e.target.value)}
              placeholder="0x0000000000000000000000000000000000000000"
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

          <div style={{ gridColumn: "span 2" }}>
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
          label="Join Whitelist"
          mode="primary"
          size="medium"
          shape="rectangular"
          wide
          disabled={(!email && !telegram) || !evmAddress}
          type="submit"
        />
      </form>

      <p
        style={{ textAlign: "center", color: "#F6AE3F", margin: "24px 0 0 0", cursor: "pointer" }}
        onClick={() => {
          setModalContent(<BorrowModal />);
          setModalVisibility(true);
        }}
      >
        Institutional desk? Request Access
      </p>
    </>
  );
}


export function SuccessModalContent() {
  return (
    <>
      <img src="/icons/verified.png" alt="Check" style={{ width: "100px", height: "100px", margin: "0 auto" }} />
      <h2
        style={{
          fontSize: "22px",
          fontWeight: 600,
          textAlign: "center",
        }}
      >
        You’re on the list!
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
        We'll email you launch alerts and updates.
        If you've added a wallet, we'll confirm your whitelist spot!
      </p>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "16px", margin: "24px 0" }}>
        <Button label="Follow on X" mode="primary" size="medium" shape="rectangular" wide onClick={() => window.open("https://x.com/BitVaultFinance", "_blank")} />
        <Button label="Join Telegram" mode="primary" size="medium" shape="rectangular" wide onClick={() => window.open("https://t.me/bitvaultTG", "_blank")} />
        {/* <Button label="Get a referral link" mode="primary" size="medium" shape="rectangular" wide /> */}
      </div>
    </>
  )
}
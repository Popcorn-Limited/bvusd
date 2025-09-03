import { useState } from "react";
import axios from "axios";

export function BorrowModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telegram, setTelegram] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const res = await axios.post("/api/contact", { name, email, telegram });

      if (res.status !== 200) {
        alert("Error");
      } else {
        alert("Submission Sent");
        onClose();
      }
    } catch (e) {
      alert("Error");
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#111315",
          borderRadius: "18px",
          padding: "40px",
          width: "600px",
          maxWidth: "90%",
          color: "#fff",
          position: "relative",
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            border: "none",
            background: "transparent",
            fontSize: "22px",
            color: "#aaa",
            cursor: "pointer",
          }}
        >
          ×
        </button>

        {/* Title */}
        <h2
          style={{
            fontSize: "22px",
            fontWeight: 600,
            textAlign: "center",
            marginBottom: "8px",
          }}
        >
          Request access to borrow bvUSD
        </h2>

        {/* Subtitle */}
        <p
          style={{
            textAlign: "center",
            fontSize: "15px",
            color: "#aaa",
            marginBottom: "32px",
            lineHeight: 1.4,
          }}
        >
          Please complete the form below and a member of the Bitvault team will
          reach out with the next steps
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  marginBottom: "6px",
                  color: "#ccc",
                }}
              >
                Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder=""
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

            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
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
                placeholder=""
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
          </div>

          <div style={{ marginBottom: "24px" }}>
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
              placeholder="@handle"
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

          {/* Submit */}
          <button
            type="submit"
            style={{
              width: "100%",
              background: "#f4b400",
              border: "none",
              borderRadius: "6px",
              padding: "14px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";

import { css } from "@/styled-system/css";
import { useState } from "react";

type CalculatorModalProps = {
  onClose: () => void;
};

const assetTypes = [
  { label: "Native BTC (5X)", multiplier: 5 },
  { label: "WBTC (3X)", multiplier: 3 },
  { label: "Exotic BTC (2X)", multiplier: 2 },
];

const quickAmounts = [1000, 5000, 10000, 25000, 50000, 100000];

export function CalculatorModal({ onClose }: CalculatorModalProps) {
  const [amount, setAmount] = useState(100000);
  const [selectedAsset, setSelectedAsset] = useState(assetTypes[0]);
  const [showDropdown, setShowDropdown] = useState(false);

  const points = (amount / 10000) * selectedAsset.multiplier;
  const referralPoints = points * 0.15;

  return (
    <div
      className={css({
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.7)",
        padding: "20px 24px 24px 24px",
        overflow: "auto",
      })}
      onClick={onClose}
    >
      <div
        className={css({
          background: "#1a1a1a",
          borderRadius: 16,
          width: "100%",
          maxWidth: 520,
          padding: "20px",
        })}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={css({
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 20,
          })}
        >
          <div className={css({ display: "flex", alignItems: "center", gap: 12 })}>
            <div
              className={css({
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(247, 147, 26, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              })}
            >
              🧮
            </div>
            <div>
              <h2
                className={css({
                  fontSize: 18,
                  fontWeight: 700,
                  marginBottom: 2,
                })}
              >
                Points Calculator
              </h2>
              <p
                className={css({
                  fontSize: 12,
                  color: "contentAlt",
                })}
              >
                Estimate your potential earnings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={css({
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              color: "contentAlt",
              fontSize: 24,
              lineHeight: 1,
              _hover: { color: "content" },
            })}
          >
            ×
          </button>
        </div>

        {/* Inputs */}
        <div
          className={css({
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 12,
          })}
        >
          {/* Amount Input */}
          <div>
            <label
              className={css({
                fontSize: 10,
                color: "contentAlt",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 6,
                display: "block",
              })}
            >
              Amount (USD)
            </label>
            <div
              className={css({
                display: "flex",
                alignItems: "center",
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: 8,
                padding: "10px 12px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              })}
            >
              <span className={css({ color: "contentAlt", marginRight: 8 })}>$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                className={css({
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: "content",
                  fontSize: 14,
                  width: "100%",
                  fontFamily: "inherit",
                })}
              />
            </div>
          </div>

          {/* Asset Type Dropdown */}
          <div>
            <label
              className={css({
                fontSize: 10,
                color: "contentAlt",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 6,
                display: "block",
              })}
            >
              Asset Type
            </label>
            <div className={css({ position: "relative" })}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={css({
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: 8,
                  padding: "10px 12px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "content",
                  fontSize: 14,
                  cursor: "pointer",
                  textAlign: "left",
                })}
              >
                <span>{selectedAsset.label}</span>
                <span className={css({ color: "contentAlt" })}>▼</span>
              </button>
              {showDropdown && (
                <div
                  className={css({
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "#2a2a2a",
                    borderRadius: 8,
                    marginTop: 4,
                    overflow: "hidden",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    zIndex: 10,
                  })}
                >
                  {assetTypes.map((asset) => (
                    <button
                      key={asset.label}
                      onClick={() => {
                        setSelectedAsset(asset);
                        setShowDropdown(false);
                      }}
                      className={css({
                        display: "block",
                        width: "100%",
                        padding: "10px 12px",
                        background: "none",
                        border: "none",
                        color: "content",
                        fontSize: 14,
                        cursor: "pointer",
                        textAlign: "left",
                        _hover: { background: "rgba(255, 255, 255, 0.1)" },
                      })}
                    >
                      {asset.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div
          className={css({
            display: "flex",
            gap: 8,
            marginBottom: 16,
            flexWrap: "wrap",
          })}
        >
          {quickAmounts.map((quickAmount) => (
            <button
              key={quickAmount}
              onClick={() => setAmount(quickAmount)}
              className={css({
                padding: "6px 12px",
                borderRadius: 6,
                background: amount === quickAmount ? "rgba(247, 147, 26, 0.2)" : "transparent",
                border: "1px solid",
                borderColor: amount === quickAmount ? "#F7931A" : "rgba(255, 255, 255, 0.2)",
                color: amount === quickAmount ? "#F7931A" : "contentAlt",
                fontSize: 12,
                cursor: "pointer",
                _hover: { borderColor: "rgba(255, 255, 255, 0.4)" },
              })}
            >
              ${quickAmount.toLocaleString()}
            </button>
          ))}
        </div>

        {/* Results Card 1 - Your Points */}
        <div
          className={css({
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: 10,
            padding: 14,
            marginBottom: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          })}
        >
          <div>
            <div className={css({ fontSize: 11, color: "contentAlt", marginBottom: 4 })}>
              If YOU deposit ${amount.toLocaleString()}:
            </div>
            <div className={css({ fontSize: 24, fontWeight: 700, color: "#F7931A" })}>
              {points.toLocaleString()} pts
            </div>
          </div>
          <div className={css({ textAlign: "right" })}>
            <div className={css({ fontSize: 11, color: "contentAlt", marginBottom: 4 })}>
              Multiplier
            </div>
            <div className={css({ fontSize: 20, fontWeight: 700 })}>
              {selectedAsset.multiplier}X
            </div>
          </div>
        </div>

        {/* Results Card 2 - Referral Points */}
        <div
          className={css({
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: 10,
            padding: 14,
            marginBottom: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          })}
        >
          <div>
            <div className={css({ fontSize: 11, color: "contentAlt", marginBottom: 4 })}>
              If someone uses YOUR link:
            </div>
            <div className={css({ fontSize: 24, fontWeight: 700, color: "positive" })}>
              +{referralPoints.toLocaleString()} pts
            </div>
          </div>
          <div className={css({ textAlign: "right" })}>
            <div className={css({ fontSize: 11, color: "contentAlt", marginBottom: 4 })}>
              Commission
            </div>
            <div className={css({ fontSize: 20, fontWeight: 700 })}>15%</div>
          </div>
        </div>

        {/* Footer Text */}
        <div className={css({ fontSize: 11, color: "contentAlt" })}>
          <div className={css({ marginBottom: 4 })}>
            <span className={css({ color: "#F7931A" })}>Formula:</span> Points = (USD / $1,000) ×{" "}
            {selectedAsset.multiplier}
          </div>
          <div>
            <span className={css({ color: "positive" })}>Referral:</span> 15% of referee's points
            (10% direct + 5% indirect)
          </div>
        </div>
      </div>
    </div>
  );
}

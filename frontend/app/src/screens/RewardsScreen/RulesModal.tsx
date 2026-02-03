"use client";

import { css } from "@/styled-system/css";
import { Button } from "@liquity2/uikit";

type RulesModalProps = {
  onClose: () => void;
};

function SectionBadge({ number, color = "#F7931A" }: { number: number; color?: string }) {
  return (
    <div
      className={css({
        width: 22,
        height: 22,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: 600,
        color: "white",
        flexShrink: 0,
      })}
      style={{ background: color }}
    >
      {number}
    </div>
  );
}

function StepBadge({ number }: { number: number }) {
  return (
    <div
      className={css({
        width: 20,
        height: 20,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 10,
        fontWeight: 600,
        color: "white",
        background: "#3B82F6",
        flexShrink: 0,
      })}
    >
      {number}
    </div>
  );
}

export function RulesModal({ onClose }: RulesModalProps) {
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
          maxWidth: 560,
          maxHeight: "95vh",
          overflow: "auto",
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
            marginBottom: 16,
          })}
        >
          <div>
            <h2
              className={css({
                fontSize: 20,
                fontWeight: 700,
                marginBottom: 2,
              })}
            >
              Referral Program Rules
            </h2>
            <p
              className={css({
                fontSize: 12,
                color: "contentAlt",
              })}
            >
              How to earn points with BitVault
            </p>
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

        {/* Section 1 - Asset Multipliers */}
        <div className={css({ marginBottom: 20 })}>
          <div
            className={css({
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 8,
            })}
          >
            <SectionBadge number={1} />
            <h3 className={css({ fontSize: 14, fontWeight: 600 })}>Asset Multipliers</h3>
          </div>
          <p
            className={css({
              fontSize: 12,
              color: "contentAlt",
              marginBottom: 10,
            })}
          >
            Earn points based on your deposit value. Different BTC assets have different multipliers:
          </p>
          <div
            className={css({
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 8,
            })}
          >
            <div
              className={css({
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: 10,
                padding: "12px 10px",
                textAlign: "center",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              })}
            >
              <div
                className={css({
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#F7931A",
                  marginBottom: 4,
                })}
              >
                5X
              </div>
              <div className={css({ fontSize: 12, fontWeight: 500, marginBottom: 2 })}>
                Native BTC
              </div>
              <div className={css({ fontSize: 10, color: "contentAlt" })}>Highest priority</div>
            </div>
            <div
              className={css({
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: 10,
                padding: "12px 10px",
                textAlign: "center",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              })}
            >
              <div
                className={css({
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#A855F7",
                  marginBottom: 4,
                })}
              >
                3X
              </div>
              <div className={css({ fontSize: 12, fontWeight: 500, marginBottom: 2 })}>WBTC</div>
              <div className={css({ fontSize: 10, color: "contentAlt" })}>Wrapped Bitcoin</div>
            </div>
            <div
              className={css({
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: 10,
                padding: "12px 10px",
                textAlign: "center",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              })}
            >
              <div
                className={css({
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#3B82F6",
                  marginBottom: 4,
                })}
              >
                2X
              </div>
              <div className={css({ fontSize: 12, fontWeight: 500, marginBottom: 2 })}>
                Exotic BTC
              </div>
              <div className={css({ fontSize: 10, color: "contentAlt" })}>cbBTC, BGBTC, etc.</div>
            </div>
          </div>
        </div>

        {/* Section 2 - Points Calculation */}
        <div className={css({ marginBottom: 20 })}>
          <div
            className={css({
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 8,
            })}
          >
            <SectionBadge number={2} />
            <h3 className={css({ fontSize: 14, fontWeight: 600 })}>Points Calculation</h3>
          </div>
          <div
            className={css({
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: 10,
              padding: 14,
              border: "1px solid rgba(255, 255, 255, 0.1)",
            })}
          >
            <div
              className={css({
                fontFamily: "monospace",
                fontSize: 12,
                marginBottom: 10,
              })}
            >
              <span className={css({ color: "#F7931A" })}>Points</span> = (Deposit USD Value /
              $1,000) × Multiplier
            </div>
            <div className={css({ fontSize: 11, color: "contentAlt" })}>
              <span className={css({ color: "#F7931A" })}>Example:</span> Deposit $10,000 worth of
              Native BTC
              <br />
              Points = ($10,000 / $1,000) × 5 ={" "}
              <span className={css({ color: "positive", fontWeight: 600 })}>50 points</span>
            </div>
          </div>
        </div>

        {/* Section 3 - Referral Earnings */}
        <div className={css({ marginBottom: 20 })}>
          <div
            className={css({
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 8,
            })}
          >
            <SectionBadge number={3} />
            <h3 className={css({ fontSize: 14, fontWeight: 600 })}>Referral Earnings</h3>
          </div>
          <p
            className={css({
              fontSize: 11,
              color: "contentAlt",
              marginBottom: 10,
            })}
          >
            Earn a percentage of the points from users who deposit using your referral link:
          </p>
          <div
            className={css({
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: 10,
              padding: 12,
              border: "1px solid rgba(255, 255, 255, 0.1)",
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 8,
            })}
          >
            <div
              className={css({
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "#22C55E",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                color: "white",
                flexShrink: 0,
              })}
            >
              15%
            </div>
            <div>
              <div className={css({ fontSize: 12, fontWeight: 600, marginBottom: 1 })}>
                Direct Referral Bonus
              </div>
              <div className={css({ fontSize: 11, color: "contentAlt" })}>
                Earn 15% of your referee's deposit points
              </div>
            </div>
          </div>
          <div className={css({ textAlign: "center", marginBottom: 8, color: "contentAlt", fontSize: 12 })}>
            ↓
          </div>
          <div
            className={css({
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: 10,
              padding: 12,
              border: "1px solid rgba(255, 255, 255, 0.1)",
              fontSize: 11,
            })}
          >
            <span className={css({ color: "#F7931A" })}>Example:</span> Your referee deposits
            $10,000 of Native BTC and earns 50 points.
            <br />
            You earn: 50 × 15% ={" "}
            <span className={css({ color: "positive", fontWeight: 600 })}>7.5 points</span>
          </div>
        </div>

        {/* Section 4 - How to Participate */}
        <div className={css({ marginBottom: 20 })}>
          <div
            className={css({
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 10,
            })}
          >
            <SectionBadge number={4} />
            <h3 className={css({ fontSize: 14, fontWeight: 600 })}>How to Participate</h3>
          </div>
          <div className={css({ display: "flex", flexDirection: "column", gap: 8 })}>
            <div className={css({ display: "flex", alignItems: "center", gap: 10 })}>
              <StepBadge number={1} />
              <span className={css({ fontSize: 12 })}>
                Connect your wallet to get your unique referral link
              </span>
            </div>
            <div className={css({ display: "flex", alignItems: "center", gap: 10 })}>
              <StepBadge number={2} />
              <span className={css({ fontSize: 12 })}>
                Share your link with friends and community
              </span>
            </div>
            <div className={css({ display: "flex", alignItems: "center", gap: 10 })}>
              <StepBadge number={3} />
              <span className={css({ fontSize: 12 })}>
                Earn 15% of their deposit points automatically
              </span>
            </div>
            <div className={css({ display: "flex", alignItems: "center", gap: 10 })}>
              <StepBadge number={4} />
              <span className={css({ fontSize: 12 })}>
                Track your referrals and earnings on this dashboard
              </span>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div
          className={css({
            background: "rgba(234, 179, 8, 0.1)",
            borderRadius: 10,
            padding: 12,
            marginBottom: 16,
            borderLeft: "3px solid #EAB308",
          })}
        >
          <div
            className={css({
              fontSize: 12,
              fontWeight: 600,
              color: "#EAB308",
              marginBottom: 4,
            })}
          >
            Important Notes
          </div>
          <div className={css({ fontSize: 11, color: "contentAlt" })}>
            Points are calculated at time of deposit based on USD value.
          </div>
        </div>

        {/* Got it button */}
        <Button label="Got it!" mode="primary" wide onClick={onClose} size="small" />
      </div>
    </div>
  );
}

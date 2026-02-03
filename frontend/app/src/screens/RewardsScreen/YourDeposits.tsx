"use client";

import { css } from "@/styled-system/css";
import { Button, TokenIcon } from "@liquity2/uikit";

const mockDeposits = [
  {
    vault: "WBTC Vault",
    multiplier: "3X",
    deposit: 24500,
    amount: "0.25 WBTC",
    apy: 7.05,
    rewards: ["WBTC", "BVBTC"],
    icon: "B",
  },
  {
    vault: "Exotic BTC Vault",
    multiplier: "2X",
    deposit: 12200,
    amount: "0.125 cbBTC",
    apy: 5.82,
    rewards: ["cbBTC", "BVBTC"],
    icon: "B",
  },
];

function formatUsd(num: number): string {
  return `$${num.toLocaleString()}`;
}

export function YourDeposits() {
  const totalValue = mockDeposits.reduce((sum, d) => sum + d.deposit, 0);

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        padding: "20px 24px",
        background: "token(colors.infoSurface)",
        borderRadius: 12,
        border: "1px solid token(colors.neutral100)",
        flex: 1,
        minWidth: 0,
      })}
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
        <div>
          <h3
            className={css({
              fontSize: 16,
              fontWeight: 600,
              marginBottom: 2,
            })}
          >
            Your Deposits
          </h3>
          <span
            className={css({
              fontSize: 12,
              color: "contentAlt",
            })}
          >
            Active vault positions
          </span>
        </div>
        <div
          className={css({
            textAlign: "right",
          })}
        >
          <div
            className={css({
              fontSize: 18,
              fontWeight: 600,
              color: "positive",
            })}
          >
            {formatUsd(totalValue)}
          </div>
          <span
            className={css({
              fontSize: 12,
              color: "contentAlt",
            })}
          >
            Total Value
          </span>
        </div>
      </div>

      {/* Column Headers */}
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr 0.8fr 0.8fr 80px",
          gap: 12,
          padding: "0 0 12px 0",
          fontSize: 11,
          color: "contentAlt",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        })}
      >
        <span>Vault</span>
        <span>Deposit</span>
        <span>APY</span>
        <span>Rewards</span>
        <span></span>
      </div>

      {/* Rows */}
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: 16,
        })}
      >
        {mockDeposits.map((deposit, idx) => (
          <div
            key={idx}
            className={css({
              display: "grid",
              gridTemplateColumns: "1.5fr 1fr 0.8fr 0.8fr 80px",
              gap: 12,
              alignItems: "center",
            })}
          >
            {/* Vault */}
            <div
              className={css({
                display: "flex",
                alignItems: "center",
                gap: 10,
              })}
            >
              <div
                className={css({
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "#F7931A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "white",
                  flexShrink: 0,
                })}
              >
                {deposit.icon}
              </div>
              <div>
                <div
                  className={css({
                    fontSize: 14,
                    fontWeight: 500,
                  })}
                >
                  {deposit.vault}
                </div>
                <div
                  className={css({
                    fontSize: 12,
                    color: "contentAlt",
                  })}
                >
                  {deposit.multiplier} Points
                </div>
              </div>
            </div>

            {/* Deposit */}
            <div>
              <div
                className={css({
                  fontSize: 14,
                  fontWeight: 500,
                })}
              >
                {formatUsd(deposit.deposit)}
              </div>
              <div
                className={css({
                  fontSize: 12,
                  color: "contentAlt",
                })}
              >
                {deposit.amount}
              </div>
            </div>

            {/* APY */}
            <span
              className={css({
                fontSize: 14,
                color: "positive",
                fontWeight: 500,
              })}
            >
              {deposit.apy}%
            </span>

            {/* Rewards */}
            <TokenIcon.Group size="small">
              {deposit.rewards.map((r) => (
                <TokenIcon key={r} symbol={r as any} size="small" />
              ))}
            </TokenIcon.Group>

            {/* Action */}
            <Button label="Deposit" mode="primary" size="mini" />
          </div>
        ))}
      </div>
    </div>
  );
}

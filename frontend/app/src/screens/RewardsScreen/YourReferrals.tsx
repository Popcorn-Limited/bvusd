"use client";

import { css } from "@/styled-system/css";
import type { Referral } from "@/src/actions";
import { getAllVaults } from "@/src/config/chains";
import { useVaultPosition } from "@/src/bitvault-utils";

function formatUsd(num: number): string {
  return `$${num.toLocaleString()}`;
}

function truncateAddress(address: string): string {
  if (!address || address.length <= 13) return address || "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function getInitials(address: string): string {
  if (!address) return "??";
  return address.slice(2, 4).toUpperCase();
}

export const multiplierByVault: Record<string, number> = {
  "0xdb435e82b853c85dfbec81dc1120558e77632a2a": 3,
  "0x54c5515133dd9ced5c8f0bff834a2c004d9b7ccc": 2,
};

type ReferralDeposit = {
  address: string;
  vaultAsset: string;
  deposit: number;
  earnings: number;
  multiplier: number;
};

export function YourReferrals({ refs }: { refs: Referral[] }) {
  const totalEarnings = refs.reduce((sum) => sum + 10, 0); // Mock 10 pts per referral
  const vaults = getAllVaults();

  let allReferralsDeposits: ReferralDeposit[] = [];

  // get for all referrals all the vaults balances
  refs.map((r) => {
    let queries = vaults.vaultsArray.map((v) =>
      useVaultPosition(
        r.user as `0x${string}`,
        v[1].inputDecimals,
        v[1].chainId,
        v[1].address,
      ),
    );

    let allSuccess = queries.every((q) => q.status === "success");

    if (allSuccess)
      queries.map((q, idx) => {
        allReferralsDeposits.push({
          address: r.user,
          vaultAsset: vaults.vaultsArray[idx][0],
          earnings: 10,
          multiplier: multiplierByVault[vaults.vaultsArray[idx][1].address],
          deposit: Number(q.data.deposit),
        });
      });
  });

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
            Your Referrals
          </h3>
          <span
            className={css({
              fontSize: 12,
              color: "contentAlt",
            })}
          >
            {refs.length} referrals
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
            +{totalEarnings.toFixed(1)}
          </div>
          <span
            className={css({
              fontSize: 12,
              color: "contentAlt",
            })}
          >
            Points Earned
          </span>
        </div>
      </div>

      {/* Column Headers */}
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
          gap: 12,
          padding: "0 0 12px 0",
          fontSize: 11,
          color: "contentAlt",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        })}
      >
        <span>Referee</span>
        <span>Asset</span>
        <span>Deposit</span>
        <span>Your Earnings</span>
      </div>

      {/* Rows */}
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: 16,
        })}
      >
        {allReferralsDeposits.length > 0 ? (
          allReferralsDeposits.map((referral, idx) => (
            <div
              key={idx}
              className={css({
                display: "grid",
                gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
                gap: 12,
                alignItems: "center",
              })}
            >
              {/* Referee */}
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
                    fontSize: 11,
                    fontWeight: 600,
                    color: "white",
                    flexShrink: 0,
                  })}
                >
                  {getInitials(referral.address)}
                </div>
                <div
                  className={css({
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  })}
                >
                  <span
                    className={css({
                      fontSize: 14,
                      fontFamily: "monospace",
                    })}
                  >
                    {truncateAddress(referral.address)}
                  </span>
                  <div
                    className={css({
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#22C55E",
                    })}
                  />
                </div>
              </div>

              {/* Asset */}
              <div
                className={css({
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 10px",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 500,
                  width: "fit-content",
                })}
              >
                <span>{referral.vaultAsset}</span>
                <span className={css({ color: "positive" })}>
                  {referral.multiplier}
                </span>
              </div>

              {/* Deposit */}
              <span
                className={css({
                  fontSize: 14,
                  fontWeight: 500,
                })}
              >
                {formatUsd(referral.deposit)}
              </span>

              {/* Earnings */}
              <span
                className={css({
                  fontSize: 14,
                  fontWeight: 500,
                  color: "positive",
                })}
              >
                {referral.earnings}
              </span>
            </div>
          ))
        ) : (
          <div
            className={css({
              fontSize: 14,
              color: "contentAlt",
              textAlign: "center",
              padding: "20px 0",
            })}
          >
            No referrals yet
          </div>
        )}
      </div>
    </div>
  );
}

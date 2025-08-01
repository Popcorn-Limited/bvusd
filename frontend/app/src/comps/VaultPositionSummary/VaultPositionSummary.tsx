import type { PositionEarn, RequestBalance } from "@/src/types";

import { Amount } from "@/src/comps/Amount/Amount";
import { TagPreview } from "@/src/comps/TagPreview/TagPreview";
import { fmtnum } from "@/src/formatting";
import { isEarnPositionActive, useVault } from "@/src/liquity-utils";
import { css } from "@/styled-system/css";
import { bvUSD, IconArrowRight, IconPlus, InfoTooltip, TokenIcon, USDT } from "@liquity2/uikit";
import * as dn from "dnum";
import Link from "next/link";

export function VaultPositionSummary({
  prevEarnPosition,
  earnPosition,
  requestBalance,
  linkToScreen,
  txPreviewMode,
}: {
  prevEarnPosition?: PositionEarn | null;
  earnPosition: PositionEarn | null;
  requestBalance: RequestBalance | null;
  linkToScreen?: boolean;
  txPreviewMode?: boolean;
}) {
  const collToken = bvUSD
  const vault = useVault()

  const { totalDeposited: totalPoolDeposit } = vault.data;

  let share = dn.from(0, 18);
  let prevShare = dn.from(0, 18);
  if (totalPoolDeposit && dn.gt(totalPoolDeposit, 0)) {
    if (earnPosition) {
      share = dn.div(earnPosition.deposit, totalPoolDeposit);
    }
    if (prevEarnPosition) {
      prevShare = dn.div(prevEarnPosition.deposit, totalPoolDeposit);
    }
  }

  const active = txPreviewMode || isEarnPositionActive(earnPosition);

  return collToken && earnPosition && vault.data && (
    <div
      className={css({
        position: "relative",
        display: "flex",
        flexDirection: "column",
        padding: "12px 16px",
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: "solid",
        width: "100%",
        userSelect: "none",

        "--fg-primary-active": "token(colors.positionContent)",
        "--fg-primary-inactive": "token(colors.content)",

        "--fg-secondary-active": "token(colors.positionContentAlt)",
        "--fg-secondary-inactive": "token(colors.contentAlt)",

        "--border-active": "color-mix(in srgb, token(colors.white) 15%, transparent)",
        "--border-inactive": "token(colors.neutral100)",

        "--bg-active": "token(colors.position)",
        "--bg-inactive": "token(colors.infoSurface)",
      })}
      style={{
        color: `var(--fg-primary-${active ? "active" : "inactive"})`,
        background: `var(--bg-${active ? "active" : "inactive"})`,
        borderColor: active ? "transparent" : "var(--border-inactive)",
      }}
    >
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          gap: 16,
          paddingBottom: 12,
        })}
        style={{
          borderBottom: `1px solid var(--border-${active ? "active" : "inactive"})`,
        }}
      >
        <div
          className={css({
            flexGrow: 0,
            flexShrink: 0,
            display: "flex",
          })}
        >
          <TokenIcon
            symbol="sbvUSD"
            size={34}
          />
        </div>
        <div
          className={css({
            flexGrow: 1,
            display: "flex",
            justifyContent: "space-between",
          })}
        >
          <div
            className={css({
              display: "flex",
              flexDirection: "column",
            })}
          >
            <div>
              sbvUSD
            </div>
            <div
              className={css({
                display: "flex",
                gap: 4,
                fontSize: 14,
              })}
              style={{
                color: `var(--fg-secondary-${active ? "active" : "inactive"})`,
              }}
            >
              <div>TVL</div>
              <div>
                <Amount
                  fallback="-"
                  format="compact"
                  prefix="$"
                  value={dn.mul(totalPoolDeposit, vault.data.price)}
                />
              </div>
              <InfoTooltip heading="Total Value Locked (TVL)">
                Total amount of bvUSD deposited in this vault.
              </InfoTooltip>
            </div>
          </div>
          <div
            className={css({
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            })}
          >
            {txPreviewMode ? <TagPreview /> : (
              <>
                <div
                  className={css({
                    display: "flex",
                    gap: 6,
                  })}
                >
                  <div
                    className={css({
                      color: "contentAlt2",
                    })}
                  >
                    APR
                  </div>
                  <div>
                    <Amount
                      fallback="-%"
                      format="1z"
                      percentage
                      value={vault.data?.apr}
                    />
                  </div>
                  <InfoTooltip
                    content={{
                      heading: "Current APR",
                      body: "The annualized rate this stability pool’s "
                        + "deposits earned over the last 24 hours.",
                      footerLink: {
                        label: "Check Dune for more details",
                        href: "https://dune.com/dna/bvusd",
                      },
                    }}
                  />
                </div>
                <div
                  className={css({
                    display: "flex",
                    gap: 4,
                    fontSize: 14,
                  })}
                >
                  <div
                    className={css({
                      color: "contentAlt2",
                    })}
                  >
                    7d APR
                  </div>
                  <Amount
                    fallback="-%"
                    format="1z"
                    percentage
                    value={vault.data?.apr7d}
                  />
                  <InfoTooltip
                    content={{
                      heading: "APR (last 7 days)",
                      body: "The annualized percentage rate this stability pool’s "
                        + "deposits earned over the past 7 days.",
                      footerLink: {
                        label: "Check Dune for more details",
                        href: "https://dune.com/liquity/liquity-v2",
                      },
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div
        className={css({
          position: "relative",
          display: "flex",
          gap: 32,
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 12,
          height: 56,
          fontSize: 14,
        })}
      >
        <div
          className={css({
            display: "flex",
            gap: 32,
          })}
        >
          <div>
            <div
              style={{
                color: `var(--fg-secondary-${active ? "active" : "inactive"})`,
              }}
            >
              Deposit
            </div>
            <div
              className={css({
                display: "flex",
                alignItems: "center",
                gap: 8,
              })}
            >
              <div
                title={active
                  ? `${fmtnum(dn.mul(earnPosition.deposit, vault.data.price), "full")} bvUSD`
                  : undefined}
                className={css({
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: 4,
                  height: 24,
                })}
              >
                {active && fmtnum(dn.mul(earnPosition.deposit, vault.data.price))}
                <TokenIcon symbol="bvUSD" size="mini" title={null} />
              </div>
              {prevEarnPosition && (
                <div
                  title={`${fmtnum(dn.mul(prevEarnPosition.deposit, vault.data.price), "full")} bvUSD`}
                  className={css({
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: 4,
                    height: 24,
                    color: "contentAlt",
                    textDecoration: "line-through",
                  })}
                >
                  {fmtnum(dn.mul(prevEarnPosition.deposit, vault.data.price))}
                  <TokenIcon symbol="bvUSD" size="mini" title={null} />
                </div>
              )}
            </div>
          </div>
          <div>
            <div
              style={{
                color: `var(--fg-secondary-${active ? "active" : "inactive"})`,
              }}
            >
              Pending Withdrawal
            </div>
            <div
              className={css({
                display: "flex",
                alignItems: "center",
                gap: 8,
                height: 24,
              })}
            >
              {fmtnum(requestBalance.pendingShares)}
              <TokenIcon symbol="sbvUSD" size="mini" title={null} />
            </div>
          </div>
          {active && (
            <div>
              <div
                style={{
                  color: `var(--fg-secondary-${active ? "active" : "inactive"})`,
                }}
              >
                Pool share
              </div>
              <div
                className={css({
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  height: 24,
                })}
              >
                <Amount percentage value={share} />
                {prevEarnPosition && (
                  <div
                    className={css({
                      display: "inline",
                      color: "contentAlt",
                      textDecoration: "line-through",
                    })}
                  >
                    <Amount percentage value={prevShare} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {linkToScreen && (
          <OpenLink
            active={active}
            path={`/earn/${collToken.symbol.toLowerCase()}`}
            title={`${active ? "Manage" : "Deposit to"} ${collToken.name} pool`}
          />
        )}
      </div>
    </div>
  );
}

export function OpenLink({
  active,
  path,
  title,
}: {
  active: boolean;
  path: string;
  title: string;
}) {
  return (
    <Link
      title={title}
      href={path}
      className={css({
        position: "absolute",
        inset: "0 -16px -12px auto",
        display: "grid",
        placeItems: "center",
        padding: "0 12px 0 24px",
        borderRadius: 10,
      })}
    >
      <div
        className={css({
          display: "grid",
          placeItems: "center",
          width: 34,
          height: 34,
          color: "neutral100",
          background: "accent",
          borderRadius: "50%",
          transition: "scale 80ms",
          _hover: {
            background: "goldLight",
            scale: 1.05,
          },
          _active: {
            translate: "0 1px",
          },
        })}
      >
        {active
          ? <IconArrowRight size={24} />
          : <IconPlus size={24} />}
      </div>
    </Link>
  );
}

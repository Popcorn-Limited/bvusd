import type {
  Address,
  PositionEarn,
  RequestBalance,
  Token,
  TokenSymbol,
} from "@/src/types";
import Image from "next/image";

import { Amount } from "@/src/comps/Amount/Amount";
import { TagPreview } from "@/src/comps/TagPreview/TagPreview";
import { dnum8, DNUM_0, dnumOrNull } from "@/src/dnum-utils";
import { fmtnum } from "@/src/formatting";
import { isEarnPositionActive, useLiquityStats } from "@/src/liquity-utils";
import { css } from "@/styled-system/css";
import {
  IconArrowRight,
  IconPlus,
  InfoTooltip,
  TokenIcon,
} from "@liquity2/uikit";
import * as dn from "dnum";
import Link from "next/link";
import { useVault } from "@/src/bitvault-utils";
import { supportedChainIcons } from "@/src/config/chains";

export function VaultPositionSummary({
  prevEarnPosition,
  earnPosition,
  requestBalance,
  linkToScreen,
  vaultAsset,
  vaultAddress,
  vaultName,
  vaultSymbol,
  chainId,
  chainName,
  txPreviewMode,
}: {
  prevEarnPosition?: PositionEarn | null;
  earnPosition: PositionEarn | null;
  requestBalance: RequestBalance | null;
  linkToScreen?: boolean;
  vaultAsset: string;
  vaultAddress: Address;
  vaultName: string;
  vaultSymbol: string;
  chainId: number;
  chainName: string;
  txPreviewMode?: boolean;
}) {
  const { data } = useVault({ chainId, vaultAddress, vaultSymbol });

  // leftover from old liquity component structure
  let share = dn.from(0, 18);
  let prevShare = dn.from(0, 18);

  const active = txPreviewMode || isEarnPositionActive(earnPosition);

  return (
    data && (
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

          "--border-active":
            "color-mix(in srgb, token(colors.white) 15%, transparent)",
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
            borderBottom: `1px solid var(--border-${active ? "active" : "inactive"
              })`,
          }}
        >
          <div
            className={css({
              flexGrow: 0,
              flexShrink: 0,
              display: "flex",
            })}
          >
            <TokenIcon symbol={vaultAsset as TokenSymbol} size={34} />
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
              <div
                className={css({
                  display: "flex",
                  flexDirection: "row",
                })}
              >
                <Image
                  src={supportedChainIcons[chainName.toLowerCase()]}
                  alt={chainName.toLowerCase()}
                  width={13}
                  style={{ borderRadius: "50%", marginRight: "10px" }}
                />
                {vaultName}
              </div>

              <div
                className={css({
                  display: "flex",
                  gap: 4,
                  fontSize: 14,
                })}
                style={{
                  color: `var(--fg-secondary-${active ? "active" : "inactive"
                    })`,
                }}
              >
                <div>TVL</div>
                <div>
                  <Amount
                    fallback="-"
                    format="compact"
                    suffix={` ${vaultAsset}`}
                    value={data?.totalDeposited}
                  />
                </div>
                <InfoTooltip heading="Total Value Locked (TVL)">
                  Total amount of {vaultAsset} deposited in this vault.
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
              {txPreviewMode ? (
                <TagPreview />
              ) : (
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
                      30d APY
                    </div>
                    {
                      dn.greaterThan(data?.apr7d, 0) ?
                        <>
                          <Amount
                            fallback="-%"
                            format="1z"
                            percentage
                            value={data?.apr30d}
                          />
                          <InfoTooltip
                            content={{
                              heading: "APY (last 30 days)",
                              body:
                                "The annualized rate sbvUSD " +
                                "deposits earned over the past 30 days.",
                              footerLink: {
                                label: "Check Dune for more details",
                                href: "https://dune.com/dna/bvusd",
                              },
                            }}
                          />
                        </>
                        : <p>Coming Soon</p>
                    }
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
                      7d APY
                    </div>
                    {
                      dn.greaterThan(data?.apr7d, 0) ?
                        <>
                          <Amount
                            fallback="-%"
                            format="1z"
                            percentage
                            value={data?.apr7d}
                          />
                          <InfoTooltip
                            content={{
                              heading: "APY (last 7 days)",
                              body:
                                "The annualized percentage rate sbvUSD " +
                                "deposits earned over the past 7 days.",
                              footerLink: {
                                label: "Check Dune for more details",
                                href: "https://dune.com/dna/bvusd",
                              },
                            }}
                          />
                        </>
                        : <p>Coming Soon</p>
                    }
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
                  color: `var(--fg-secondary-${active ? "active" : "inactive"
                    })`,
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
                  title={
                    active
                      ? `${fmtnum(
                        dn.mul(earnPosition.deposit, data?.price),
                        "full"
                      )} ${vaultAsset}`
                      : undefined
                  }
                  className={css({
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: 4,
                    height: 24,
                  })}
                >
                  {active && fmtnum(dn.mul(earnPosition.deposit, data?.price))}
                  <TokenIcon
                    symbol={vaultAsset as TokenSymbol}
                    size="mini"
                    title={null}
                  />
                </div>
                {prevEarnPosition && (
                  <div
                    title={`${fmtnum(
                      dn.mul(prevEarnPosition.deposit, data?.price),
                      "full"
                    )} ${vaultAsset}`}
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
                    {fmtnum(dn.mul(prevEarnPosition.deposit, data?.price))}
                    <TokenIcon
                      symbol={vaultAsset as TokenSymbol}
                      size="mini"
                      title={null}
                    />
                  </div>
                )}
              </div>
            </div>
            <div>
              <div
                style={{
                  color: `var(--fg-secondary-${active ? "active" : "inactive"
                    })`,
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
                <TokenIcon
                  symbol={vaultAsset as TokenSymbol}
                  size="mini"
                  title={null}
                />
              </div>
            </div>
            {active && (
              <div>
                <div
                  style={{
                    color: `var(--fg-secondary-${active ? "active" : "inactive"
                      })`,
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
              path={`/vaults/${vaultAsset}-${chainId}`}
              title={`${active ? "Manage" : "Deposit to"} ${vaultAsset} vault`}
            />
          )}
        </div>
      </div>
    )
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
        {active ? <IconArrowRight size={24} /> : <IconPlus size={24} />}
      </div>
    </Link>
  );
}

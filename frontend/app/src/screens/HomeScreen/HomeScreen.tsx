"use client";

import { ProductCardGroup } from "@/src/comps/ProductCard/ProductCardGroup";
import { ProductCard } from "@/src/comps/ProductCard/ProductCard";
import { TokenIcon, TokenSymbol } from "@liquity2/uikit";
import { Screen } from "@/src/comps/Screen/Screen";
import content from "@/src/content";
import { css } from "@/styled-system/css";
import { getAllVaults, supportedChainIcons } from "@/src/config/chains";
import { Field } from "@/src/comps/Field/Field";
import { Tag } from "@/src/comps/Tag/Tag";
import { ProgressBar } from "@/src/comps/ProgressBar/ProgressBar";
import Image from "next/image";

export function HomeScreen() {
  const { vaults, vaultAssets, vaultsArray } = getAllVaults();

  return (
    <Screen
      heading={{
        title: (
          <div
            className={css({
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px 0 0 0",
              fontSize: 42,
              fontWeight: 700,
              gap: 8
            })}
          >
            {content.vaultsHome.headline(
              <TokenIcon.Group size="large">
                {[...vaultAssets].map((symbol) => {
                  return (<TokenIcon key={"symbol"} symbol={symbol as TokenSymbol} />)

                })}
              </TokenIcon.Group>
            )}
          </div>
        ),
        subtitle: <>{content.vaultsHome.subheading} </>,
      }}
      gap={16}
    >
      <div
        className={css({ padding: "16px 0 0 0" })}
      >
        <ProductCard
          headerTitle={
            <ProductCard.Title
              title={"BitVault Fund"}
              subtitle="Multi-Strategy BTC Yield"
              icon={<TokenIcon symbol={"BVBTC"} size={42} />}
            />
          }
          headerChildren={
            <div
              className={css({
                display: "flex",
                flexDirection: "row",
                gap: 24
              })}
            >
              <Field label="Bits"
                field={
                  <span
                    className={css({ display: "flex", flexDirection: "row", content: "center" })}>
                    <div className={css({ margin: "3px 4px 0 0" })}>
                      <TokenIcon symbol="bvUSD" size="mini" />
                    </div>
                    <p>20x</p>
                  </span>
                }
              />
              <Field label="Rewards" field={<TokenIcon.Group><TokenIcon key={"symbol"} symbol={"WBTC"} size="small" /><TokenIcon key={"symbol"} symbol={"bvUSD"} size="small" /></TokenIcon.Group>} />
              <Field label="30D APY" field={<p>4%</p>} />
              <Field label="TVL" field={<p>$20M</p>} />
            </div>
          }
          children={
            <div className={css({ display: "flex", flexDirection: "row", gap: 8, padding: "8px 0", color: "contentAlt", fontSize: 14 })}>
              <p>Deposit </p>
              <TokenIcon.Group>
                {[...vaultAssets].map((symbol) => <TokenIcon key={"symbol"} symbol={symbol as TokenSymbol} size="small" />)}
              </TokenIcon.Group>
              <p>on</p>
              <TokenIcon.Group>
                {Object.keys(supportedChainIcons).map((symbol) =>
                  <Image
                    src={supportedChainIcons[symbol]}
                    alt={symbol}
                    width={18}
                    style={{ borderRadius: "50%", margin: "0 4px 1px 0" }}
                  />)
                }
              </TokenIcon.Group>
            </div>
          }
          path="/"
        />
      </div>
      <ProductCardGroup
        name="Yield Asset by Tier"
        children={
          <>
            {/* BTC Native */}
            <ProductCard
              headerTitle={
                <ProductCard.Title
                  title={"Native Bitcoin"}
                  subtitle=""
                  icon={<TokenIcon symbol={"BVBTC"} size={42} />}
                />
              }
              headerChildren={
                <Tag
                  children="Recommended"
                  size="medium"
                  css={{
                    background: "color-mix(in srgb, token(colors.positive) 20%, transparent)",
                    color: "token(colors.positive)",
                    border: "none"
                  }} />
              }
              borderOverride="green"
              children={
                <div>
                  <div
                    className={css({
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                      borderBottom: "1px solid token(colors.neutral100)",
                      padding: "0 0 16px 0",
                      color: "contentAlt",
                      fontSize: 14
                    })}>
                    <div
                      className={css({
                        padding: "12px 16px",
                        background: "token(colors.controlSurface)",
                        borderRadius: 8,
                      })}
                    >
                      <p
                        className={css({
                          color: "token(colors.contentAlt)",
                          fontSize: 14
                        })}
                      >
                        30-Day Performance
                      </p>
                      <p
                        className={css({
                          fontSize: 18,
                          fontWeight: 600,
                          color: "positive"
                        })}
                      >
                        +4%
                      </p>
                    </div>

                    <div>
                      <div className={css({ display: "flex", flexDirection: "row", justifyContent: "space-between" })}>
                        <p>
                          Vault Capacity
                        </p>
                        <p>0 BTC / 5,000 BTC</p>
                      </div>
                      <div className={css({ marginTop: 8 })}>
                        <ProgressBar value={0} max={5000} />
                      </div>
                    </div>

                    <div>
                      <p>Accepted Assets</p>
                      <div>
                        <Tag children="BTC" size="medium" />
                      </div>
                    </div>

                  </div>
                  <div
                    className={css({
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      padding: "12px 0 0 0"
                    })}
                  >
                    <Tag
                      children="Tier 1"
                      size="medium"
                      css={{
                        borderRadius: 16,
                        background: "color-mix(in srgb, token(colors.positive) 20%, transparent)",
                        border: "none",
                        color: "token(colors.positive)"
                      }}
                    />
                    <Tag
                      children="20x Bits"
                      size="medium"
                      css={{
                        borderRadius: 16,
                        background: "color-mix(in srgb, token(colors.accent) 20%, transparent)",
                        border: "none",
                        color: "token(colors.accent)"
                      }}
                    />
                    <div className={css({ color: "contentAlt" })}>
                      <p>View Details</p>
                    </div>
                  </div>
                </div>
              }
              path="/"
            />
            {/* BTC Bluechip */}
            <ProductCard
              headerTitle={
                <ProductCard.Title
                  title={"Bluechip Bitcoin"}
                  subtitle=""
                  icon={<TokenIcon symbol={"BVBTC"} size={42} />}
                />
              }
              children={
                <div>
                  <div
                    className={css({
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                      borderBottom: "1px solid token(colors.neutral100)",
                      padding: "0 0 16px 0",
                      color: "contentAlt",
                      fontSize: 14
                    })}>
                    <div
                      className={css({
                        padding: "12px 16px",
                        background: "token(colors.controlSurface)",
                        borderRadius: 8,
                      })}
                    >
                      <p
                        className={css({
                          color: "token(colors.contentAlt)",
                          fontSize: 14
                        })}
                      >
                        30-Day Performance
                      </p>
                      <p
                        className={css({
                          fontSize: 18,
                          fontWeight: 600,
                          color: "positive"
                        })}
                      >
                        +4%
                      </p>
                    </div>

                    <div>
                      <div className={css({ display: "flex", flexDirection: "row", justifyContent: "space-between" })}>
                        <p>
                          Vault Capacity
                        </p>
                        <p>50 BTC / 5,000 BTC</p>
                      </div>
                      <div className={css({ marginTop: 8 })}>
                        <ProgressBar value={50} max={5000} />
                      </div>
                    </div>

                    <div>
                      <p>Accepted Assets</p>
                      <div className={css({ display: "flex", flexDirection: "row", gap: 8 })}>
                        <Tag children="WBTC" size="medium" />
                        <Tag children="LBTC" size="medium" />
                        <Tag children="cbBTC" size="medium" />
                        <Tag children="tBTC" size="medium" />
                      </div>
                    </div>

                  </div>
                  <div
                    className={css({
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      padding: "12px 0 0 0"
                    })}
                  >
                    <Tag
                      children="Tier 2"
                      size="medium"
                      css={{
                        borderRadius: 16,
                        background: "color-mix(in srgb, token(colors.positive) 20%, transparent)",
                        border: "none",
                        color: "token(colors.positive)"
                      }}
                    />
                    <Tag
                      children="20x Bits"
                      size="medium"
                      css={{
                        borderRadius: 16,
                        background: "color-mix(in srgb, token(colors.accent) 20%, transparent)",
                        border: "none",
                        color: "token(colors.accent)"
                      }}
                    />
                    <div className={css({ color: "contentAlt" })}>
                      <p>View Details</p>
                    </div>
                  </div>
                </div>
              }
              path="/"
            />
            {/* BTC Exotic */}
            <ProductCard
              headerTitle={
                <ProductCard.Title
                  title={"Exotic Bitcoin"}
                  subtitle=""
                  icon={<TokenIcon symbol={"bgBTC"} size={42} />}
                />
              }
              children={
                <div>
                  <div
                    className={css({
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                      borderBottom: "1px solid token(colors.neutral100)",
                      padding: "0 0 16px 0",
                      color: "contentAlt",
                      fontSize: 14
                    })}>
                    <div
                      className={css({
                        padding: "12px 16px",
                        background: "token(colors.controlSurface)",
                        borderRadius: 8,
                      })}
                    >
                      <p
                        className={css({
                          color: "token(colors.contentAlt)",
                          fontSize: 14
                        })}
                      >
                        30-Day Performance
                      </p>
                      <p
                        className={css({
                          fontSize: 18,
                          fontWeight: 600,
                          color: "positive"
                        })}
                      >
                        +4%
                      </p>
                    </div>

                    <div>
                      <div className={css({ display: "flex", flexDirection: "row", justifyContent: "space-between" })}>
                        <p>
                          Vault Capacity
                        </p>
                        <p>1100 BTC / 5,000 BTC</p>
                      </div>
                      <div className={css({ marginTop: 8 })}>
                        <ProgressBar value={1100} max={5000} />
                      </div>
                    </div>

                    <div>
                      <p>Accepted Assets</p>
                      <div className={css({ display: "flex", flexDirection: "row", gap: 8 })}>
                        <Tag children="bgBTC" size="medium" />
                        <Tag children="enzoBTC" size="medium" />
                      </div>
                    </div>

                  </div>
                  <div
                    className={css({
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      padding: "12px 0 0 0"
                    })}
                  >
                    <Tag
                      children="Tier 3"
                      size="medium"
                      css={{
                        borderRadius: 16,
                        background: "color-mix(in srgb, token(colors.positive) 20%, transparent)",
                        border: "none",
                        color: "token(colors.positive)"
                      }}
                    />
                    <Tag
                      children="20x Bits"
                      size="medium"
                      css={{
                        borderRadius: 16,
                        background: "color-mix(in srgb, token(colors.accent) 20%, transparent)",
                        border: "none",
                        color: "token(colors.accent)"
                      }}
                    />
                    <div className={css({ color: "contentAlt" })}>
                      <p>View Details</p>
                    </div>
                  </div>
                </div>
              }
              path="/vaults"
            />
          </>
        }
      />
    </Screen >
  );
}

"use client";

import * as dn from "dnum";
import { fmtnum } from "@/src/formatting";
import { usePrice } from "@/src/services/Prices";
import { useAccount, useBalance } from "@/src/wagmi-utils";
import { css } from "@/styled-system/css";
import { VaultPanel } from "../VaultScreen/VaultPanel";
import { TokenCard } from "../AccountScreen/TokenCard";
import PointsPanel from "../PointScreen/PointsPanel";


export function HomeScreen() {
  const account = useAccount();

  const bvusdBalance = useBalance(account.address, "bvUSD");
  const sbvusdBalance = useBalance(account.address, "sbvUSD");
  const vcraftBalance = useBalance(account.address, "VCRAFT");

  const bvusdPrice = usePrice("bvUSD");
  const sbvusdPrice = usePrice("sbvUSD");
  const vcraftPrice = usePrice("VCRAFT");

  return (
    <div
      className={css({
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        gap: 64,
        width: "100%",
      })}
    >
      {/* <Positions address={account.address ?? null} showNewPositionCard={false} /> */}
      <div className={css({
        background: "token(colors.neutralDimmed200)",
        border: "1px solid token(colors.neutral100)",
        borderRadius: 8,
        padding: 16,
      })}>
        <h1
          className={css({
            fontSize: 24,
            color: "content",
            userSelect: "none",
          })}
          style={{
            paddingBottom: 16,
          }}
        >
          My Tokens
        </h1>
        <div
          className={css({
            display: "grid",
            gap: 24,
          })}
          style={{
            gridTemplateColumns: `repeat(3, 1fr)`,
            gridAutoRows: 180,
          }}
        >
          <TokenCard
            token="bvUSD"
            link={{ label: "Buy", href: "/buy" }}
            subValues={[
              {
                label: "Value",
                value: `$${bvusdBalance.data && bvusdPrice.data
                  ? fmtnum(dn.mul(bvusdBalance.data, bvusdPrice.data), "2z")
                  : "0.00"
                  }`
              },
              {
                label: "Locked",
                value: `$${sbvusdBalance.data && sbvusdPrice.data
                  ? fmtnum(dn.mul(sbvusdBalance.data, sbvusdPrice.data), "2z")
                  : "0.00"
                  }`
              },
            ]}
          />
          <TokenCard
            token="sbvUSD"
            link={{ label: "Earn", href: "/vault" }}
            subValues={[
              {
                label: "Value",
                value: `$${sbvusdBalance.data && sbvusdPrice.data
                  ? fmtnum(dn.mul(sbvusdBalance.data, sbvusdPrice.data), "2z")
                  : "0.00"
                  }`
              },
              {
                label: "Apy",
                value: "10%"
              },
            ]}
          />
          <TokenCard
            token="VCRAFT"
            subValues={[
              {
                label: "Value",
                value: `$${vcraftBalance.data && vcraftPrice.data
                  ? fmtnum(dn.mul(vcraftBalance.data, vcraftBalance.data), "2z")
                  : "0.00"
                  }`
              },
            ]}
          />
        </div>
      </div>
      <div className={css({
        display: "flex",
        flexDirection: "row",
        gap: 48,
      })}>
         <div
          className={css({
            width: "40%",
          })}
        >
          <div
            className={css({
              background: "token(colors.neutralDimmed200)",
              border: "1px solid token(colors.neutral100)",
              borderRadius: 8,
              padding: 16
            })}
          >
            <h1
              className={css({
                fontSize: 24,
                color: "content",
                userSelect: "none",
              })}
              style={{
                paddingBottom: 16,
              }}
            >
              Earn
            </h1>
            <VaultPanel />
          </div>
        </div>
        
        <div className={css({
          width: "60%",
        })}>
          <PointsPanel showHeader={true} />
        </div>
       
      </div>
    </div>
  );
}
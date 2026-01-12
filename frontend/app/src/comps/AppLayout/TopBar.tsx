"use client";

import type { ComponentProps } from "react";

import content from "@/src/content";
import { css } from "@/styled-system/css";
import { IconDashboard, IconEarn } from "@liquity2/uikit";
import Link from "next/link";
import { AccountButton } from "./AccountButton";
import { Menu } from "./Menu";
import { TopBarLogo } from "@/src/comps/Logo/TopBarLogo";

const menuItems: ComponentProps<typeof Menu>["menuItems"] = [
  [content.menu.earn, "/earn", IconEarn],
  [content.menu.buy, "/buy", IconEarn],
  [content.menu.points, "/points", IconEarn],
  [content.menu.portfolio, "/account", IconDashboard],
  [content.menu.vaults, "/vaults", IconEarn],
  [content.menu.dashboard, "/dashboard", IconEarn],
];

export function TopBar() {
  return (
    <header
      className={css({
        position: "relative",
        zIndex: 1,
        padding: "0 32px",
      })}
    >
      <div
        className={css({
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "space-between",
          maxWidth: 1440,
          height: "100%",
          margin: "0 auto",
          padding: "12px 24px",
          fontSize: 16,
          fontWeight: 500,
          borderBottom: "1px solid var(--Neutral-100, #353945)",
        })}
      >
        <Link
          href="/"
          className={css({
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 4,
            height: "100%",
            paddingRight: 8,
            _active: {
              translate: "0 1px",
            },
            fontSize: 24,
          })}
        >
          <div
            className={css({
              flexShrink: 0,
            })}
          >
            <TopBarLogo />
          </div>
          <div
            className={css({
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: 8,
              whiteSpace: "nowrap",
            })}
          >
          </div>
        </Link>
        {/* <Menu menuItems={menuItems} /> */}
        <div
          className={css({
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            width: 140,
          })}
        >
          <AccountButton />
        </div>
      </div>
    </header>
  );
}

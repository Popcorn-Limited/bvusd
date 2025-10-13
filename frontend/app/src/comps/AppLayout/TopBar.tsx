"use client";

import type { ComponentProps } from "react";

import { Logo } from "@/src/comps/Logo/Logo";
import { Tag } from "@/src/comps/Tag/Tag";
import content from "@/src/content";
import { DEPLOYMENT_FLAVOR } from "@/src/env";
import { css } from "@/styled-system/css";
import { IconBorrow, IconDashboard, IconEarn } from "@liquity2/uikit";
import Link from "next/link";
import { AccountButton } from "./AccountButton";
import { Menu } from "./Menu";
import { TopBarLogo } from "@/src/comps/Logo/TopBarLogo";

const menuItems: ComponentProps<typeof Menu>["menuItems"] = [
  [content.menu.earn, "/vault", IconEarn],
  [content.menu.buy, "/buy", IconEarn],
  [content.menu.points, "/points", IconEarn],
  [content.menu.portfolio, "/account", IconDashboard],
  [content.menu.dashboard, "/dashboard", IconEarn],
];

export function TopBar() {
  return (
    <div
      className={css({
        position: "relative",
        zIndex: 1,
        height: 72,
        padding: "0 32px",
      })}
    >
      <div
        className={css({
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          maxWidth: 1440,
          height: "100%",
          margin: "0 auto",
          padding: "16px 24px",
          fontSize: 16,
          fontWeight: 500,
          background: "#141416",
          boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
          border: "1px solid var(--Neutral-100, #353945)",
          borderRadius: 16,
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
            {DEPLOYMENT_FLAVOR && (
              <div
                className={css({
                  display: "flex",
                })}
              >
                <Tag
                  size="mini"
                  css={{
                    color: "accentContent",
                    background: "brandCoral",
                    border: 0,
                    textTransform: "uppercase",
                  }}
                >
                  {DEPLOYMENT_FLAVOR}
                </Tag>
              </div>
            )}
          </div>
        </Link>
        <Menu menuItems={menuItems} />
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
    </div>
  );
}

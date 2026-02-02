"use client";

import type { ComponentProps } from "react";

import content from "@/src/content";
import { css } from "@/styled-system/css";
import { IconEarn } from "@liquity2/uikit";
import Link from "next/link";
import { AccountButton } from "./AccountButton";
import { Menu } from "./Menu";
import { TopBarLogo } from "@/src/comps/Logo/TopBarLogo";

const menuItems: ComponentProps<typeof Menu>["menuItems"] = [
  [content.menu.buy, "/buy", IconEarn],
];

export function TopBar() {
  return (
    <header
      className={css({
        position: "relative",
        zIndex: 1,
      })}
    >
      <div
        className={css({
          position: "relative",
          zIndex: 1,
          maxWidth: 1440,
          height: "100%",
          margin: "8px auto",
          fontSize: 16,
          fontWeight: 500,
          borderBottom: "1px solid var(--Neutral-100, #353945)",
        })}
      >
        <div className={css({
          width: "80%",
          minWidth: { base: 0, medium: 1200 },
          margin: "0 auto",
        })}
        >
          <div className={css({
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          })}>
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
            <div className={css({ display: { base: "none", medium: "block" } })}>
              <Menu menuItems={menuItems} />
            </div>
            <div
              className={css({
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                width: { base: "100%", medium: 140 },
              })}
            >
              <AccountButton />
            </div>
          </div>
        </div>
        <div
          className={css({
            display: { base: "block", medium: "none" },
            width: "80%",
            margin: "8px auto 0 auto",
          })}
        >
          <Menu menuItems={menuItems} />
        </div>
      </div>
    </header>
  );
}

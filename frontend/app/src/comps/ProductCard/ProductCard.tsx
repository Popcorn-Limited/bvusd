import type { ReactNode } from "react";

import { css, cx } from "@/styled-system/css";
import { IconArrowRight } from "@liquity2/uikit";
import { a, useSpring } from "@react-spring/web";
import Link from "next/link";
import { useState } from "react";
import { ProductCardGroup } from "./ProductCardGroup";

export function ProductCard({
  path,
  headerTitle,
  headerChildren,
  headerDirection = "row",
  children,
  hint,
  borderOverride,
}: {
  path: string;
  headerTitle: ReactNode;
  headerChildren?: ReactNode;
  headerDirection?: "row" | "column";
  children?: ReactNode;
  hint?: ReactNode;
  borderOverride?: "green";
}) {
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  const hoverSpring = useSpring({
    progress: hovered ? 1 : 0,
    transform: active
      ? "scale(1)"
      : hovered
        ? "scale(1.01)"
        : "scale(1)",
    boxShadow: hovered && !active
      ? "0 2px 4px rgba(0, 0, 0, 0.1)"
      : "0 2px 4px rgba(0, 0, 0, 0)",
    immediate: active,
    config: {
      mass: 1,
      tension: 1800,
      friction: 80,
    },
  });

  return (
    <Link
      href={path}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      onBlur={() => setActive(false)}
      className={cx(
        "group",
        css({
          outline: "none",
        }),
      )}
    >
      <a.section
        className={css({
          display: "flex",
          flexDirection: "column",
          padding: 16,
          background: "token(colors.infoSurface)",
          border: borderOverride === "green" ? "1px solid token(colors.green)" : "1px solid token(colors.neutral100)",
          borderRadius: 8,
          _groupHover: {
            position: "relative",
            zIndex: 2,
            background: "token(colors.infoSurface)",
          },
        })}
        style={{
          ...hoverSpring,
        }}
      >
        <div
          className={css({
            display: "flex",
            alignItems: "center",
            gap: 16,
            paddingBottom: 8,
            borderBottom: "1px solid token(colors.neutral100)"
          })}
        >
          <div
            className={css({
              flexGrow: 1,
              display: "flex",
              flexDirection: headerDirection,
              justifyContent: "space-between",
              gap: 8
            })}
          >
            {headerTitle}
            {headerChildren}
          </div>
        </div>
        <div
          className={css({
            paddingTop: 8,
          })}
        >
          {children}
        </div>
        {hint && (
          <a.div
            className={css({
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "accent",
            })}
            style={{
              height: hoverSpring.progress.to((v) => v * 40),
              opacity: hoverSpring.progress.to([0, 0.8, 1], [0, 0, 1]),
            }}
          >
            <a.div
              style={{
                translateX: hoverSpring.progress.to((v) => `${(1 - v) * 40}px`),
              }}
            >
              {hint}
            </a.div>
            <a.div
              style={{
                translateX: hoverSpring.progress.to((v) => `${(1 - v) * -40}px`),
              }}
            >
              <IconArrowRight />
            </a.div>
          </a.div>
        )}
      </a.section>
    </Link >
  );
}

export function ProductCardInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
      })}
    >
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          height: 24,
          fontSize: 14,
          color: "contentAlt",
        })}
      >
        {label}
      </div>
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          height: 24,
          fontSize: 20,
          color: "interactive",
          letterSpacing: "-0.02em",
        })}
      >
        {value}
      </div>
    </div>
  );
}

export function ProductCardTitle({ title, subtitle, icon }: { title: ReactNode, subtitle: ReactNode, icon: ReactNode }) {
  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "row",
      })}
    >
      <div
        className={css({
          flexGrow: 0,
          flexShrink: 0,
          display: "flex",
          margin: "2px 8px 0 0"
        })}
      >
        {icon}
      </div>
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
        })}
      >
        <p
          className={css({
            fontWeight: 600,
            fontSize: 20
          })}
        >
          {title}
        </p>
        <p
          className={css({
            fontSize: 14,
            color: "contentAlt"
          })}
        >
          {subtitle}
        </p>
      </div>
    </div>
  )
}

ProductCard.Group = ProductCardGroup;
ProductCard.Info = ProductCardInfo;
ProductCard.Title = ProductCardTitle

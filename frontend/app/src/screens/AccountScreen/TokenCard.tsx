"use client";

import { css } from "@/styled-system/css";
import Link from "next/link";


export function TokenCard({
  token,
  link,
  subValues
}: {
  token: string,
  link?: { label: string, href: string },
  subValues: { label: string, value: string }[]
}) {
  return (
    <div className={css({
      background: "fieldSurface",
      border: "1px solid token(colors.neutral100)",
      borderRadius: 8,
      padding: 16,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    })}>
      <div className={css({
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "baseline",
        paddingBottom: 12,
      })}>
        <h1
          className={css({
            fontSize: 24,
            color: "content",
          })}>
          {token}
        </h1>
        {link &&
          <Link
            href={link.href}
            className={css({
              color: "accent",
              textDecoration: "none",
              _hover: {
                color: "goldLight",
              },
            })}>
            {link.label}
          </Link>
        }
      </div>
      <div className={css({
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
      })}>
        {subValues.map((subValue, i) => (
          <SubValue key={subValue.label} label={subValue.label} value={subValue.value} index={i} />
        ))}
      </div>
    </div>
  )
}

export function SubValue({ label, value, index }: { label: string, value: string, index: number }) {
  return (
    <div
      className={css({
        lineHeight: 1.2,
      })}
    >
      <p
        className={css({
          fontSize: 16,
          color: "contentAlt",
          justifySelf: index === 0 ? "start" : "end",
        })}
      >
        {label}
      </p>
      <p
        className={css({
          fontSize: 28,
          justifySelf: index === 0 ? "start" : "end",
        })}
      >
        {value}
      </p>
    </div>
  )
}
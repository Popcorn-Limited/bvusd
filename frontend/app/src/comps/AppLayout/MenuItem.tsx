import type { ReactNode } from "react";

import { css } from "@/styled-system/css";
import { token } from "@/styled-system/tokens";

export function MenuItem({
  icon,
  label,
  selected,
}: {
  icon?: ReactNode;
  label: ReactNode;
  selected?: boolean;
}) {
  return (
    <div
      aria-selected={selected}
      className={css({
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        height: "100%",
        color: "content",
        cursor: "pointer",
        userSelect: "none",
        overflow: "hidden",
        textOverflow: "ellipsis",
      })}
      style={{
        color: token(`colors.${selected ? "selected" : "interactive"}`),
        textDecoration: selected ? `underline ${token("colors.selected")}` : "none",
        textUnderlineOffset: 4
      }}
    >
      {icon &&
        <div
          className={css({
            display: "grid",
            placeItems: "center",
            width: 24,
            height: 24,
          })}
        >
          {icon}
        </div>
      }
      <div
        className={css({
          flexShrink: 1,
          flexGrow: 1,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          height: "100%",
        })}
      >
        <div
          className={css({
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            _hover: {
              color: selected ? "accent" : "gray100",
            },
          })}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

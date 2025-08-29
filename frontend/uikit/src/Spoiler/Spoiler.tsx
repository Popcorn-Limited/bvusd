import { css } from "../../styled-system/css";
import { IconChevronDown, IconChevronUp } from "../icons";
import { useState, type ReactNode } from "react";

export function Spoiler({ title, marginBottom = 16, children }: { title: string, marginBottom?: number, children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className={css({
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: "pointer",
        marginBottom: marginBottom,
      })}
        onClick={() => setOpen(!open)}
      >
        <p>{title}</p>
        {open ? <IconChevronUp /> : <IconChevronDown />}
      </div>
      {open &&
        <div className={css({
          display: "flex",
          flexDirection: "column",
          gap: 16,
        })}>
          {children}
        </div>
      }
    </div>
  );
}
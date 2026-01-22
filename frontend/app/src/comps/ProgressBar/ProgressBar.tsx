"use client";

import { css } from "@/styled-system/css";
import { a, useSpring } from "@react-spring/web";

export function ProgressBar({
  value,
  max = 100,
  height = 8,
}: {
  value: number;
  max?: number;
  height?: number;
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const progressSpring = useSpring({
    from: { width: 0 },
    to: { width: percentage },
    config: {
      mass: 1,
      tension: 200,
      friction: 30,
    },
  });

  return (
    <div
      className={css({
        width: "100%",
        height,
        background: "token(colors.controlSurface)",
        borderRadius: 4,
        overflow: "hidden",
        position: "relative",
      })}
    >
      <a.div
        className={css({
          height: "100%",
          background: "token(colors.positive)",
          borderRadius: 4,
        })}
        style={{
          width: progressSpring.width.to((w) => `${w}%`),
        }}
      />
    </div>
  );
}

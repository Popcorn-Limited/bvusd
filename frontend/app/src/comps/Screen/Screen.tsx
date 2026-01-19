import type { ReactNode } from "react";

import { css, cx } from "@/styled-system/css";
import { IconArrowBack } from "@liquity2/uikit";
import { a, useSpring, useTransition } from "@react-spring/web";
import Link from "next/link";
import { isValidElement } from "react";

export function Screen({
  back,
  children,
  className,
  gap = 4,
  heading = null,
  paddingTop = 0,
  ready = true,
}: {
  back?: {
    href: string;
    label: ReactNode;
  } | null;
  children: ReactNode;
  className?: string;
  gap?: number;
  heading?: ReactNode | {
    title: ReactNode;
    subtitle?: ReactNode;
  };
  ready?: boolean;
  width?: number;
  paddingTop?: number;
}) {
  const backTransition = useTransition(ready && back, {
    keys: (back) => JSON.stringify(back),
    initial: { opacity: 0, transform: "translateY(0px)" },
    from: { opacity: 0, transform: "translateY(16px)" },
    enter: { opacity: 1, transform: "translateY(0px)" },
    leave: { opacity: 0, transform: "translateY(0px)", immediate: true },
    config: {
      mass: 1,
      tension: 1800,
      friction: 100,
    },
  });

  const headingSpring = useSpring({
    from: {
      opacity: 0,
      transform: `
        scale3d(0.95, 0.95, 1)
        translate(0, 12px)
      `,
    },
    to: {
      opacity: 1,
      transform: `
        scale3d(1, 1, 1)
        translate(0, 0px)
      `,
    },
    config: {
      mass: 1,
      tension: 2200,
      friction: 120,
    },
  });

  const screenSpring = useSpring({
    from: {
      opacity: 0,
      transform: `
        scale3d(0.95, 0.95, 1)
        translate3d(0, 20px, 0)
      `,
    },
    to: {
      opacity: 1,
      transform: `
        scale3d(1, 1, 1)
        translate3d(0, 0px, 0)
      `,
    },
    delay: 100,
    config: {
      mass: 1,
      tension: 2200,
      friction: 120,
    },
  });

  const headingElt = typeof heading === "object"
    && heading !== null
    && "title" in heading
    && !isValidElement(heading)
    ? (
      <header
        className={css({
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          paddingBottom: 8,
        })}
      >
        <h1
          className={css({
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
          })}
        >
          {heading.title}
        </h1>
        {heading.subtitle && (
          <div
            className={css({
              maxWidth: 540,
              textAlign: "center",
              color: "contentAlt",
            })}
          >
            {heading.subtitle}
          </div>
        )}
      </header>
    )
    : (
      <div style={{ width: "100%" }}>
        {/* @ts-ignore */}
        {heading}
      </div>
    );

  return (
    <div
      className={cx(
        css({
          position: "relative",
          flexGrow: 1,
          display: "flex",
          gap: 4,
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          padding: 24,
          transformOrigin: "50% 0",
        }),
        className,
      )}
      style={{
        paddingTop,
      }}
    >
      {backTransition((style, back) => (
        back && (
          <a.div
            className={css({
              width: {
                base: "100%",
                large: "100%",
              },
              maxWidth: {
                base: 540,
                large: "100%",
              },
              zIndex: 1,
              alignItems: "start",
              padding: "12px 0"
            })}
            style={{
              transform: style.transform,
              opacity: style.opacity.to([0, 0.5, 1], [0, 1, 1]),
            }}
          >
            <BackButton
              href={back.href}
              label={back.label}
            />
          </a.div>
        )
      ))}
      {headingElt && (
        <a.div
          className={css({
            display: "flex",
            flexDirection: "column",
            width: "100%",
            alignItems: "center",
          })}
          style={headingSpring}
        >
          {headingElt}
        </a.div>
      )}
      <a.div
        className={css({
          display: "flex",
          flexDirection: "column",
          position: "relative",
          transformOrigin: "50% 0",
          willChange: "transform, opacity",
        })}
        style={{
          gap,
          width: "100%",
          ...screenSpring,
        }}
      >
        {children}
      </a.div>
    </div>
  );
}

export function BackButton({
  href,
  label,
}: {
  href: string;
  label: ReactNode;
}) {
  return (
    <Link href={href} passHref legacyBehavior>
      <a
        className={css({
          display: "flex",
          gap: 8,
          color: "positionContent",
          width: "fit-content",
          whiteSpace: "nowrap",
        })}
      >
        <div className={css({ margin: "1px 0 0 0" })}>
          <IconArrowBack size={20} />
        </div>
        {label}
      </a>
    </Link>
  );
}

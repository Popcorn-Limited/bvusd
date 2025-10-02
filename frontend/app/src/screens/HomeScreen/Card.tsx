import Image from "next/image";
import { useState } from "react";

type CTA = {
  label: string;
  onClick: () => void;
  textColor?: string;
  textHoverColor?: string;
  buttonColor?: string;
  hoverColor?: string;
  borderColor?: string;
  borderHoverColor?: string;
}

type Props = {
  tokenImage: string;
  backgroundColor: string;
  textColor: string;
  imageUrl: string;
  badgeText: string;
  apy?: string;
  headline: string;
  subhead?: string;
  bullets: string[];
  cta: CTA;
  cta2?: CTA;
};

export function Card(props: Props) {
  const {
    tokenImage,
    backgroundColor,
    textColor,
    imageUrl,
    badgeText,
    apy,
    headline,
    subhead,
    bullets,
    cta,
    cta2,
  } = props;

  // constants for alignment
  const INTRO_HEIGHT = "var(--intro-h)";
  const APY_HEIGHT = "var(--apy-h)";

  return (
    <div
      style={{
        height: "100%",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        padding: 20,
        background: backgroundColor,
        color: textColor,
        border: "1px solid #1f2833",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow:
          "0px 12px 30px rgba(0,0,0,0.35), 0px 2px 6px rgba(0,0,0,0.25)",
        boxSizing: "border-box",
      }}
    >
      {/* INTRO block with fixed height */}
      <div
        style={{
          height: INTRO_HEIGHT,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          gap: "10px",
        }}
      >
        {/* Banner */}
        <div
          style={{
            width: "100%",
            aspectRatio: "16 / 5",
            borderRadius: 8,
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Badge row */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Image
            src={tokenImage}
            alt={badgeText}
            style={{
              width: "35px",
              height: "35px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          <span
            style={{
              fontSize: "clamp(18px, 2.2vh, 25px)",
              fontWeight: 400,
            }}
          >
            {badgeText}
          </span>
        </div>

        {/* APY row */}
        <div
          style={{
            height: APY_HEIGHT,
            display: "flex",
            alignItems: "baseline",
            gap: 8,
          }}
        >
          {apy ? (
            <>
              <div
                style={{
                  fontSize: "clamp(24px, 3.2vh, 40px)",
                  fontWeight: 600,
                  letterSpacing: -0.5,
                }}
              >
                {apy}
              </div>
              <div
                style={{
                  fontSize: "clamp(12px, 1.6vh, 18px)",
                  fontWeight: 600,
                }}
              >
                APY
              </div>
            </>
          ) : null}
        </div>

        {/* Headline + subhead */}
        <div style={{ textAlign: "left" }}>
          <div
            style={{
              fontSize: "clamp(20px, 2.8vh, 25px)",
              fontWeight: 400,
            }}
          >
            {headline}
          </div>
          {subhead && (
            <div
              style={{
                fontSize: "clamp(14px, 2.2vh, 20px)",
                fontWeight: 400,
                color: "black",
              }}
            >
              {subhead}
            </div>
          )}
        </div>

        {/* Divider */}
        <div
          style={{
            flex: "0 0 2px",
            height: 2,
            background: "linear-gradient(90deg,gray,transparent)",
            marginTop: "auto",
          }}
        />
      </div>

      {/* Checklist */}
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          marginTop: 30,
          display: "flex",
          flexDirection: "column",
          gap: "clamp(6px, 1.2vh, 10px)",
          fontSize: "clamp(13px, 2vh, 18px)",
          fontWeight: 400,
          minHeight: 0,
        }}
      >
        {bullets.map((b, i) => (
          <li
            key={i}
            style={{
              textAlign: "left",
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
            <span
              aria-hidden
              style={{
                width: 18,
                height: 18,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 4,
                fontSize: 18,
              }}
            >
              ✓
            </span>
            <span>{b}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: "50px",
          display: "flex",
          flexDirection: "row",
          gap: 10,
        }}
      >
        {cta &&
          <CTAButton {...cta} />
        }
        {cta && cta2 &&
          <CTAButton {...cta2} />
        }
      </div>
    </div>
  );
}


function CTAButton(cta: CTA) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        height: 48,
        width: "100%",
        padding: "0 14px",
        fontSize: 16,
        borderRadius: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        whiteSpace: "nowrap",
        textDecoration: "none",
        cursor: "pointer",
        transition: "background 50ms, color 50ms, border 50ms",
        color: isHovered ? cta.textHoverColor : cta.textColor,
        background: isHovered ? cta.hoverColor : cta.buttonColor,
        border: isHovered ? `2px solid ${cta.borderHoverColor ?? cta.hoverColor}` : `2px solid ${cta.borderColor ?? cta.buttonColor}`
      }}
      onClick={cta.onClick}
    >
      {cta.label}
    </button>

  )
}
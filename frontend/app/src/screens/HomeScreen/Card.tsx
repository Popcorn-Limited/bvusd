import Image from "next/image";
import { Button } from "@liquity2/uikit";

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
  ctaText: string;
  onCta: () => void;
};

export function Card({
  tokenImage,
  backgroundColor,
  textColor,
  imageUrl,
  badgeText,
  apy,
  headline,
  subhead,
  bullets,
  ctaText,
  onCta,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "30px",
        background: backgroundColor,
        color: textColor,
        border: "1px solid #1f2833",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow:
          "0px 12px 30px rgba(0,0,0,0.35), 0px 2px 6px rgba(0,0,0,0.25)",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
      }}
    >
      {/* Top content */}
      <div>
        {/* Image */}
        <div
          style={{
            width: "100%",
            borderRadius: 5,
            height: 170,
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Badge / title row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            margin: "20px 0 16px",
          }}
        >
          <Image
            src={tokenImage}
            alt={badgeText}
            width={50}
            height={40}
            style={{ borderRadius: "50%" }}
          />
          <span style={{ fontSize: 25, color: textColor, fontWeight: 400 }}>
            {badgeText}
          </span>
        </div>

        {/* Optional APY */}
        {apy && (
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <div
              style={{
                fontSize: 40,
                fontWeight: 600,
                color: textColor,
                letterSpacing: -0.5,
              }}
            >
              {apy}
            </div>
            <div style={{ fontSize: 18, color: "white", fontWeight: 600 }}>
              APY
            </div>
          </div>
        )}

        {!apy && <div style={{ marginTop: 100 }} />}
        {/* Headline + subhead */}
        <div style={{ marginTop: 30 }}>
          <div style={{ fontSize: 30, fontWeight: 400, color: textColor }}>
            {headline}
          </div>
          {subhead && (
            <div
              style={{
                fontSize: 25,
                fontWeight: 300,
                color: "gray",
              }}
            >
              {subhead}
            </div>
          )}
          {!subhead && (
            <div
              style={{
                marginTop: 73,
              }}
            />
          )}
        </div>
        {/* Divider */}
        <div
          style={{
            height: 2,
            background: `linear-gradient(90deg,gray,transparent)`,
            marginTop: 31,
            marginBottom: 15,
          }}
        />

        {/* Checklist */}
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            marginTop: 20,
            marginBottom: 20,
          }}
        >
          {bullets.map((b, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                gap: 20,
                alignItems: "flex-start",
                marginBottom: 10,
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
                  marginTop: 6,
                  fontSize: 18,
                  color: textColor,
                }}
              >
                ✓
              </span>
              <span style={{ fontSize: 19, color: textColor }}>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Button */}
      <div style={{ marginTop: "auto", paddingTop: 40 }}>
        <Button
          mode="primary"
          shape="rounded"
          wide
          label={ctaText}
          onClick={onCta}
        />
      </div>
    </div>
  );
}

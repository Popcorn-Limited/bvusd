"use client";

import type { ReactNode } from "react";

import { Amount } from "@/src/comps/Amount/Amount";
import { Logo } from "@/src/comps/Logo/Logo";
import { useLiquityStats } from "@/src/liquity-utils";
import { css } from "@/styled-system/css";
import { HFlex, TextButton } from "@liquity2/uikit";
import Link from "next/link";
import { TopBarLogo } from "@/src/comps/Logo/TopBarLogo";

type FooterLinkSection = {
  title: string;
  links: { label: string; href: string }[];
};

const FOOTER_LINKS: FooterLinkSection[] = [
  {
    title: "Links",
    links: [
      { label: "Docs", href: "https://docs.bitvault.finance" },
      { label: "Media Kit", href: "https://docs.bitvault.finance/brand" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "https://docs.bitvault.finance/legal/terms" },
      { label: "Privacy Policy", href: "https://docs.bitvault.finance/legal/privacy" },
      { label: "Risk Disclosure", href: "https://docs.bitvault.finance/legal/risk" },
      { label: "Legal Notice", href: "https://docs.bitvault.finance/legal" },
    ],
  },
];

const SOCIAL_LINKS: { label: string; href: string; icon: ReactNode }[] = [
  { label: "X (Twitter)", href: "https://twitter.com/biaborvault", icon: <XIcon /> },
  { label: "Telegram", href: "https://t.me/bitvaultann", icon: <TelegramIcon /> },
];

export function BottomBar() {
  const liquityStats = useLiquityStats();
  const btcTvl = liquityStats.data?.btcTVL ? Number(liquityStats.data.btcTVL) : undefined;

  return (
    <footer
      className={css({
        width: "100%",
      })}
    >
      <div
        className={css({
          padding: "16px 0",
          margin: "48px auto",
          fontSize: 14,
          borderTop: "1px solid var(--Neutral-100, #353945)",
          borderBottom: "1px solid var(--Neutral-100, #353945)",
        })}
      >
        <HFlex gap={8} alignItems="center">
          <Logo size={18} />
          <span className={css({ color: "content", fontWeight: 600 })}>Bitcoin TVL</span>
          <Amount prefix="$" fallback="…" format="compact" value={btcTvl} />
        </HFlex>
      </div>

      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: 24,
          paddingTop: 24,
          minWidth: { base: 0, medium: 1200 },
          width: "80%",
          margin: "0 auto",
        })}
      >
        <div
          className={css({
            display: "flex",
            flexDirection: { base: "column", medium: "row" },
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 32,
            flexWrap: "wrap",
          })}
        >
          <div
            className={css({
              display: "flex",
              flexDirection: "column",
              gap: 16,
            })}
          >
            <TopBarLogo />
            <div className={css({ display: "flex", gap: 12 })}>
              {SOCIAL_LINKS.map((social) => (
                <SocialLink key={social.href} {...social} />
              ))}
            </div>
          </div>

          <div
            className={css({
              display: "flex",
              gap: 48,
              flexWrap: "wrap",
            })}
          >
            {FOOTER_LINKS.map((section) => (
              <div key={section.title}>
                <div
                  className={css({
                    fontSize: 12,
                    color: "#71717a",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    marginBottom: 12,
                  })}
                >
                  {section.title}
                </div>
                <div className={css({ display: "flex", flexDirection: "column", gap: 8 })}>
                  {section.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className={css({
                        color: "#a1a1aa",
                        fontSize: 14,
                        textDecoration: "none",
                        transition: "color 0.15s",
                        _hover: { color: "#f39c12" },
                      })}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <TextButton
            label={
              <HFlex gap={6} alignItems="center">
                <span>Back to Top</span>
                <ArrowUpIcon />
              </HFlex>
            }
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={css({
              color: "#71717a",
              fontSize: 14,
              padding: 0,
              transition: "color 0.15s",
              _hover: { color: "#f39c12" },
              _focusVisible: { outline: "2px solid token(colors.focused)" },
            })}
          />
        </div>


      </div>
      <div
        className={css({
          borderTop: "1px solid var(--Neutral-100, #353945)",
          paddingTop: 24,
          marginTop: 40,
          color: "#71717a",
          fontSize: 12,
          lineHeight: 1.7,
        })}
      >
        <div className={css({ marginBottom: 16, width: "80%", minWidth: { base: 0, medium: 1200 }, margin: "0 auto" })}>
          <p >
            <strong className={css({ color: "#a1a1aa" })}>Important Notice:</strong> This product is
            intended for sophisticated and professional investors only. This does not constitute
            investment, financial, legal, or tax advice. Past performance is not indicative of
            future results. Capital at risk — you may lose some or all of your investment. Your
            investment is not protected by any government deposit insurance scheme. Not available to
            U.S. persons or residents of restricted jurisdictions. BV Labs Ltd. is incorporated in
            the British Virgin Islands.
          </p>
          <p>© 2026 BV Labs Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, label, icon }: { href: string; label: string; icon: ReactNode }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className={css({
        width: 36,
        height: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        border: "1px solid #353945",
        color: "#71717a",
        transition: "all 0.15s",
        _hover: { color: "#f39c12", borderColor: "#f39c12" },
        _focusVisible: { outline: "2px solid token(colors.focused)" },
      })}
    >
      {icon}
    </Link>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M18 15l-6-6-6 6" />
    </svg>
  );
}

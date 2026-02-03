"use client";

import { css } from "@/styled-system/css";
import { Button, InfoTooltip } from "@liquity2/uikit";
import { Tag } from "@/src/comps/Tag/Tag";
import { ProgressBar } from "@/src/comps/ProgressBar/ProgressBar";
import { useAccount } from "@/src/wagmi-utils";
import { useState } from "react";

const mockStats = {
  refereeCount: 8,
};

export function ShareAndEarn() {
  const account = useAccount();
  const [copied, setCopied] = useState(false);

  const referralUrl = account.address
    ? `https://app.bitvault.finance/?ref=${account.address}`
    : "Connect wallet to get your referral link";

  const handleCopy = async () => {
    if (!account.address) return;
    await navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareX = () => {
    if (!account.address) return;
    const text = encodeURIComponent(
      `Earn BTC yield with BitVault! Use my referral link: ${referralUrl}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const handleShareTelegram = () => {
    if (!account.address) return;
    const text = encodeURIComponent(
      `Earn BTC yield with BitVault! Use my referral link: ${referralUrl}`
    );
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralUrl)}&text=${text}`, "_blank");
  };

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: 16,
        padding: 24,
        background: "token(colors.infoSurface)",
        borderRadius: 12,
        border: "1px solid token(colors.neutral100)",
      })}
    >
      <div
        className={css({
          display: "flex",
          flexDirection: { base: "column", medium: "row" },
          justifyContent: "space-between",
          alignItems: { base: "flex-start", medium: "center" },
          gap: 8,
        })}
      >
        <div>
          <h3
            className={css({
              fontSize: 18,
              fontWeight: 600,
              marginBottom: 4,
            })}
          >
            Share & Earn
          </h3>
          <p
            className={css({
              fontSize: 14,
              color: "contentAlt",
            })}
          >
            Invite friends and earn 10% of their points
          </p>
        </div>
        <div
          className={css({
            display: "flex",
            alignItems: "center",
            gap: 8,
          })}
        >
          <Tag
            size="medium"
            css={{
              background: "color-mix(in srgb, token(colors.positive) 20%, transparent)",
              color: "token(colors.positive)",
              border: "none",
            }}
          >
            {mockStats.refereeCount} Referrals
          </Tag>
          <InfoTooltip heading="How it works">
            Share your referral link with friends. When they deposit, you earn 10% of their points as referral bonus.
          </InfoTooltip>
        </div>
      </div>

      <div
        className={css({
          display: "flex",
          flexDirection: { base: "column", medium: "row" },
          gap: 8,
        })}
      >
        <div
          className={css({
            flex: 1,
            display: "flex",
            alignItems: "center",
            padding: "12px 16px",
            background: "token(colors.controlSurface)",
            borderRadius: 8,
            border: "1px solid token(colors.fieldBorder)",
            fontSize: 14,
            color: account.address ? "content" : "contentAlt",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          })}
        >
          {referralUrl}
        </div>
        <Button
          label={copied ? "Copied!" : "Copy"}
          mode="primary"
          size="small"
          onClick={handleCopy}
          disabled={!account.address}
        />
      </div>

      <div
        className={css({
          display: "flex",
          gap: 8,
        })}
      >
        <Button
          label="Share on X"
          mode="primary"
          size="small"
          onClick={handleShareX}
          disabled={!account.address}
        />
        <Button
          label="Share on Telegram"
          mode="primary"
          size="small"
          onClick={handleShareTelegram}
          disabled={!account.address}
        />
      </div>

      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: 8,
        })}
      >
        <div
          className={css({
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            color: "contentAlt",
          })}
        >
          <span>Today's Progress</span>
          <span>266 / 500 points</span>
        </div>
        <ProgressBar value={266} max={500} height={8} />
      </div>
    </div>
  );
}

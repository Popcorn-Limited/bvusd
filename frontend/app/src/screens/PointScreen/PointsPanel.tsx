"use client"

import { useAccount } from "@/src/wagmi-utils";
import { Button, IconChevronDown, IconExternal, Spoiler } from "@liquity2/uikit";
import { useEffect, useState } from "react";
import { css } from "@/styled-system/css";
import { zeroAddress } from "viem";
import { useRouter } from "next/navigation";
import { fmtnum } from "@/src/formatting";

const POINTS_CAMPAIGNS: { title: string, reward: number, actionLink: string, claimLink: string, id: string }[] = [
  {
    title: "Hold bvUSD on Katana",
    reward: 10,
    actionLink: "https://app.bitvault.finance/buy",
    claimLink: "https://app.merkl.xyz/opportunities/katana/ERC20_FIX_APR/0x876aac7648D79f87245E73316eB2D100e75F3Df1",
    id: "0xf65a88715f3b07ef4a913b1bce62bf0608880b8932ba046482395b7975e6ea21"
  },
  {
    title: "Hold sbvUSD on Katana",
    reward: 20,
    actionLink: "https://app.bitvault.finance/earn",
    claimLink: "https://app.merkl.xyz/opportunities/katana/ERC20_FIX_APR/0x24E2aE2f4c59b8b7a03772142d439fDF13AAF15b",
    id: "0x2ebd974c00cd63a39f4a4a2fdb240c18d2ff99214afa530ed03bc502af47469d"
  }
]

async function getPoints(account: string, id: string) {
  const response = await fetch(`https://api.merkl.xyz/v4/rewards?chainId=747474&campaignId=${id}`);
  const data = await response.json();
  const entry = data.find((entry) => entry.recipient === account);
  if (entry) {
    return {
      points: (Number(entry.amount) + Number(entry.pending)) / 1e18,
      claimable: (Number(entry.amount) - Number(entry.claimed)) / 1e18
    }
  }
  return {
    points: 0,
    claimable: 0
  }
}

async function getCampaignPoints(account: string) {
  const points = await Promise.all(POINTS_CAMPAIGNS.map((campaign) => getPoints(account, campaign.id)));
  return points;
}

export default function PointsPanel({ showHeader = true }: { showHeader?: boolean }) {
  const account = useAccount();
  const [points, setPoints] = useState<{ points: number, claimable: number }[]>([]);

  useEffect(() => {
    getCampaignPoints(account.address ?? zeroAddress).then((points) => {
      setPoints(points);
    });
  }, [account.address]);

  return (
    <div>
      {showHeader &&
        <div className={css({
          padding: "24px 0 24px 0",
          borderBottom: "1px solid token(colors.fieldBorder)",
          borderTop: "1px solid token(colors.fieldBorder)",
        })}>
          <h2
            className={css({
              fontSize: 40,
            })}>
            Bits Program
          </h2>
          <p
            className={css({
              fontSize: 16,
              color: "contentAlt",
            })}
          >
            Earn Bits by contributing to BitVault’s ecosystem-whether minting bvUSD, staking for sbvUSD, or adding liquidity. The Bits Program rewards users for actions that strengthen protocol utility and growth, with evolving incentives across future seasons.
          </p>
        </div>
      }
      <div className={css({
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: showHeader ? "24px" : "-16px",
        paddingBottom: "24px",
        borderBottom: "1px solid token(colors.fieldBorder)",
      })}>
        <div>
          <h3
            className={css({
              fontSize: 16,
            })}
          >
            Your Points
          </h3>
          <p
            className={css({
              fontSize: 56,
            })}
          >
            {fmtnum(points.reduce((acc, point) => acc + point.points, 0))}
          </p>
        </div>
        <div>
          <h3
            className={css({
              fontSize: 16,
            })}
          >
            Claimable Points
          </h3>
          <p
            className={css({
              fontSize: 56,
            })}
          >
            {fmtnum(points.reduce((acc, point) => acc + point.claimable, 0))}
          </p>
        </div>
      </div>
      <div>
        <div className={css({
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 16,
          fontWeight: 300,
          padding: "16px 0 16px 0",
        })}
        >
          <p>Activities</p>
          <p>Daily Bits per 1$</p>
        </div>
        <Spoiler title="Season 0">
          {POINTS_CAMPAIGNS.map((campaign) => (
            <RewardRow key={campaign.title} {...campaign} />
          ))}
        </Spoiler>
      </div>
    </div >
  )
}


function RewardRow({ title, reward, actionLink, claimLink }: { title: string, reward: number, actionLink: string, claimLink: string }) {
  const router = useRouter();

  return (
    <div
      className={css({
        position: "relative",
        zIndex: 2,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        width: "100%",
        background: `fieldSurface`,
        border: "1px solid token(colors.fieldBorder)",
        borderRadius: 8,
        padding: 16,
      })}
    >
      <div className={css({
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
      })}>
        <div className={css({
          display: "flex",
          alignItems: "center",
          gap: 16,
          border: "1px solid token(colors.fieldBorder)",
          borderRadius: 8,
          padding: 8
        })}>
          <img src={`/icons/flame.png`} alt="flame" />
        </div>
        <div>
          <span className={css({
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
          })}>
            <p className={css({
              fontSize: 20,
              fontWeight: 400,
            })}
            >
              {title}
            </p>
            <div className={css({
              cursor: "pointer"
            })}
              onClick={() => router.push(actionLink)}
            >
              <IconExternal size={16} />
            </div>
          </span>
          <p className={css({
            fontSize: 16,
            fontWeight: 300,
            letterSpacing: 0.01,
            color: "accent",
          })}>{reward} Bits</p>
        </div>
      </div>
      <Button
        label="Claim"
        mode="primary"
        size="medium"
        shape="rectangular"
        onClick={() => router.push(claimLink)}
      />
    </div>
  )
}

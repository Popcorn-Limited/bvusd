"use client";

import { css } from "@/styled-system/css";
import { Tag } from "@/src/comps/Tag/Tag";
import { useAccount } from "@/src/wagmi-utils";

const mockLeaderboard = [
  { rank: 1, address: "0x0001...abcd", points: 14872 },
  { rank: 2, address: "0x0002...efgh", points: 14687 },
  { rank: 3, address: "0x0003...ijkl", points: 14411 },
  { rank: 4, address: "0x0004...mnop", points: 12500 },
  { rank: 5, address: "0x0005...qrst", points: 11200 },
];

function formatNumber(num: number): string {
  return num.toLocaleString();
}

function truncateAddress(address: string): string {
  if (address.length <= 13) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function PodiumPlace({
  rank,
  address,
  points,
  height,
}: {
  rank: number;
  address: string;
  points: number;
  height: number;
}) {
  const medalColors: Record<number, string> = {
    1: "#FFD700",
    2: "#C0C0C0",
    3: "#CD7F32",
  };

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      })}
    >
      <div
        className={css({
          width: 40,
          height: 40,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          fontWeight: 700,
        })}
        style={{
          background: medalColors[rank],
          color: rank === 1 ? "#000" : "#fff",
        }}
      >
        {rank}
      </div>
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: 16,
          borderRadius: "8px 8px 0 0",
          width: 120,
        })}
        style={{ height }}
      >
        <span
          className={css({
            fontSize: 12,
            fontFamily: "monospace",
            color: "contentAlt",
            marginBottom: 4,
          })}
        >
          {truncateAddress(address)}
        </span>
        <span
          className={css({
            fontSize: 16,
            fontWeight: 700,
            fontVariantNumeric: "tabular-nums",
          })}
        >
          {formatNumber(points)}
        </span>
        <span
          className={css({
            fontSize: 12,
            color: "contentAlt",
          })}
        >
          pts
        </span>
      </div>
    </div>
  );
}

export function Leaderboard() {
  const account = useAccount();
  const userRank = 42; // Mock user rank

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
          justifyContent: "space-between",
          alignItems: "center",
        })}
      >
        <h3
          className={css({
            fontSize: 18,
            fontWeight: 600,
          })}
        >
          Leaderboard
        </h3>
        {account.address && (
          <Tag
            size="medium"
            css={{
              background: "color-mix(in srgb, token(colors.accent) 20%, transparent)",
              color: "token(colors.accent)",
              border: "none",
            }}
          >
            Your Rank: #{userRank}
          </Tag>
        )}
      </div>

      {/* Podium */}
      <div
        className={css({
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          gap: 16,
          padding: "24px 0",
        })}
      >
        {/* 2nd Place */}
        <PodiumPlace
          rank={2}
          address={mockLeaderboard[1].address}
          points={mockLeaderboard[1].points}
          height={100}
        />
        {/* 1st Place */}
        <PodiumPlace
          rank={1}
          address={mockLeaderboard[0].address}
          points={mockLeaderboard[0].points}
          height={130}
        />
        {/* 3rd Place */}
        <PodiumPlace
          rank={3}
          address={mockLeaderboard[2].address}
          points={mockLeaderboard[2].points}
          height={80}
        />
      </div>

      {/* Rest of leaderboard */}
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: 8,
        })}
      >
        {mockLeaderboard.slice(3).map((entry) => (
          <div
            key={entry.rank}
            className={css({
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
              borderRadius: 8,
              fontSize: 14,
            })}
          >
            <div
              className={css({
                display: "flex",
                alignItems: "center",
                gap: 12,
              })}
            >
              <span
                className={css({
                  width: 24,
                  textAlign: "center",
                  fontWeight: 600,
                  color: "contentAlt",
                })}
              >
                {entry.rank}
              </span>
              <span
                className={css({
                  fontFamily: "monospace",
                })}
              >
                {entry.address}
              </span>
            </div>
            <span
              className={css({
                fontWeight: 600,
                fontVariantNumeric: "tabular-nums",
              })}
            >
              {formatNumber(entry.points)} pts
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

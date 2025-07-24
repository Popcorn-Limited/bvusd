import React, { useEffect, useState } from "react";

import { Button, HFlex, LoadingSurface, TextButton } from "@liquity2/uikit";
import { useDiffs } from "@/src/liquity-utils";
import { StatsScreenCard } from "@/src/comps/Screen/StatsScreenCard";
import { match } from "ts-pattern";
import { css } from "@/styled-system/css";

const STORAGE_KEY = "acknowledgedDiffs";

export default function JsonDiffViewer() {
  const diffs = useDiffs();

  const loadingState =
    diffs.isLoading || diffs.status === "pending"
      ? "loading"
      : diffs.status === "error"
      ? "error"
      : "success";
  const [acknowledged, setAcknowledged] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setAcknowledged(JSON.parse(stored));
  }, []);

  const acknowledgeKey = (key: string) => {
    const updated = [...acknowledged, key];
    setAcknowledged(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const renderDiff = (obj: any) =>
    Object.entries(obj).flatMap(([dateKey, fields]) =>
      Object.entries(fields).map(([field, value]) => {
        const fullKey = `${dateKey}.${field}`;

        if (acknowledged.includes(fullKey)) return null;

        return (
          <div
            key={fullKey}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              alignItems: "center",
              gap: 16,
              padding: "12px",
              borderBottom: "1px solid #23262F",
              fontSize: 16,
            }}
          >
            {/* Field name (e.g., tvl, collateralRatio) */}
            <div>{field}</div>

            {/* Value diff */}
            <div>
              <span style={{ color: "red" }}>{value[0]}</span> →{" "}
              <span style={{ color: "green" }}>{value[1]}</span>
            </div>

            {/* Date */}
            <div style={{ fontSize: 14, color: "#aaa" }}>
              {new Date(dateKey).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                timeZone: "UTC",
              })}
            </div>

            {/* Acknowledge button */}
            <div>
              <Button
                mode="primary"
                label="Reset"
                size="mini"
                label="Acknowledge"
                onClick={() => acknowledgeKey(fullKey)}
              />
            </div>
          </div>
        );
      })
    );

  return (
    <div
      style={{
        background: "transparent",
        border: "1px solid var(--Neutral-100, #353945)",
        borderRadius: 16,
        padding: 24,
        gap: "100px",
        width: "100%",
        height: "100%",
        userSelect: "text",
      }}
    >
      <StatsScreenCard
        mode={match(loadingState)
          .returnType<"ready" | "loading" | "error">()
          .with("loading", () => "loading")
          .with("error", () => "error")
          .otherwise(() => "ready")}
      >
        {match(loadingState)
          .with("loading", () => (
            <div
              className={css({
                display: "grid",
                placeItems: "center",
                height: "100%",
              })}
            >
              <LoadingSurface />
            </div>
          ))
          .with("error", () => (
            <HFlex gap={8}>
              Error fetching data
              {/* <Button
                      mode="primary"
                      label="Try again"
                      size="mini"
                      onClick={onRetry}
                    /> */}
            </HFlex>
          ))
          .otherwise(() => {
            if (!diffs) {
              <HFlex gap={8}>Invalid Data</HFlex>;
            }
            return (
              <>
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBottom: "20px",
                  }}
                >
                  <h3
                    style={{
                      color: "var(--Primary-White, #FFF)",
                      fontFamily: "KHTeka",
                      fontSize: "24px",
                      fontStyle: "normal",
                      fontWeight: "400",
                      lineHeight: "120%",
                    }}
                  >
                    DIFFS
                  </h3>
                  <Button
                    mode="primary"
                    label="Reset"
                    size="mini"
                    onClick={() => {
                      localStorage.removeItem(STORAGE_KEY);
                      setAcknowledged([]);
                    }}
                  >
                    Reset Acknowledged
                  </Button>
                </div>
                <div
                  style={{
                    border: "1px solid #353945",
                    borderRadius: 16,
                    overflow: "hidden",
                    fontFamily: "KHTeka",
                    color: "#fff",
                  }}
                >
                  {/* Table Header */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr 1fr",
                      alignItems: "center",
                      gap: 16,
                      fontSize: 14,
                      fontWeight: 500,
                      textTransform: "uppercase",
                      padding: "12px",
                      borderBottom: "1px solid #333",
                    }}
                  >
                    <div>Metric</div>
                    <div>Diff</div>
                    <div>Time</div>
                    <div>Acknowledge</div>
                  </div>

                  {/* Scrollable Table Body */}
                  <div
                    style={{
                      maxHeight: 10 * 52,
                      overflowY: "auto",
                    }}
                  >
                    {Object.keys(diffs.data).length > 0 ? (
                      renderDiff(diffs.data)
                    ) : (
                      <p>No unacknowledged changes</p>
                    )}
                  </div>
                </div>
              </>
            );
          })}
      </StatsScreenCard>
    </div>
  );
}

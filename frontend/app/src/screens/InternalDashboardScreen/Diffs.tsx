import React, { useEffect, useState } from "react";

import { Button, HFlex, LoadingSurface, TextButton } from "@liquity2/uikit";
import { useDiffs } from "@/src/liquity-utils";
import { StatsScreenCard } from "@/src/comps/Screen/StatsScreenCard";
import { match } from "ts-pattern";
import { css } from "@/styled-system/css";
import { displayValue } from "./Depth";
import { diffTokenLiquidity } from "@/src/diff-utils";

const STORAGE_KEY = "acknowledgedDiffs";

// 7 days prior to today
const getDefaultMinDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date.toISOString().slice(0, 10);
};

// human readable to timestamp
const toTimestamp = (dateStr: string) : number => {
  const date = new Date(dateStr.replace(" at ", " "));

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date: " + dateStr);
  }

  return date.getTime();
}

export default function JsonDiffViewer() {
  const [minDate, setMinDate] = useState<string>(getDefaultMinDate());

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
    Object.entries(obj)
      .filter(([dateKey]) => !minDate || toTimestamp(dateKey) >= new Date(minDate).getTime())
      .flatMap(([dateKey, fields]) =>
        Object.entries(fields).map(([field, value]) => {
          const fullKey = `${dateKey}.${field}`;

          // filter acknowledged
          if (acknowledged.includes(fullKey)) return null;

          let before: string | number = "";
          let after: string | number = "";

          // pool depth object requires different processing
          if (field === "poolDepth") {
            const [liqBefore, liqAfter] = diffTokenLiquidity(value);
            before = displayValue(liqBefore);
            after = displayValue(liqAfter);
          } else if (
            Array.isArray(value[0]) &&
            typeof value[0][0] === "object"
          ) {
            // other object fields that don't have a processor yet
            return null;
          } else {
            // default
            before = String(value[0]);
            after = String(value[1]);
          }

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
              <div>{field}</div>
              <div>
                <span style={{ color: "red" }}>{before}</span> →{" "}
                <span style={{ color: "green" }}>{after}</span>
              </div>
              <div style={{ fontSize: 14, color: "#aaa" }}>{dateKey}</div>
              <div>
                <Button
                  mode="primary"
                  label="Acknowledge"
                  size="mini"
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
                  <div>
                    <label style={{ marginRight: 8, color: "#ccc" }}>
                      Since:
                    </label>
                    <input
                      type="date"
                      value={minDate}
                      onChange={(e) => setMinDate(e.target.value)}
                      style={{
                        background: "#111",
                        color: "#fff",
                        padding: "6px 10px",
                        borderRadius: 6,
                        border: "1px solid #333",
                      }}
                    />
                  </div>
                  <Button
                    mode="primary"
                    label="Reset Acknowledged"
                    size="mini"
                    onClick={() => {
                      localStorage.removeItem(STORAGE_KEY);
                      setAcknowledged([]);
                    }}
                  />
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
                      userSelect: "text",
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

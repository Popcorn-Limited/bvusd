"use client";

import { css } from "@/styled-system/css";
import CardsSection from "./CardsSection";

export function HomeScreen() {
  return (
    <div
      className={css({
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        gap: 64,
        width: "100%",
      })}
    >
      <CardsSection />
    </div>
  );
}

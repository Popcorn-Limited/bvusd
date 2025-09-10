import { EnsoForecast } from "../enso-utils";
import type { Token } from "@/src/types";
import { useState, useEffect } from "react";

export default function EnsoPreview({ value, status, outputSymbol }: EnsoForecast & { outputSymbol: Token["symbol"] }): JSX.Element {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    switch(status) {
      case "loading":
        setContent("Loading...");
        break;
      case "success":
        setContent(`Your receive: ${value} ${outputSymbol}`);
        break;
      case "error":
        setContent("Error");
        break;
      case "idle":
        setContent(`Your receive: 0 ${outputSymbol}`);
        break;
      default:
        setContent(`Your receive: 0 ${outputSymbol}`);
        break;
    }
  }, [value, status, outputSymbol]);

  return <p>{content}</p>;
}
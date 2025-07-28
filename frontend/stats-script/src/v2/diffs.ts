import fs, { write } from "fs";
import path from "path";

const OUTPUT_DIR_V2 = "../../docs";

const ignoredKeys = ["spDeposits", "troves"];

function formatDateUTC(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const formatter = new Intl.DateTimeFormat("en-US", options);
  return `${formatter.format(date)} UTC`;
}

export const getDiffs = (previous: any, latest: any) => {
  const diffPath = path.join(OUTPUT_DIR_V2, "diffs.json");

  // Load existing diffs
  const existingDiffs = fs.existsSync(diffPath)
    ? JSON.parse(fs.readFileSync(diffPath, "utf-8"))
    : {};

  // Compute diff
  const diff = {};
  for (const key in latest) {
    const oldVal = previous[key];
    const newVal = latest[key];

    if (
      JSON.stringify(oldVal) !== JSON.stringify(newVal) &&
      !ignoredKeys.includes(key)
    ) {
      diff[key] = [oldVal, newVal];
    }
  }

  // Only write if something changed
  if (Object.keys(diff).length > 0) {
    const today = formatDateUTC(new Date());
    existingDiffs[today] = diff;

    fs.writeFileSync(diffPath, JSON.stringify(existingDiffs, null, 2));
    console.log(`Diff written to diffs.json`);
  } else {
    console.log("No diff detected");
  }
};

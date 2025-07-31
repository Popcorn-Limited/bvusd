import fs, { write } from "fs";
import path from "path";

const OUTPUT_DIR_V2 = "../../docs";

// the entire object is skipped 
const ignoredKeys = ["spDeposits", "troves", "time"];

// otherwise get diffs only on the specified keys of an object
type DiffFieldsMap = Record<string, string[]>;
const diffFieldsMap: DiffFieldsMap = {
  day_supply: ["holders", "supply"],
  collateral_ratio: ["avg_cr"],
}

export function formatDateUTC(date: Date): string {
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

  const diff: Record<string, any> = {};

  for (const key in latest) {
    // Skip entire object if it's in ignoredKeys
    if (ignoredKeys.includes(key)) continue;

    const isFieldMapped = diffFieldsMap.hasOwnProperty(key);
    const subKeys = isFieldMapped ? diffFieldsMap[key] : [];
    
    // handle nested object
    if (isFieldMapped) {
      // only pick first element (most recent)
      const latestSub = latest[key][0] || {};
      const prevSub = previous[key][0] || {};

      for (const subKey of subKeys) {
        const oldVal = prevSub[subKey];
        const newVal = latestSub[subKey];

        if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
          if (!diff[subKey]) diff[subKey] = {};
          diff[subKey] = [oldVal, newVal];
        }
      }
    } else {
      // Handle flat fields
      const oldVal = previous[key];
      const newVal = latest[key];

      if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
        diff[key] = [oldVal, newVal];
      }
    }
  }

  // Only write if something changed
  if (Object.keys(diff).length > 0) {
    const today = formatDateUTC(new Date());
    existingDiffs[today] = diff;
    existingDiffs[today]["prevTime"] = previous.time;

    fs.writeFileSync(diffPath, JSON.stringify(existingDiffs, null, 2));
    console.log(`✅ Diff written to diffs.json`);
  } else {
    console.log("ℹ️ No diff detected");
  }
};


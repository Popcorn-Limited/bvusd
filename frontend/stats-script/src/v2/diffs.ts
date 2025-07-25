import fs, { write } from "fs";
import path from "path";

const OUTPUT_DIR_V2 = "../../docs";

export const getDiffs = () => {
  const diffPath = path.join(OUTPUT_DIR_V2, "diffs.json");
  const latest = JSON.parse(
    fs.readFileSync(path.join(OUTPUT_DIR_V2, "katana.json"), "utf-8")
  );
  const previous = JSON.parse(
    fs.readFileSync(path.join(OUTPUT_DIR_V2, "previous.json"), "utf-8")
  );

  // Load existing diffs (or start empty)
  const existingDiffs = fs.existsSync(diffPath)
    ? JSON.parse(fs.readFileSync(diffPath, "utf-8"))
    : {};

  // Compute field-by-field diff
  const diff = {};
  for (const key in latest) {
    const oldVal = previous[key];
    const newVal = latest[key];

    if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
      diff[key] = [oldVal, newVal];
    }
  }

  // Only write if something changed
  if (Object.keys(diff).length > 0) {
    const today = new Date().toISOString().slice(0, 14); // YYYY-MM-DD
    existingDiffs[today] = diff;

    fs.writeFileSync(diffPath, JSON.stringify(existingDiffs, null, 2));
    console.log(`Diff written to diffs.json`);
  } else {
    console.log("No diff detected");
  }
};

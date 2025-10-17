import fs, { write } from "fs";
import path from "path";
import v2MainnetDeployment from "./deployment.json";
import vaults from "./vaults.json";
import { getProvider } from "./connection";
import { fetchV2Stats } from "./v2/fetchV2Stats";
import { env } from "./env";
import { getDiffs, formatDateUTC } from "./v2/diffs";
import { getAllocations, getTokenAllocations } from "./v2/queries/allocation";
import { getLoansTVL, getTokenPrice } from "./v2/queries/morphoPosition";

interface Tree extends Record<string, string | Tree> {}

const writeTree = (parentDir: string, tree: Tree) => {
  if (!fs.existsSync(parentDir)) fs.mkdirSync(parentDir, { recursive: true });

  for (const [k, v] of Object.entries(tree)) {
    const prefix = path.join(parentDir, k);

    if (typeof v === "string") {
      fs.writeFileSync(`${prefix}.txt`, v);
    } else {
      writeTree(prefix, v);
    }
  }
};

export async function fetchAndUpdateStats() {
  const alchemyApiKey = env.ALCHEMY_KEY;
  const katanaApiKey = env.KATANA_KEY;
  const katanaProvider = getProvider(747474, { alchemyApiKey: katanaApiKey });
  const ethereumProvider = getProvider(1, { alchemyApiKey });

  const [stats] = await Promise.all([
    fetchV2Stats({
      deployment: v2MainnetDeployment,
      vaults,
      provider: katanaProvider,
      ethProvider: ethereumProvider,
      duneKey: env.DUNE_KEY,
    }),
  ]);

  const allocations = await getAllocations(env.DEBANK_KEY);
  const tokenAllocations = await getTokenAllocations(env.DEBANK_KEY);

  // const loans = await getLoansTVL(env.DEBANK_KEY, ethereumProvider);
  const btcTVL =
    (await getTokenPrice(
      env.DEBANK_KEY,
      "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"
    )) * 100;

  const v2Stats = {
    time: formatDateUTC(new Date()),
    ...stats,
    totalAllocations: `${allocations
      .map((r) => Number(r.usdValue))
      .reduce((a, b) => a + b)}`,
    allocations,
    tokenAllocations,
    btcTVL: btcTVL.toString(),
  };

  // local storage
  const OUTPUT_DIR_V2 = "../../docs";

  // writeTree(OUTPUT_DIR_V2, v2Stats); -> prints all txt files as well

  if (!fs.existsSync(OUTPUT_DIR_V2))
    fs.mkdirSync(OUTPUT_DIR_V2, { recursive: true });

  // copy previous stats
  const previous = JSON.parse(
    fs.readFileSync(path.join(OUTPUT_DIR_V2, "katana.json"), "utf-8")
  );

  // write new stats
  fs.writeFileSync(
    path.join(OUTPUT_DIR_V2, "katana.json"),
    JSON.stringify(v2Stats, null, 2)
  );

  // write diffs
  getDiffs(previous, v2Stats);
}

await fetchAndUpdateStats();

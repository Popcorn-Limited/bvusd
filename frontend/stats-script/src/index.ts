import fs, { write } from "fs";
import path from "path";
import v2MainnetDeployment from "./deployment.json";
import vaults from "./vaults.json";
import { getProvider } from "./connection";
import { fetchV2Stats } from "./v2/fetchV2Stats";
import { env } from './env';
import { getDiffs } from "./v2/diffs";

interface Tree extends Record<string, string | Tree> {}
  
const writeTree = (parentDir: string, tree: Tree) => {
  if (!fs.existsSync(parentDir)) fs.mkdirSync(parentDir, {recursive:true});

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
  const katanaProvider = getProvider(747474, { alchemyApiKey });
  const [stats] = await Promise.all([
    fetchV2Stats({
      deployment: v2MainnetDeployment,
      vaults,
      provider: katanaProvider,
      duneKey: env.DUNE_KEY
    })
  ]);
  
  const v2Stats = {
    ...stats
  };

  // local storage
  const OUTPUT_DIR_V2 = "../../docs";

  // writeTree(OUTPUT_DIR_V2, v2Stats); -> prints all txt files as well

  if (!fs.existsSync(OUTPUT_DIR_V2)) fs.mkdirSync(OUTPUT_DIR_V2, {recursive:true});
  
  // copy previous stats
  fs.copyFileSync(path.join(OUTPUT_DIR_V2, "katana.json"), path.join(OUTPUT_DIR_V2, "previous.json"))
  
  // write new stats
  fs.writeFileSync(path.join(OUTPUT_DIR_V2, "katana.json"), JSON.stringify(v2Stats, null, 2));

  // write diffs 
  getDiffs();
}

await fetchAndUpdateStats();
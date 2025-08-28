import dotenv from "dotenv";

dotenv.config();

if (
  !process.env.ALCHEMY_API_KEY ||
  !process.env.KATANA_API_KEY ||
  !process.env.DUNE_API_KEY ||
  !process.env.DEBANK_KEY
) {
  throw new Error("Missing env");
}

export const env = {
  ALCHEMY_KEY: process.env.ALCHEMY_API_KEY!,
  KATANA_KEY: process.env.KATANA_API_KEY!,
  DUNE_KEY: process.env.DUNE_API_KEY!,
  DEBANK_KEY: process.env.DEBANK_KEY!,
};
import bundleAnalyzer from "@next/bundle-analyzer";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const commitHashCmd = "git log -1 --pretty=format:%h";

const APP_VERSION_FROM_BUILD = JSON.parse(
  readFileSync("./package.json", "utf-8"),
).version;
const APP_COMMIT_HASH_FROM_BUILD = String(execSync(
  commitHashCmd + " -- ./ ../uikit/",
)).trim();
const CONTRACTS_COMMIT_HASH_FROM_BUILD = String(execSync(
  commitHashCmd + " -- ../../contracts/addresses/11155111.json",
)).trim();

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
export default withBundleAnalyzer({
  reactStrictMode: false,
  images: { unoptimized: true },
  trailingSlash: flag(process.env.NEXT_TRAILING_SLASH),
  env: {
    APP_VERSION_FROM_BUILD,
    APP_COMMIT_HASH_FROM_BUILD,
    CONTRACTS_COMMIT_HASH_FROM_BUILD,
  },
  webpack: (config) => {
    // WalletConnect 2.0 imports these
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.optimization.minimize = false;
    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        source: "/known-initiatives/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Origin, Content-Type, Accept" },
        ],
      },
    ];
  },
});

function flag(value) {
  if (typeof value !== "string") {
    return false;
  }
  value = value.trim();
  return value === "true" || value === "1" || value === "yes";
}

import {env} from "../../env";

async function getParadexVaultData() {
  const res = await fetch(
    "https://api.prod.paradex.trade/v1/vaults/account-summary",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${env.PARADEX_KEY}`,
        Accept: "application/json",
      },
    }
  );

  // NAV
  const data = await res.json();

  // VAULT POSITION
  const vaultPositions = data.results.map((d) => {
    return {
      asset: `Paradex Vault`,
      chain: "paradex",
      balance: Number(d.deposited_amount) + Number(d.total_pnl),
      logo: "https://cdn.brandfetch.io/idcBApNlFG/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1758896510455",
    };
  });

  return {
    positions: vaultPositions,
  };
}

export async function getParadexWalletData() {
  // POSITIONS
  const tokensRes = await fetch("https://api.prod.paradex.trade/v1/balance", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${env.PARADEX_KEY}`,
      Accept: "application/json",
    },
  });
  const tokenData = await tokensRes.json();

  const positions = tokenData.results.filter((t) => Number(t.size) >= 1000).map((t) => {
    return {
      asset: t.token,
      chain: "paradex",
      balance: Number(t.size),
      logo: "https://cdn.brandfetch.io/idcBApNlFG/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1758896510455"
    };
  });

  // VAULT
  const vaultData = await getParadexVaultData();

  return {
    positions: [...positions, ...vaultData.positions],
  };
}

export async function getParadexTVL() {
  const { positions } = await getParadexWalletData();
  return positions.reduce((tot, {balance}) => tot + balance, 0);
}

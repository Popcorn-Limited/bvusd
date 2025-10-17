import axios from "axios";
import { type CallOverrides, Contract } from "@ethersproject/contracts";
import { BigNumber } from "ethers";
import { Provider } from "@ethersproject/abstract-provider";
import allocations from "../../allocations.json";

type Res = {
  protocol: string;
  wallet: string;
  collateralValue: string;
  loanValue: string;
};

type Loan = {
  marketId: string;
  wallet: string;
  collateralToken: string;
  collateralDecimals: number;
  loanAssetDecimals: number;
};

export const morphoABI = [
  "function market(bytes32) view returns (uint128, uint128, uint128, uint128, uint128, uint128)",
  "function position(bytes32,address) view returns (uint256,uint128,uint128)",
];

export interface Morpho {
  market(
    args0: string,
    overrides?: CallOverrides
  ): Promise<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]>;
  position(
    args0: string,
    args1: string,
    overrides?: CallOverrides
  ): Promise<[BigNumber, BigNumber, BigNumber, BigNumber]>;
}

const MORPHO = "0xbbbbbbbbbb9cc5e90e3b3af64bdaf62c37eeffcb";

export const getLoansTVL = async (
  debank: string,
  provider: Provider
): Promise<Res[]> => {
  let res: Res[] = [];
  for (const [protocol, loans] of Object.entries(allocations.loans)) {
    switch (protocol) {
      case "morpho":
      default:
        for (const loan of loans) {
          const l = await getMorphoTVL(debank, provider, loan);
          res.push(l);
        }
    }
  }
  return res;
};

const getMorphoTVL = async (
  debank: string,
  provider: Provider,
  loan: Loan
): Promise<Res> => {
  const btcPrice = await getTokenPrice(debank, loan.collateralToken);
  const morpho = new Contract(MORPHO, morphoABI, provider) as unknown as Morpho;
  const market = await morpho.market(loan.marketId);
  const totalBorrowAssets = Number(market[2]);
  const totalBorrowShares = Number(market[3]);
  const position = await morpho.position(loan.marketId, loan.wallet);
  const borrowShares = Number(position[1]);

  const collateral = (Number(position[2]) / 10 ** loan.collateralDecimals) * btcPrice;
  const effectiveBorrowAssets =
    (totalBorrowAssets * borrowShares) /
    totalBorrowShares /
    10 ** loan.loanAssetDecimals;

    return {
    protocol: "morpho",
    wallet: loan.wallet,
    collateralValue: collateral.toString(),
    loanValue: effectiveBorrowAssets.toString(),
  };
};

export const getTokenPrice = async (debank: string, token: string) => {
  const { data } = await axios.get(
    "https://pro-openapi.debank.com/v1/token",
    {
      params: {
        id: token,
        chain_id: "eth",
      },
      headers: {
        accept: "application/json",
        AccessKey: debank,
      },
    }
  );

  return data.price;
};

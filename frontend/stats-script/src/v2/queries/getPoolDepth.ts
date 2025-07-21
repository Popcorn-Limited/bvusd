import type { BlockTag, Provider } from "@ethersproject/abstract-provider";
import type { BigNumber } from "@ethersproject/bignumber";
import { type CallOverrides, Contract } from "@ethersproject/contracts";


const poolV3Abi = [
  "function ticks(int24) view returns (uint128, int128, uint256, uint256, int56, uint160, uint32, bool)",
  "function tickSpacing() view returns (int24)",
  "function slot0() view returns (uint160, int24, uint16, uint16, uint16, uint8, bool)",
];

export interface PoolV3 {
  ticks(tick: number, overrides?: CallOverrides): Promise<[
    BigNumber, // liquidityGross
    BigNumber, // liquidityNet
    BigNumber, // feeGrowthOutside0X128
    BigNumber, // feeGrowthOutside1X128
    BigNumber, // tickCumulativeOutside (int56 → BigNumber)
    BigNumber, // secondsPerLiquidityOutsideX128
    number,    // secondsOutside
    boolean    // initialized
  ]>;

  tickSpacing(overrides?: CallOverrides): Promise<number>;

  slot0(overrides?: CallOverrides): Promise<[
    BigNumber, // sqrtPriceX96
    number,    // tick (int24)
    number,    // observationIndex
    number,    // observationCardinality
    number,    // observationCardinalityNext
    number,    // feeProtocol
    boolean    // unlocked
  ]>;
}

export const fetchLiquidityDepth = async (provider: Provider) => {
    const pool = new Contract(
        "0x02cdd2dd00e1e0900ec03267cf16e6170ff7b05b",
        poolV3Abi,
        provider
    ) as unknown as PoolV3;
  const tickSpacing = await pool.tickSpacing();
  const slot0 = await pool.slot0();
  const currentTick = slot0[1];

  const ticks: { tick: number; liquidity: string; price: number }[] = [];

  const range = 20; // # of ticks above/below current
  for (let i = -range; i <= range; i++) {
    const tick = currentTick + i * tickSpacing;
    try {
      const tickData = await pool.ticks(tick);
      if (tickData[0].gt(0)) {
        ticks.push({
          tick,
          liquidity: tickData[0].toString(),
          price: Math.pow(1.0001, tick),
        });
      }
    } catch (err) {
      // tick uninitialized – ignore
    }
  }

//   console.table(ticks.slice(0, 20)); // preview first few results

  return ticks;
}

// fetchLiquidityDepth();

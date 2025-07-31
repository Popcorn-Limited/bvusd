// Convert tick to sqrtPrice
function tickToSqrtPrice(tick: number): number {
  return Math.pow(1.0001, tick / 2);
}

// Convert tick liquidity to token0 & token1 amounts
export function getTokenAmounts(
  liquidity: number,
  lowerTick: number,
  upperTick: number,
  decimals: number
) {
  const sqrtLower = tickToSqrtPrice(lowerTick);
  const sqrtUpper = tickToSqrtPrice(upperTick);

  const amount0 = liquidity * (1 / sqrtLower - 1 / sqrtUpper);
  const amount1 = liquidity * (sqrtUpper - sqrtLower);

  return {
    token0: amount0 / 10 ** decimals,
    token1: amount1 / 10 ** decimals,
  };
}

// Return total liquidity diffs
export function diffTokenLiquidity(
  value: any[][],
  decimals = 6
): [number, number] {
  return value.map((side) =>
    side.reduce((acc: number, item: any, idx: number, arr: any[]) => {
      const nextTick = arr[idx + 1]?.tick ?? item.tick;
      const { token0, token1 } = getTokenAmounts(
        Number(item.liquidity),
        Number(item.tick),
        Number(nextTick),
        decimals
      );
      return acc + token0 + token1;
    }, 0)
  ) as [number, number];
}

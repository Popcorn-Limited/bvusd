pragma solidity 0.8.21;

import {AggregatorV3Interface} from "../Dependencies/AggregatorV3Interface.sol";

contract PORExchangeRateFeed is AggregatorV3Interface {
    AggregatorV3Interface public immutable POR_FEED;
    IERC20 public immutable ASSET;

    constructor(AggregatorV3Interface porFeed, IERC20 asset) {
        POR_FEED = porFeed;
        ASSET = asset;
    }

    function decimals() external pure returns (uint8) {
        return 18;
    }

    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        int256 supply = int256(ASSET.totalSupply()) * (10 ** (18 - ASSET.decimals()));
        (roundId, answer, startedAt, updatedAt, answeredInRound) = POR_FEED.latestRoundData();
        int256 reserves = answer * (10 ** (18 - POR_FEED.decimals()));

        answer = Math.min(reserves.mulDiv(1e18, supply), 1e18);
    }
}

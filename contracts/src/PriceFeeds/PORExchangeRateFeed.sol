pragma solidity 0.8.21;

import {AggregatorV3Interface} from "../Dependencies/AggregatorV3Interface.sol";
import "openzeppelin-contracts/contracts/utils/math/Math.sol";

contract PORExchangeRateFeed is AggregatorV3Interface {
    AggregatorV3Interface public immutable POR_FEED;
    IERC20 public immutable ASSET;

    constructor(AggregatorV3Interface porFeed, IERC20 asset) {
        POR_FEED = porFeed;
        ASSET = asset;
    }

    function decimals() external pure returns (uint8) {
        return 8;
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
        (roundId, answer, startedAt, updatedAt, answeredInRound) = POR_FEED.latestRoundData();

        // No conversions needed since both asset and price feed have 8 decimals
        // We dont want to return a value greater than 1e8 if the asset is overcollateralized
        answer = int256(Math.min(uint256(answer).mulDiv(ASSET.totalSupply(), 1e8), 1e8));
    }
}

// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import "forge-std/Test.sol";
import "src/PriceFeeds/PORExchangeRateFeed.sol";
import "src/Dependencies/AggregatorV3Interface.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-contracts/contracts/utils/math/Math.sol";

contract PORExchangeRateFeedTest is Test {
    PORExchangeRateFeed public porExchangeRateFeed;
    AggregatorV3Interface public mockPORFeed;
    IERC20 public mockAsset;

    // Mainnet addresses for testing
    address constant CB_BTC_POR_FEED =
        0xcBe87Dc0Cf9d807848a3E703B01A90B28eCFb2a7; // cbBTC POR Chainlink
    address constant CB_BTC = 0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf; // cbBTC token

    function setUp() public {
        // Create mainnet fork
        try vm.envString("MAINNET_RPC_URL") returns (string memory rpcUrl) {
            vm.createSelectFork(rpcUrl, 22781734);
        } catch {
            vm.skip(true);
        }

        // Deploy mock contracts
        mockPORFeed = new MockAggregatorV3();
        mockAsset = new MockERC20();

        // Deploy the PORExchangeRateFeed contract
        porExchangeRateFeed = new PORExchangeRateFeed(mockPORFeed, mockAsset);
    }

    function test_Decimals() public {
        assertEq(porExchangeRateFeed.decimals(), 8);
    }

    function test_LatestRoundData_Basic() public {
        MockAggregatorV3(address(mockPORFeed)).setRoundId(1);
        MockAggregatorV3(address(mockPORFeed)).setReserves(int256(2000e8));
        MockERC20(address(mockAsset)).mint(address(this), 2000e8);

        (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        ) = porExchangeRateFeed.latestRoundData();

        // Verify the returned data structure
        assertEq(roundId, 1);
        assertEq(answer, 1e8);
        assertEq(answeredInRound, 1);

        // The answer should be capped at 1e8 (100%) when asset is overcollateralized
        assertLe(uint256(answer), 1e8);
    }

    function test_LatestRoundData_Overcollateralized() public {
        MockAggregatorV3(address(mockPORFeed)).setRoundId(1);
        MockAggregatorV3(address(mockPORFeed)).setReserves(int256(2000e8));
        MockERC20(address(mockAsset)).mint(address(this), 1000e8);

        (, int256 answer, , , ) = porExchangeRateFeed.latestRoundData();

        // Should be capped at 1e8
        assertEq(uint256(answer), 1e8);
    }

    function test_LatestRoundData_Undercollateralized() public {
        MockAggregatorV3(address(mockPORFeed)).setRoundId(1);
        MockAggregatorV3(address(mockPORFeed)).setReserves(int256(1000e8));
        MockERC20(address(mockAsset)).mint(address(this), 2000e8);

        (, int256 answer, , , ) = porExchangeRateFeed.latestRoundData();

        // Should be less than 1e8
        assertEq(uint256(answer), 0.5e8);
    }

    function test_LatestRoundData_MainnetFork() public {
        // Test with real mainnet data
        AggregatorV3Interface porFeed = AggregatorV3Interface(CB_BTC_POR_FEED);
        IERC20 asset = IERC20(CB_BTC);

        // Deploy new instance with mainnet contracts
        PORExchangeRateFeed mainnetFeed = new PORExchangeRateFeed(
            porFeed,
            asset
        );

        (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        ) = mainnetFeed.latestRoundData();

        // Verify we get valid data from mainnet
        assertEq(roundId, 18446744073709551930);
        assertEq(answer, 1e8);
        assertEq(startedAt, 1750845281);
        assertEq(updatedAt, 1750845299);
        assertEq(answeredInRound, 18446744073709551930);
    }
}

// Mock contracts for testing
contract MockAggregatorV3 is AggregatorV3Interface {
    int256 private reserves;
    uint80 private roundId;
    bool private isStale;

    function setReserves(int256 _reserves) external {
        reserves = _reserves;
    }

    function setStaleData(bool _isStale) external {
        isStale = _isStale;
    }

    function setRoundId(uint80 _roundId) external {
        roundId = _roundId;
    }

    function decimals() external pure returns (uint8) {
        return 8;
    }

    function latestRoundData()
        external
        view
        returns (
            uint80,
            int256,
            uint256,
            uint256,
            uint80
        )
    {
        uint256 timestamp = isStale
            ? block.timestamp - 7 days
            : block.timestamp;
        return (roundId, reserves, timestamp - 3600, timestamp, roundId);
    }
}

contract MockERC20 is ERC20 {
    constructor() ERC20("MockERC20", "MOCK") {}

    function decimals() public view virtual override returns (uint8) {
        return 8;
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external {
        _burn(from, amount);
    }
}

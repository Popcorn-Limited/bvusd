// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {BoldConverter} from "src/Dependencies/BoldConverter.sol";
import {BoldToken, IBoldToken} from "src/BoldToken.sol";

import "forge-std/Test.sol";

contract TestToken is ERC20 {
    uint8 internal _decimals;

    constructor(
        uint8 dec,
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) {
        _decimals = dec;
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }
}

// test multiple paths
contract StableCoinConverterTest is Test {
    BoldConverter public converter;

    IERC20Metadata public asset;
    IBoldToken public bvUSD;

    address public userA;
    address public receiver;

    address public converterAddr;

    uint256 public constant mintAmount = 1000e6;
    uint256 public constant depositAmount = 25e6;
    uint256 public constant withdrawAmount = 10e18;
    uint256 public constant feeAmount = 100; // 1%

    uint8 public constant assetDecimals = 6;

    function setUp() public {
        asset = IERC20Metadata(new TestToken(assetDecimals, "USDC", "USDC"));
        bvUSD = IBoldToken(0x876aac7648D79f87245E73316eB2D100e75F3Df1); // katana fork
        userA = makeAddr("A");
        receiver = makeAddr("Receiver");

        BoldConverter.Path[] memory paths = new BoldConverter.Path[](1);
        paths[0] = BoldConverter.Path(receiver, 0, feeAmount);

        IERC20Metadata[] memory assets = new IERC20Metadata[](1);
        assets[0] = asset;

        converter = new BoldConverter(assets, paths, address(bvUSD));
        converterAddr = address(converter);

        vm.startPrank(bvUSD.owner());
        bvUSD.setMinter(converterAddr, true);
        bvUSD.setBurner(converterAddr, true);
        vm.stopPrank();
    }

    function test_deposit() public {
       _testDeposit(userA, receiver, asset, depositAmount);
    }

    function test_withdraw() public {
       _testWithdraw(userA, receiver, asset, withdrawAmount, feeAmount);
    }

    function test_multiplePaths() public {
        IERC20Metadata newAsset = IERC20Metadata(
            new TestToken(assetDecimals, "USDC2", "USDC2")
        );

        address receiver2 = makeAddr("receiverB");

        assertFalse(converter.isValidPath(newAsset));

        BoldConverter.Path[] memory paths = new BoldConverter.Path[](1);
        paths[0] = BoldConverter.Path(receiver2, 0, feeAmount);

        IERC20Metadata[] memory assets = new IERC20Metadata[](1);
        assets[0] = newAsset;

        vm.prank(address(this));
        converter.setPaths(assets, paths);

        assertTrue(converter.isValidPath(newAsset));

        _testDeposit(userA, receiver2, newAsset, depositAmount);

        _testWithdraw(userA, receiver2, newAsset, withdrawAmount, 0);
    }

    function test_addPath_onlyOwner() public {
        IERC20Metadata newAsset = IERC20Metadata(
            new TestToken(assetDecimals, "USDC2", "USDC2")
        );

        assertFalse(converter.isValidPath(newAsset));

        BoldConverter.Path[] memory paths = new BoldConverter.Path[](1);
        paths[0] = BoldConverter.Path(receiver, 0, 0);

        IERC20Metadata[] memory assets = new IERC20Metadata[](1);
        assets[0] = newAsset;

        vm.prank(address(this));
        converter.setPaths(assets, paths);

        assertTrue(converter.isValidPath(newAsset));
        vm.prank(userA);
        vm.expectRevert("Owned/not-owner");
        converter.setPaths(assets, paths);
    }

    function test_removePath_onlyOwner() public {
        IERC20Metadata newAsset = IERC20Metadata(
            new TestToken(assetDecimals, "USDC2", "USDC2")
        );

        assertFalse(converter.isValidPath(newAsset));

        BoldConverter.Path[] memory paths = new BoldConverter.Path[](1);
        paths[0] = BoldConverter.Path(receiver, 0, 0);

        IERC20Metadata[] memory assets = new IERC20Metadata[](1);
        assets[0] = newAsset;

        vm.prank(address(this));
        converter.setPaths(assets, paths);

        assertTrue(converter.isValidPath(newAsset));
        vm.prank(address(this));
        converter.deletePaths(assets);

        assertFalse(converter.isValidPath(newAsset));

        vm.prank(userA);
        vm.expectRevert("Owned/not-owner");
        converter.deletePaths(assets);
    }

    function test_deposit_invalidPath() public {
        IERC20Metadata invalidAsset = IERC20Metadata(
            new TestToken(assetDecimals, "USDC", "USDC")
        );
        vm.expectRevert("Invalid path");
        vm.prank(userA);
        converter.deposit(invalidAsset, 1e18);
    }

    function test_withdraw_invalidPath() public {
        IERC20Metadata invalidAsset = IERC20Metadata(
            new TestToken(assetDecimals, "USDC", "USDC")
        );
        vm.expectRevert("Invalid path");
        vm.prank(userA);
        converter.withdraw(invalidAsset, 1e18, userA);
    }

    function _testDeposit(address user, address receiver, IERC20Metadata asset, uint256 amount) internal {
        deal(address(asset), user, mintAmount);

        uint256 receiverAssetBalanceBefore = asset.balanceOf(receiver);
        uint256 userBvUSDBalanceBefore = bvUSD.balanceOf(user);
        uint256 bvUSDSupplyBefore = bvUSD.totalSupply();

        // deposit
        uint256 bvUSDOut = _deposit(user, asset, depositAmount);

        // Converter holds no assets
        assertEq(asset.balanceOf(converterAddr), 0, "Converter Asset balanace");
        assertEq(bvUSD.balanceOf(converterAddr), 0, "Converter bvUSD balanace");

        // receiver holds assets
        assertEq(
            asset.balanceOf(receiver),
            receiverAssetBalanceBefore + depositAmount,
            "Receiver Asset balanace"
        );

        // total supply increased by scaled amount
        uint256 scaledbvUSDAmount = depositAmount * 10 ** (18 - assetDecimals);
        assertEq(
            bvUSD.totalSupply(),
            bvUSDSupplyBefore + scaledbvUSDAmount,
            "bvUSD supply"
        );

        // user receives bvUSD scaled amount
        assertEq(
            bvUSD.balanceOf(user),
            userBvUSDBalanceBefore + bvUSDOut,
            "bvUSD balance"
        );

        // user asset balance
        assertEq(
            asset.balanceOf(user),
            mintAmount - depositAmount,
            "User Asset balanace"
        );
    }

    function _testWithdraw(address user, address receiver, IERC20Metadata asset, uint256 amount, uint256 fee) internal {
        deal(address(asset), user, mintAmount);

        // deposit
        _deposit(user, asset, depositAmount);

        uint256 receiverAssetBalanceBefore = asset.balanceOf(receiver);
        uint256 userBvUSDBalanceBefore = bvUSD.balanceOf(user);
        uint256 bvUSDSupplyBefore = bvUSD.totalSupply();
        uint256 userAssetBalanceBefore = asset.balanceOf(user);

        // underlying receiver needs to approve converter
        vm.prank(receiver);
        asset.approve(converterAddr, withdrawAmount);

        vm.prank(user);
        uint256 assetOut = converter.withdraw(asset, withdrawAmount, user);

        uint256 scaledWithdraw = withdrawAmount / (10 ** (18 - assetDecimals));
        uint256 expectedFee = scaledWithdraw * feeAmount / 10000;

        assertEq(assetOut, scaledWithdraw - expectedFee, "Fee amount");

        // underlying receiver sent asset to user
        assertEq(
            asset.balanceOf(receiver),
            receiverAssetBalanceBefore - assetOut,
            "Receiver asset balance"
        );

        // user received asset
        assertEq(
            asset.balanceOf(userA),
            userAssetBalanceBefore + assetOut,
            "User asset balance"
        );

        // user bvUSD
        assertEq(
            bvUSD.balanceOf(userA),
            userBvUSDBalanceBefore - withdrawAmount,
            "bvUSD user balance"
        );

        // bvUSD is burned
        assertEq(
            bvUSD.totalSupply(),
            bvUSDSupplyBefore - withdrawAmount,
            "bvUSD supply"
        );

        // Converter holds no assets
        assertEq(asset.balanceOf(converterAddr), 0, "Converter Asset balanace");
        assertEq(bvUSD.balanceOf(converterAddr), 0, "Converter bvUSD balanace");
    }

    function _deposit(
        address who,
        IERC20Metadata asset,
        uint256 amount
    ) internal returns (uint256 bvUSDOut) {
        vm.startPrank(who);
        asset.approve(converterAddr, amount);

        bvUSDOut = converter.deposit(asset, amount);
        vm.stopPrank();
    }
}

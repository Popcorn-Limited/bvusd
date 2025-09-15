// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {BoldConverter, HasWhitelist} from "src/Dependencies/BoldConverter.sol";
import {BoldToken, IBoldToken} from "src/BoldToken.sol";
import {Whitelist, IWhitelist} from "src/Dependencies/Whitelist.sol";

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

    IERC20Metadata public firstAsset;
    IBoldToken public bvUSD;
    IWhitelist public whitelist;

    address public userA;
    address public firstReceiver;

    address public converterAddr;

    bytes4 public depositSelector =
        bytes4(keccak256("deposit(address,uint256,address)"));
    bytes4 public withdrawSelector =
        bytes4(keccak256("withdraw(address,uint256,address)"));

    function setUp() public {
        firstAsset = IERC20Metadata(new TestToken(6, "USDC", "USDC"));
        bvUSD = IBoldToken(0x876aac7648D79f87245E73316eB2D100e75F3Df1); // katana fork
        userA = makeAddr("A");
        firstReceiver = makeAddr("Receiver");

        BoldConverter.Path[] memory paths = new BoldConverter.Path[](1);
        paths[0] = BoldConverter.Path(firstReceiver, 0, 100);

        IERC20Metadata[] memory assets = new IERC20Metadata[](1);
        assets[0] = firstAsset;

        converter = new BoldConverter(assets, paths, address(bvUSD));
        converterAddr = address(converter);

        whitelist = IWhitelist(address(new Whitelist(bvUSD.owner())));
        converter.setWhitelist(whitelist);

        vm.startPrank(bvUSD.owner());
        bvUSD.setMinter(converterAddr, true);
        bvUSD.setBurner(converterAddr, true);
        vm.stopPrank();
    }

    // --- Helper functions ---

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

    // --- Deposit tests ---

    function _testDeposit(
        address user,
        address receiver,
        IERC20Metadata asset,
        uint256 amount
    ) internal {
        uint256 assetDecimals = asset.decimals();

        deal(address(asset), user, amount);

        uint256 receiverAssetBalanceBefore = asset.balanceOf(receiver);
        uint256 userBvUSDBalanceBefore = bvUSD.balanceOf(user);
        uint256 bvUSDSupplyBefore = bvUSD.totalSupply();
        uint256 userAssetBalanceBefore = asset.balanceOf(user);

        if (amount == 0) {
            vm.startPrank(user);
            asset.approve(converterAddr, amount);

            vm.expectRevert("out = 0");
            converter.deposit(asset, amount);
            vm.stopPrank();
        } else {
            // deposit
            uint256 bvUSDOut = _deposit(user, asset, amount);
            // Converter holds no assets
            assertEq(
                asset.balanceOf(converterAddr),
                0,
                "Converter Asset balanace"
            );
            assertEq(
                bvUSD.balanceOf(converterAddr),
                0,
                "Converter bvUSD balanace"
            );

            // receiver holds assets
            assertEq(
                asset.balanceOf(receiver),
                receiverAssetBalanceBefore + amount,
                "Receiver Asset balanace"
            );

            // total supply increased by scaled amount
            uint256 scaledbvUSDAmount = amount * 10 ** (18 - assetDecimals);
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
                userAssetBalanceBefore - amount,
                "User Asset balanace"
            );
        }
    }

    function test_deposit_six_decimals(uint256 depositAmount) public {
        vm.assume(depositAmount < 1000000000000000000000);
        _testDeposit(userA, firstReceiver, firstAsset, depositAmount);
    }

    function test_deposit_invalidPath() public {
        IERC20Metadata invalidAsset = IERC20Metadata(
            new TestToken(6, "USDC", "USDC")
        );
        vm.expectRevert("Invalid path");
        vm.prank(userA);
        converter.deposit(invalidAsset, 1e18);
    }

    // --- Withdraw tests ---

    function _testWithdraw(
        address user,
        address receiver,
        IERC20Metadata asset,
        uint256 amount,
        uint256 fee
    ) internal {
        uint256 assetDecimals = asset.decimals();

        uint256 receiverAssetBalanceBefore = asset.balanceOf(receiver);
        uint256 userBvUSDBalanceBefore = bvUSD.balanceOf(user);
        uint256 bvUSDSupplyBefore = bvUSD.totalSupply();
        uint256 userAssetBalanceBefore = asset.balanceOf(user);

        // underlying receiver needs to approve converter
        vm.prank(receiver);
        asset.approve(converterAddr, amount);

        vm.prank(user);
        if ((assetDecimals != 18 && amount < 1e12) || amount == 0) {
            vm.expectRevert("out = 0");
            converter.withdraw(asset, amount, user);
        } else {
            uint256 assetOut = converter.withdraw(asset, amount, user);
            uint256 scaledWithdraw = amount / (10 ** (18 - assetDecimals));
            uint256 expectedFee = (scaledWithdraw * fee) / 10000;

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
                userBvUSDBalanceBefore - amount,
                "bvUSD user balance"
            );

            // bvUSD is burned
            assertEq(
                bvUSD.totalSupply(),
                bvUSDSupplyBefore - amount,
                "bvUSD supply"
            );

            // Converter holds no assets
            assertEq(
                asset.balanceOf(converterAddr),
                0,
                "Converter Asset balanace"
            );
            assertEq(
                bvUSD.balanceOf(converterAddr),
                0,
                "Converter bvUSD balanace"
            );
        }
    }

    function test_withdraw(
        uint256 depositAmount,
        uint256 withdrawAmount
    ) public {
        vm.assume(depositAmount >= withdrawAmount);
        vm.assume(depositAmount < 1000000000000000000000);

        _testDeposit(userA, firstReceiver, firstAsset, depositAmount);
        _testWithdraw(userA, firstReceiver, firstAsset, withdrawAmount, 100);
    }

    function test_withdraw_noReceiverApproval() public {
        deal(address(firstAsset), userA, 10e18);

        // deposit
        _deposit(userA, firstAsset, 10e18);

        // underlying asset holder does not approve assets to be pulled
        vm.expectRevert("ERC20: insufficient allowance");
        vm.prank(userA);
        converter.withdraw(firstAsset, 1e18, userA);
    }

    function test_withdraw_invalidPath() public {
        IERC20Metadata invalidAsset = IERC20Metadata(
            new TestToken(6, "USDC", "USDC")
        );
        vm.expectRevert("Invalid path");
        vm.prank(userA);
        converter.withdraw(invalidAsset, 1e18, userA);
    }

    // --- Roundtrip tests ---

    function test_multiplePaths_18_decimals(
        uint256 depositAmount,
        uint256 withdrawAmount
    ) public {
        vm.assume(depositAmount >= withdrawAmount);
        vm.assume(depositAmount < 1000000000000000000000);

        IERC20Metadata newAsset = IERC20Metadata(
            new TestToken(18, "USDC2", "USDC2")
        );

        address receiver2 = makeAddr("receiverB");

        assertFalse(converter.isValidPath(newAsset));

        BoldConverter.Path[] memory paths = new BoldConverter.Path[](1);
        paths[0] = BoldConverter.Path(receiver2, 0, 100);

        IERC20Metadata[] memory assets = new IERC20Metadata[](1);
        assets[0] = newAsset;

        vm.prank(address(this));
        converter.setPaths(assets, paths);

        assertTrue(converter.isValidPath(newAsset));

        _testDeposit(userA, receiver2, newAsset, depositAmount);

        _testWithdraw(userA, receiver2, newAsset, withdrawAmount, 100);
    }

    // --- Path management tests ---

    function test_addPath_onlyOwner() public {
        IERC20Metadata newAsset = IERC20Metadata(
            new TestToken(6, "USDC2", "USDC2")
        );

        assertFalse(converter.isValidPath(newAsset));

        BoldConverter.Path[] memory paths = new BoldConverter.Path[](1);
        paths[0] = BoldConverter.Path(firstReceiver, 0, 0);

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
            new TestToken(6, "USDC2", "USDC2")
        );

        assertFalse(converter.isValidPath(newAsset));

        BoldConverter.Path[] memory paths = new BoldConverter.Path[](1);
        paths[0] = BoldConverter.Path(firstReceiver, 0, 0);

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

    function test_failing() public {
        uint256 depositAmount = 489877346851431045;
        uint256 withdrawAmount = 3;

        IERC20Metadata newAsset = IERC20Metadata(
            new TestToken(18, "USDC2", "USDC2")
        );

        address receiver2 = makeAddr("receiverB");

        assertFalse(converter.isValidPath(newAsset));

        BoldConverter.Path[] memory paths = new BoldConverter.Path[](1);
        paths[0] = BoldConverter.Path(receiver2, 0, 100);

        IERC20Metadata[] memory assets = new IERC20Metadata[](1);
        assets[0] = newAsset;

        vm.prank(address(this));
        converter.setPaths(assets, paths);

        assertTrue(converter.isValidPath(newAsset));

        _testDeposit(userA, receiver2, newAsset, depositAmount);

        _testWithdraw(userA, receiver2, newAsset, withdrawAmount, 100);
    }

    // --- Whitelist management tests ---

    function test_setWhitelist() public {
        converter.setWhitelist(IWhitelist(address(0)));
        assertEq(address(converter.whitelist()), address(0));
    }

    function test_setWhitelist_onlyOwner() public {
        vm.startPrank(userA);
        vm.expectRevert("Owned/not-owner");
        converter.setWhitelist(whitelist);
    }

    // --- Whitelist interaction tests ---

    function test_deposit_whitelisted() public {
        vm.startPrank(bvUSD.owner());
        whitelist.addWhitelistedFunc(address(converter), depositSelector);
        whitelist.addToWhitelist(address(converter), depositSelector, userA);
        vm.stopPrank();

        _testDeposit(userA, firstReceiver, firstAsset, 1e18);
    }

    function test_withdraw_whitelisted() public {
        vm.startPrank(bvUSD.owner());
        whitelist.addWhitelistedFunc(address(converter), withdrawSelector);
        whitelist.addToWhitelist(address(converter), withdrawSelector, userA);
        vm.stopPrank();

        _testDeposit(userA, firstReceiver, firstAsset, 1e18);
        _testWithdraw(userA, firstReceiver, firstAsset, 1e18, 100);
    }

    function test_deposit_notWhitelisted() public {
        vm.startPrank(bvUSD.owner());
        whitelist.addWhitelistedFunc(address(converter), depositSelector);
        vm.stopPrank();

        vm.startPrank(userA);
        vm.expectRevert(
            abi.encodeWithSelector(HasWhitelist.NotWhitelisted.selector, userA)
        );
        converter.deposit(firstAsset, 1e18);
    }

    function test_withdraw_notWhitelisted() public {
        vm.startPrank(bvUSD.owner());
        whitelist.addWhitelistedFunc(address(converter), withdrawSelector);
        vm.stopPrank();

        vm.startPrank(userA);
        vm.expectRevert(
            abi.encodeWithSelector(HasWhitelist.NotWhitelisted.selector, userA)
        );
        converter.withdraw(firstAsset, 1e18, userA);
    }
}

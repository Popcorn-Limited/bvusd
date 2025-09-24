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
    struct TestParams {
        address from;
        address origin;
        address to;
        uint256 amount;
        IERC20Metadata asset;
    }

    BoldConverter public converter;

    IERC20Metadata public asset;
    IBoldToken public bvUSD;
    IWhitelist public whitelist;

    address public userA;
    address public userB;
    address public firstAssetReceiver;

    bytes4 public depositSelector =
        bytes4(keccak256("deposit(address,uint256,address)"));
    bytes4 public withdrawSelector =
        bytes4(keccak256("withdraw(address,uint256,address)"));

    function setUp() public {
        asset = IERC20Metadata(new TestToken(6, "USDC", "USDC"));
        bvUSD = IBoldToken(0x876aac7648D79f87245E73316eB2D100e75F3Df1); // katana fork
        userA = makeAddr("A");
        userB = makeAddr("B");
        firstAssetReceiver = makeAddr("Receiver");

        BoldConverter.Path[] memory paths = new BoldConverter.Path[](1);
        paths[0] = BoldConverter.Path(firstAssetReceiver, 0, 100);

        IERC20Metadata[] memory assets = new IERC20Metadata[](1);
        assets[0] = asset;

        converter = new BoldConverter(assets, paths, address(bvUSD));

        whitelist = IWhitelist(address(new Whitelist(bvUSD.owner())));
        converter.setWhitelist(whitelist);

        vm.startPrank(bvUSD.owner());
        bvUSD.setMinter(address(converter), true);
        bvUSD.setBurner(address(converter), true);
        vm.stopPrank();
    }

    // --- Helper functions ---

    function _deposit(
        TestParams memory params
    ) internal returns (uint256 bvUSDOut) {
        vm.startPrank(params.from, params.origin);
        params.asset.approve(address(converter), params.amount);

        bvUSDOut = converter.deposit(params.asset, params.amount, params.to);
        vm.stopPrank();
    }

    // --- Deposit tests ---

    function _testDeposit(TestParams memory params) internal {
        address _assetReceiver = converter
            .getPath(params.asset)
            .underlyingReceiver;

        deal(address(params.asset), params.from, params.amount);

        uint256 assetReceiverBal0 = params.asset.balanceOf(_assetReceiver);
        uint256 fromAssetBal0 = params.asset.balanceOf(params.from);
        uint256 toBvUSDBal0 = bvUSD.balanceOf(params.to);
        uint256 bvUSDSupply0 = bvUSD.totalSupply();

        if (params.amount == 0) {
            vm.startPrank(params.from, params.origin);
            params.asset.approve(address(converter), params.amount);

            vm.expectRevert("out = 0");
            converter.deposit(params.asset, params.amount, params.to);
            vm.stopPrank();
        } else {
            // deposit
            uint256 bvUSDOut = _deposit(params);
            // No assets or bvUSD in converter
            assertEq(
                params.asset.balanceOf(address(converter)),
                0,
                "Converter Asset balance"
            );
            assertEq(
                bvUSD.balanceOf(address(converter)),
                0,
                "Converter bvUSD balance"
            );

            // asset receiver got assets from sender
            assertEq(
                params.asset.balanceOf(_assetReceiver),
                assetReceiverBal0 + params.amount,
                "Asset receiver balance"
            );

            // total supply increased by scaled amount
            assertEq(
                bvUSD.totalSupply(),
                bvUSDSupply0 +
                    (params.amount * 10 ** (18 - params.asset.decimals())),
                "bvUSD supply"
            );

            // to receives bvUSD scaled amount
            assertEq(
                bvUSD.balanceOf(params.to),
                toBvUSDBal0 + bvUSDOut,
                "bvUSD balance"
            );

            // from asset balance decreased
            assertEq(
                asset.balanceOf(params.from),
                fromAssetBal0 - params.amount,
                "User Asset balance"
            );
        }
    }

    function test_deposit(uint256 depositAmount) public {
        vm.assume(depositAmount < 1000000000000000000000);
        _testDeposit(TestParams(userA, userA, userA, depositAmount, asset));
    }

    function test_depositTo(uint256 depositAmount) public {
        vm.assume(depositAmount < 1000000000000000000000);
        _testDeposit(TestParams(userA, userA, userB, depositAmount, asset));
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

    function _testWithdraw(TestParams memory params, uint256 _fee) internal {
        address _assetReceiver = converter
            .getPath(params.asset)
            .underlyingReceiver;
        uint256 assetDecimals = params.asset.decimals();

        uint256 assetReceiverBal0 = params.asset.balanceOf(_assetReceiver);
        uint256 toAssetBal0 = params.asset.balanceOf(params.to);
        uint256 fromBvUSDBal0 = bvUSD.balanceOf(params.from);
        uint256 bvUSDSupply0 = bvUSD.totalSupply();

        // underlying receiver needs to approve converter
        vm.prank(_assetReceiver);
        params.asset.approve(address(converter), params.amount);

        vm.prank(params.from, params.origin);
        if (
            (assetDecimals != 18 && params.amount < 1e12) || params.amount == 0
        ) {
            vm.expectRevert("out = 0");
            converter.withdraw(params.asset, params.amount, params.to);
        } else {
            uint256 assetOut = converter.withdraw(
                params.asset,
                params.amount,
                params.to
            );
            uint256 scaledWithdraw = params.amount /
                (10 ** (18 - assetDecimals));
            uint256 expectedFee = (scaledWithdraw * _fee) / 10000;

            assertEq(assetOut, scaledWithdraw - expectedFee, "Fee amount");

            // underlying receiver sent asset to user
            assertEq(
                params.asset.balanceOf(_assetReceiver),
                assetReceiverBal0 - assetOut,
                "Receiver asset balance"
            );

            // to received asset
            assertEq(
                params.asset.balanceOf(params.to),
                toAssetBal0 + assetOut,
                "To asset balance"
            );

            // from bvUSD balance decreased
            assertEq(
                bvUSD.balanceOf(params.from),
                fromBvUSDBal0 - params.amount,
                "From bvUSD balance"
            );

            // bvUSD is burned
            assertEq(
                bvUSD.totalSupply(),
                bvUSDSupply0 - params.amount,
                "bvUSD supply"
            );

            // Converter holds no assets
            assertEq(
                params.asset.balanceOf(address(converter)),
                0,
                "Converter Asset balance"
            );
            assertEq(
                bvUSD.balanceOf(address(converter)),
                0,
                "Converter bvUSD balance"
            );
        }
    }

    function test_withdraw(
        uint256 depositAmount,
        uint256 withdrawAmount
    ) public {
        vm.assume(depositAmount >= withdrawAmount);
        vm.assume(depositAmount < 1000000000000000000000);

        _testDeposit(TestParams(userA, userA, userA, depositAmount, asset));
        _testWithdraw(
            TestParams(userA, userA, userA, withdrawAmount, asset),
            100
        );
    }

    function test_withdrawTo(
        uint256 depositAmount,
        uint256 withdrawAmount
    ) public {
        vm.assume(depositAmount >= withdrawAmount);
        vm.assume(depositAmount < 1000000000000000000000);

        _testDeposit(TestParams(userA, userA, userA, depositAmount, asset));
        _testWithdraw(
            TestParams(userA, userA, userB, withdrawAmount, asset),
            100
        );
    }

    function test_withdraw_noReceiverApproval() public {
        deal(address(asset), userA, 10e18);

        // deposit
        _deposit(TestParams(userA, userA, userA, 10e18, asset));

        // underlying asset holder does not approve assets to be pulled
        vm.expectRevert("ERC20: insufficient allowance");
        vm.prank(userA);
        converter.withdraw(asset, 1e18, userA);
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

        _testDeposit(TestParams(userA, userA, userA, depositAmount, newAsset));
        _testWithdraw(
            TestParams(userA, userA, userA, withdrawAmount, newAsset),
            100
        );
    }

    // --- Path management tests ---

    function test_addPath_onlyOwner() public {
        IERC20Metadata newAsset = IERC20Metadata(
            new TestToken(6, "USDC2", "USDC2")
        );

        assertFalse(converter.isValidPath(newAsset));

        BoldConverter.Path[] memory paths = new BoldConverter.Path[](1);
        paths[0] = BoldConverter.Path(firstAssetReceiver, 0, 0);

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
        paths[0] = BoldConverter.Path(firstAssetReceiver, 0, 0);

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

        _testDeposit(TestParams(userA, userA, userA, 1e18, asset));
    }

    function test_deposit_whitelisted_origin() public {
        vm.startPrank(bvUSD.owner());
        whitelist.addWhitelistedFunc(address(converter), depositSelector);
        whitelist.addToWhitelist(address(converter), depositSelector, userB);
        vm.stopPrank();

        vm.startPrank(userB);
        asset.approve(address(converter), 1e18);
        vm.stopPrank();

        _testDeposit(TestParams(userA, userB, userB, 1e18, asset));
    }

    function test_withdraw_whitelisted() public {
        vm.startPrank(bvUSD.owner());
        whitelist.addWhitelistedFunc(address(converter), withdrawSelector);
        whitelist.addToWhitelist(address(converter), withdrawSelector, userA);
        vm.stopPrank();

        _testDeposit(TestParams(userA, userA, userA, 1e18, asset));
        _testWithdraw(TestParams(userA, userA, userA, 1e18, asset), 100);
    }

    function test_withdraw_whitelisted_origin() public {
        vm.startPrank(bvUSD.owner());
        whitelist.addWhitelistedFunc(address(converter), withdrawSelector);
        whitelist.addToWhitelist(address(converter), withdrawSelector, userB);
        vm.stopPrank();

        _testDeposit(TestParams(userA, userA, userA, 1e18, asset));
        _testWithdraw(TestParams(userA, userB, userB, 1e18, asset), 100);
    }

    function test_deposit_notWhitelisted() public {
        vm.startPrank(bvUSD.owner());
        whitelist.addWhitelistedFunc(address(converter), depositSelector);
        vm.stopPrank();

        vm.startPrank(userA);
        vm.expectRevert(
            abi.encodeWithSelector(HasWhitelist.NotWhitelisted.selector, userA)
        );
        converter.deposit(asset, 1e18);
    }

    function test_withdraw_notWhitelisted() public {
        vm.startPrank(bvUSD.owner());
        whitelist.addWhitelistedFunc(address(converter), withdrawSelector);
        vm.stopPrank();

        vm.startPrank(userA);
        vm.expectRevert(
            abi.encodeWithSelector(HasWhitelist.NotWhitelisted.selector, userA)
        );
        converter.withdraw(asset, 1e18, userA);
    }
}

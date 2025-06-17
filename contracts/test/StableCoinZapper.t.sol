// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {StableToVaultZapper, IERC4626} from "src/Zappers/StableToVaultZapper.sol";
import {BoldConverter} from "src/Dependencies/BoldConverter.sol";
import {BoldToken, IBoldToken} from "src/BoldToken.sol";
import {IERC7540Deposit, IERC7540Redeem} from "src/Interfaces/IERC7540.sol";

import "forge-std/Test.sol";

contract TestToken is ERC20 {
    uint8 internal _decimals;

    constructor(uint8 dec, string memory name, string memory symbol) ERC20(name, symbol) {
        _decimals = dec;
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }
}

contract StableCoinZapperTest is Test {
    StableToVaultZapper public zapper;
    BoldConverter public converter;

    IERC20Metadata public asset;
    IBoldToken public bvUSD;
    address public sbvUSDAddr;
    address public vaultSafe;

    address public userA;

    address public zapperAddr;

    uint256 public constant mintAmount = 1000e6;
    uint256 public constant depositAmount = 25e6;
    uint256 public constant withdrawAmount = 10e18;

    uint8 public constant assetDecimals = 6;

    function setUp() public {
        asset = IERC20Metadata(new TestToken(assetDecimals, "USDC", "USDC"));

        bvUSD = IBoldToken(0x876aac7648D79f87245E73316eB2D100e75F3Df1); // katana fork
        sbvUSDAddr = address(0x24E2aE2f4c59b8b7a03772142d439fDF13AAF15b); // katana fork
        vaultSafe = address(0x452DC676b4E377a76B4b3048eB3b511A0F1ec057);

        converter = new BoldConverter(asset, address(bvUSD), 0, vaultSafe);

        zapper = new StableToVaultZapper(converter, sbvUSDAddr);      
        zapperAddr = address(zapper);

        vm.startPrank(bvUSD.owner());
        bvUSD.setMinter(address(converter), true);
        bvUSD.setBurner(address(converter), true);
        vm.stopPrank();

        vm.startPrank(vaultSafe);
        bvUSD.approve(sbvUSDAddr, type(uint256).max); // safe approves vault to pull bvUSD for withdraw
        asset.approve(address(converter), type(uint256).max); // safe approves vault to pull USDC for withdraw
        vm.stopPrank();

        userA = makeAddr("A");
    }

    function test_zapDeposit() public {
        deal(address(asset), userA, mintAmount);

        uint256 zapperAssetBalanceBefore = asset.balanceOf(zapperAddr);
        uint256 safeAssetBalanceBefore = asset.balanceOf(vaultSafe);

        uint256 bvUSDSupplyBefore = bvUSD.totalSupply();
        uint256 userSbvUSDBalanceBefore = IERC20(sbvUSDAddr).balanceOf(userA);

        // deposit
        uint256 sbvUSDOut = _zapDeposit(userA, depositAmount);
        
        // zapper holds no assets
        assertEq(asset.balanceOf(zapperAddr), 0, "Zapper Asset balanace");
        assertEq(bvUSD.balanceOf(zapperAddr), 0, "Zapper bvUSD balanace");

        assertEq(asset.balanceOf(vaultSafe), safeAssetBalanceBefore + depositAmount, "Safe Asset balanace");

        // total supply increased by scaled amount
        uint256 scaledbvUSDAmount = depositAmount * 10 ** (18 - assetDecimals);
        assertEq(bvUSD.totalSupply(), bvUSDSupplyBefore + scaledbvUSDAmount, "bvUSD supply");

        // user receives sbvUSD scaled amount
        assertEq(IERC20(sbvUSDAddr).balanceOf(userA), userSbvUSDBalanceBefore + sbvUSDOut, "sbvUSD balance");

        // user asset balance
        assertEq(asset.balanceOf(userA), mintAmount - depositAmount, "User Asset balanace");
    }

    // // requires enough bvUSD is liquid in the vault safe
    function test_zapInstantWithdraw() public {
        deal(address(asset), userA, mintAmount);

        // deposit
        _zapDeposit(userA, depositAmount);

        uint256 safeAssetBalanceBefore = asset.balanceOf(vaultSafe);
        uint256 bvUSDSupplyBefore = bvUSD.totalSupply();
        uint256 sbvUSDSupplyBefore = IERC20(sbvUSDAddr).totalSupply();
        uint256 userAssetBalanceBefore = asset.balanceOf(userA);

        // safe needs to approve zapper to pull USDC
        vm.startPrank(vaultSafe);
        asset.approve(zapperAddr, withdrawAmount);

        vm.startPrank(userA);
        IERC20(sbvUSDAddr).approve(zapperAddr, withdrawAmount);
        uint256 assetOut = zapper.unstakeAndWithdraw(withdrawAmount);

        vm.stopPrank();

        // safe sent asset to user
        assertEq(asset.balanceOf(vaultSafe), safeAssetBalanceBefore - assetOut, "Safe asset balance");

        // user received asset
        assertEq(asset.balanceOf(userA), userAssetBalanceBefore + assetOut, "User asset balance");

        // unstaked bvUSD is burned
        assertEq(bvUSD.totalSupply(), bvUSDSupplyBefore - withdrawAmount, "bvUSD supply");

        // sbvUSD is burned 
        assertEq(IERC20(sbvUSDAddr).totalSupply(), sbvUSDSupplyBefore - withdrawAmount, "sbvUSD supply");
    }

    // assumes funds are not available when requesting withdraw and are made available after
    function test_zapAsyncWithdraw() public {
        deal(address(asset), userA, mintAmount);

        // deposit
        _zapDeposit(userA, depositAmount);

        uint256 safeAssetBalanceBefore = asset.balanceOf(vaultSafe);
        uint256 bvUSDSupplyBefore = bvUSD.totalSupply();
        uint256 sbvUSDSupplyBefore = IERC20(sbvUSDAddr).totalSupply();
        uint256 userAssetBalanceBefore = asset.balanceOf(userA);

        // safe needs to approve zapper to pull USDC
        vm.startPrank(vaultSafe);
        asset.approve(zapperAddr, withdrawAmount);

        vm.startPrank(userA);
        IERC20(sbvUSDAddr).approve(zapperAddr, withdrawAmount);
        zapper.requestUnstake(withdrawAmount);
        
        uint256 assetOut = zapper.withdraw();

        vm.stopPrank();

        // safe sent asset to user
        assertEq(asset.balanceOf(vaultSafe), safeAssetBalanceBefore - assetOut, "Safe asset balance");

        // user received asset
        assertEq(asset.balanceOf(userA), userAssetBalanceBefore + assetOut, "User asset balance");

        // unstaked bvUSD is burned
        assertEq(bvUSD.totalSupply(), bvUSDSupplyBefore - withdrawAmount, "bvUSD supply");

        // sbvUSD is burned 
        assertEq(IERC20(sbvUSDAddr).totalSupply(), sbvUSDSupplyBefore - withdrawAmount, "sbvUSD supply");
    }

    function _zapDeposit(address who, uint256 amount) internal returns (uint256 sbvUSDOut) {
        vm.startPrank(who);
        asset.approve(zapperAddr, amount);

        sbvUSDOut = zapper.deposit(amount);
        vm.stopPrank();
    }
}

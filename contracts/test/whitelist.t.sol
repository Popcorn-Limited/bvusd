// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {Whitelist} from "src/Dependencies/Whitelist.sol";

contract WhitelistTest is Test {
    Whitelist public whitelistContract;

    address public owner;
    address public user;
    address public mockContract = address(123345);
    bytes4 public mockFuncSig = bytes4(keccak256("mockFunc()"));
    bytes4 public notWhitelistedFuncSig =
        bytes4(keccak256("notWhitelistedFunc()"));

    function setUp() public {
        owner = makeAddr("owner");
        user = makeAddr("user");

        whitelistContract = new Whitelist(owner);

        vm.prank(owner);
        whitelistContract.addWhitelistedFunc(mockContract, mockFuncSig);
    }

    function test_addWhitelistedFunc() public {
        assertFalse(whitelistContract.isWhitelistedFunc(mockContract, notWhitelistedFuncSig));
        assertTrue(whitelistContract.isWhitelisted(mockContract, notWhitelistedFuncSig, user));

        vm.prank(owner);
        whitelistContract.addWhitelistedFunc(mockContract, notWhitelistedFuncSig);

        assertTrue(whitelistContract.isWhitelistedFunc(mockContract, notWhitelistedFuncSig));
        assertFalse(whitelistContract.isWhitelisted(mockContract, notWhitelistedFuncSig, user));
    }

    function test_removeWhitelistedFunc() public {
        test_addWhitelistedFunc();

        vm.prank(owner);
        whitelistContract.removeWhitelistedFunc(mockContract, notWhitelistedFuncSig);

        assertFalse(whitelistContract.isWhitelistedFunc(mockContract, notWhitelistedFuncSig));
        assertTrue(whitelistContract.isWhitelisted(mockContract, notWhitelistedFuncSig, user));
    }

    function test_addWhitelist() public {
        assertFalse(
            whitelistContract.isWhitelisted(mockContract, mockFuncSig, user)
        );

        vm.prank(owner);
        whitelistContract.addToWhitelist(mockContract, mockFuncSig, user);

        assertTrue(
            whitelistContract.isWhitelisted(mockContract, mockFuncSig, user)
        );
    }

    function test_addWhitelist_notWhitelistedFunc() public {
        vm.startPrank(owner);
        vm.expectRevert(Whitelist.FuncNotWhitelisted.selector);
        whitelistContract.addToWhitelist(mockContract, notWhitelistedFuncSig, user);
    }

    function test_removeWhitelist() public {
        assertFalse(
            whitelistContract.isWhitelisted(mockContract, mockFuncSig, user)
        );

        vm.startPrank(owner);
        whitelistContract.addToWhitelist(mockContract, mockFuncSig, user);

        assertTrue(
            whitelistContract.isWhitelisted(mockContract, mockFuncSig, user)
        );

        whitelistContract.removeFromWhitelist(mockContract, mockFuncSig, user);

        assertFalse(
            whitelistContract.isWhitelisted(mockContract, mockFuncSig, user)
        );

        vm.stopPrank();
    }

    function test_addWhitelist_onlyOwner() public {
        vm.startPrank(user);

        vm.expectRevert(bytes("Owned/not-owner"));
        whitelistContract.addToWhitelist(mockContract, mockFuncSig, user);
    }

    function test_removeWhitelist_onlyOwner() public {
        vm.prank(owner);
        whitelistContract.addToWhitelist(mockContract, mockFuncSig, user);

        vm.startPrank(user);
        vm.expectRevert(bytes("Owned/not-owner"));
        whitelistContract.removeFromWhitelist(mockContract, mockFuncSig, user);
    }
}

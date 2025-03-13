// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.24;

import "./DevTestSetup.sol";
import "src/Interfaces/IAddressesRegistry.sol";
import {IWhitelist} from "src/Interfaces/IWhitelist.sol";
import {Whitelist} from "src/Dependencies/Whitelist.sol";
import "forge-std/console.sol";

contract WhitelistTestSetup is DevTestSetup {
    address public owner;
    IWhitelist public whitelist;

    function _setOwner(address _owner) internal {
        owner = _owner;
    }

    function _deployAndSetWhitelist(IAddressesRegistry addressRegistry) internal {
        whitelist = IWhitelist(address(new Whitelist(owner)));
        
        vm.prank(owner);
        addressRegistry.initializeWhitelist(address(whitelist));
    }

    function _addToWhitelist(address who) internal {
        vm.prank(owner);
        whitelist.addToWhitelist(who);
    }
}
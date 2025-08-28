// SPDX-License-Identifier: GPL-3.0
// Docgen-SOLC: 0.8.25
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {TokenLocker, IERC20} from "src/Dependencies/TokenLocker.sol";

contract DeployTokenLocker is Script {
    function run() public returns (address tokenLocker) {
        vm.startBroadcast();
        console.log("msg.sender:", msg.sender);

        tokenLocker = address(
            new TokenLocker(
                msg.sender,
                IERC20(0x876aac7648D79f87245E73316eB2D100e75F3Df1),
                30 days,
                "Locked bvUSD",
                "LbvUSD"
            )
        );

        vm.stopBroadcast();
    }
}

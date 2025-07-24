// SPDX-License-Identifier: GPL-3.0
// Docgen-SOLC: 0.8.25
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {PointsToken} from "src/Dependencies/PointsToken.sol";

contract DeployPointToken is Script {
    function run() public {
        vm.startBroadcast();
        console.log("msg.sender:", msg.sender);

        new PointsToken(msg.sender);

        vm.stopBroadcast();
    }
}

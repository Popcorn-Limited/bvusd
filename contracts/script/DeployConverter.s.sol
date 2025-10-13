// SPDX-License-Identifier: GPL-3.0
// Docgen-SOLC: 0.8.25
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {BoldConverter, Path, IWhitelist, IBoldToken, IERC20Metadata} from "src/Dependencies/BoldConverter.sol";
import {Whitelist} from "src/Dependencies/Whitelist.sol";

contract DeployConverter is Script {
    function run() public returns (BoldConverter converter) {
        vm.startBroadcast();
        console.log("msg.sender:", msg.sender);

        IERC20Metadata[] memory underlyings = new IERC20Metadata[](1);
        Path[] memory paths = new Path[](1);

        // Edit this
        underlyings[0] = IERC20Metadata(
            0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
        ); // usdc
        paths[0] = Path(
            address(0x452DC676b4E377a76B4b3048eB3b511A0F1ec057),
            6,
            0
        );
        address bvUSD = 0x9BC2F611fa2196E097496B722f1CBCDfE2303855;
        address whitelist = 0x788DbB1888a50e97837b9D06Fd70db107b082A12;
        address owner = 0x452DC676b4E377a76B4b3048eB3b511A0F1ec057;

        converter = new BoldConverter(
            underlyings,
            paths,
            bvUSD
        );
        converter.setWhitelist(IWhitelist(whitelist));
        converter.nominateNewOwner(owner);

        vm.stopBroadcast();
    }
}

contract DeployWhitelist is Script {
     function run() public returns (Whitelist whitelist) {
        vm.startBroadcast();
        console.log("msg.sender:", msg.sender);
        address owner = address(0);

        whitelist = new Whitelist(owner);

        vm.stopBroadcast();
    }
}

// SPDX-License-Identifier: GPL-3.0
// Docgen-SOLC: 0.8.25
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {BoldConverter, Path, IWhitelist, IBoldToken, IERC20Metadata} from "src/Dependencies/BoldConverter.sol";

contract DeployConverter is Script {
    function run() public returns (BoldConverter converter) {
        vm.startBroadcast();
        console.log("msg.sender:", msg.sender);

        IERC20Metadata[] memory underlyings = new IERC20Metadata[](1);
        Path[] memory paths = new Path[](1);

        // Edit this
        underlyings[0] = IERC20Metadata(
            0x203A662b0BD271A6ed5a60EdFbd04bFce608FD36
        ); // usdc
        paths[0] = Path(
            address(0x452DC676b4E377a76B4b3048eB3b511A0F1ec057),
            6,
            0
        );
        address bvUSD = 0x876aac7648D79f87245E73316eB2D100e75F3Df1;
        address whitelist = 0x83BBAA022Cca1295a975EC101a073C44Ea336f79;
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

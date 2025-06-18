// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.24;

import "test/Utils/Logging.sol";
import "src/Zappers/StableToVaultZapper.sol";
import {BoldConverter, IBoldToken, IERC20Metadata} from "src/Dependencies/BoldConverter.sol";
import "forge-std/Script.sol";

contract DeployCollateralZapper is Logging, Script { 
    // modify 
    BoldConverter boldConverter = BoldConverter(address(0)); // leave empty to deploy new one
    address vaultAddress = address(0x24E2aE2f4c59b8b7a03772142d439fDF13AAF15b);    
    address bvUSD = address(0x876aac7648D79f87245E73316eB2D100e75F3Df1);
    address deployer; 
 
    function run() external {
        if (vm.envBytes("DEPLOYER").length == 20) {
            // address
            deployer = vm.envAddress("DEPLOYER");
            vm.startBroadcast(deployer);
        } else {
            // private key
            uint256 privateKey = vm.envUint("DEPLOYER");
            deployer = vm.addr(privateKey);
            vm.startBroadcast(privateKey);
        }

        console.log("Deployer:               ", deployer);

        if(address(boldConverter) == address(0)) {
            boldConverter = deployConverter();
        }

        StableToVaultZapper zapper = new StableToVaultZapper(boldConverter, vaultAddress);
        
        console.log("Zapper: ", address(zapper));
        console.log("Converter: ", address(boldConverter));

        vm.stopBroadcast();
    }

    function deployConverter() internal returns (BoldConverter converter) {
        // modify paths
        uint256 numberOfPaths = 1;
    
        address receiver = address(0); // receiver of underlying asset
        uint256 feeAmount = 100; // 10 000 MAX
        IERC20Metadata asset = IERC20Metadata(address()); // deposit asset
        
        BoldConverter.Path[] memory paths = new BoldConverter.Path[](numberOfPaths);
        paths[0] = BoldConverter.Path(receiver, 0, feeAmount);

        IERC20Metadata[] memory assets = new IERC20Metadata[](numberOfPaths);
        assets[0] = asset;

        converter = new BoldConverter(assets, paths, bvUSD);
    }
}

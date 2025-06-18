// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.24;

import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {SafeERC20} from "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20Metadata} from "openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {IERC4626} from "openzeppelin-contracts/contracts/interfaces/IERC4626.sol";
import {BoldConverter, IBoldToken} from "../Dependencies/BoldConverter.sol";
import {IERC7540Deposit, IERC7540Redeem} from "../Interfaces/IERC7540.sol";

interface IVaultSafe {
    function safe() external view returns (address);
}

contract StableToVaultZapper {
    using SafeERC20 for IERC20Metadata;

    BoldConverter private immutable _boldConverter;
    address private immutable sbvUSD;

    constructor(BoldConverter boldConverter, address vault) {
        require(vault != address(0), "Invalid vault");

        _boldConverter = boldConverter;
        sbvUSD = vault;

        // approve vault to pull bold
        IERC20Metadata(address(boldConverter.bvUSD())).approve(
            address(sbvUSD),
            type(uint256).max
        );
    }

    function deposit(
        IERC20Metadata asset,
        uint256 amount
    ) external returns (uint256 shares) {
        require(_boldConverter.isValidPath(asset), "Invalid asset");

        // pull asset
        asset.safeTransferFrom(msg.sender, address(this), amount);

        // approve converter
        asset.safeIncreaseAllowance(address(_boldConverter), amount);

        // exchange for bvUSD
        uint256 boldAmount = _boldConverter.deposit(asset, amount);

        // stake for sbvUSD
        shares = IERC4626(sbvUSD).deposit(boldAmount, msg.sender);
    }
}

// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.24;

import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {SafeERC20} from "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20Metadata} from "openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {IBoldToken} from "../Interfaces/IBoldToken.sol";
import "./Owned.sol";

contract BoldConverter is Owned {
    IERC20Metadata private immutable _underlying;
    uint256 private immutable _underlyingDecimals;

    IBoldToken private immutable _bvUSD;

    uint256 public withdrawalFee;
    address public underlyingReceiver;

    constructor(
        IERC20Metadata underlyingToken, 
        address bvUSD, 
        uint256 fee, 
        address receiver
    ) Owned(msg.sender) {
        _underlying = underlyingToken;
        _underlyingDecimals = underlyingToken.decimals();
        _bvUSD = IBoldToken(bvUSD);

        require(_underlyingDecimals <= 18, "Max 18 underlying decimals");
        require(withdrawalFee <= 10000, "Invalid fee");

        withdrawalFee = fee;
        underlyingReceiver = receiver;
    }

    function underlying() external view returns (IERC20Metadata) {
        return _underlying;
    }

    function bvUSD() external view returns (IBoldToken) {
        return _bvUSD;
    }

    // amount in underlying token decimals
    function deposit(uint256 amount) external returns (uint256 boldAmount) {
        // pull underlying
        SafeERC20.safeTransferFrom(_underlying, msg.sender, underlyingReceiver, amount);

        // scale to 18 decimals 
        boldAmount = amount * 10 ** (18 - _underlyingDecimals);

        // mint bvUSD
        _bvUSD.mint(msg.sender, boldAmount);
    }

    function withdraw(uint256 amount, address receiver) external returns (uint256 assetOut) {
        // burn bvUSD
        _bvUSD.burn(msg.sender, amount);

        // scale amount
        uint256 withdrawalAmount = amount / (10 ** (18 - _underlyingDecimals));

        // scale amount andsubtract fee
        assetOut = withdrawalAmount - (withdrawalAmount * withdrawalFee / 10000);

        SafeERC20.safeTransferFrom(_underlying, underlyingReceiver, receiver, assetOut);
    }

    function setWithdrawalFee(uint256 fee) external onlyOwner {
        withdrawalFee = fee;
    }

    function setUnderlyingReceiver(address receiver) external onlyOwner {
        underlyingReceiver = receiver;
    }
}

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
    IERC20Metadata private immutable _underlying;
    address private immutable sbvUSD;

    struct PendingWithdraw {
        uint256 totalShares;
        uint256 lastRequestTimestamp;
    }

    mapping(address => PendingWithdraw) public userPendingRequest;

    constructor(BoldConverter boldConverter, address vault) {
        _boldConverter = boldConverter;
        _underlying = boldConverter.underlying();
        sbvUSD = vault;

        // approve converter to pull stable
        _underlying.approve(address(boldConverter), type(uint256).max);

        // approve vault to pull bold
        IERC20Metadata(address(boldConverter.bvUSD())).approve(address(sbvUSD), type(uint256).max);
    }

    function deposit(uint256 amount) external returns (uint256 shares) {
        // pull stable
        _underlying.safeTransferFrom(msg.sender, address(this), amount);

        // exchange for bvUSD
        uint256 boldAmount = _boldConverter.deposit(amount);

        // stake for sbvUSD
        shares = IERC4626(sbvUSD).deposit(boldAmount, msg.sender);
    }

    // Instantly unstake and withdraw your assets from sbvUSD
    // require sufficient _underlying allowance from the safe to the zapper
    function unstakeAndWithdraw(uint256 shares) external returns (uint256 assetAmountOut) {
        // pull user sbvUSD
        IERC20Metadata(sbvUSD).safeTransferFrom(msg.sender, address(this), shares);

        // unstake and receive bvUSD
        _requestWithdrawal(shares);

        uint256 bvUSDAmountOut = _fulfillAndRedeem(shares);

        // burn bvUSD and transfer underlying
        assetAmountOut = _boldConverter.withdraw(bvUSDAmountOut, msg.sender);

        // emit ZapUnstake(msg.sender, amount, assetAmountOut);
    }

    // submit a vault unstake request
    function requestUnstake(uint256 shares) external {
        // pull user sbvUSD
        IERC20Metadata(sbvUSD).safeTransferFrom(msg.sender, address(this), shares);

        // store user requestID 
        PendingWithdraw storage withdrawReq = userPendingRequest[msg.sender];
        withdrawReq.totalShares += shares;
        withdrawReq.lastRequestTimestamp = block.timestamp;

        // request vault withdrawal
        _requestWithdrawal(shares);
    }

    // finalize an unstake request by withdrawing assets
    function withdraw() external returns (uint256 assetAmountOut) {
        uint256 shares = userPendingRequest[msg.sender].totalShares;

        require(shares > 0, "Invalid");

        // clear pending requestId
        delete userPendingRequest[msg.sender];

        // fulfill redemption on vault
        uint256 bvUSDOut = _fulfillAndRedeem(shares);

        // burn bvUSD and transfer underlying
       assetAmountOut = _boldConverter.withdraw(bvUSDOut, msg.sender);
    }

    /// @notice Internal function to request a withdrawal from a vault
    function _requestWithdrawal(
        uint256 shares
    ) internal {
        // allow vault to pull shares
        IERC20Metadata(sbvUSD).safeIncreaseAllowance(sbvUSD, shares);

        // request redeem - send shares to vault
        IERC7540Redeem(sbvUSD).requestRedeem(shares, address(this), address(this));
    }

    /// @notice Internal function to fulfill a withdrawal from a vault
    function _fulfillAndRedeem(
        uint256 shares
    ) internal returns (uint256 assets) {
        IERC7540Redeem(sbvUSD).fulfillRedeem(shares, address(this));

        // receive bvUSD
        assets = IERC4626(sbvUSD).redeem(shares, address(this), address(this));
    }
}
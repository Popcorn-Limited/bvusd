// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.24;

import {SafeERC20} from "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "openzeppelin-contracts/contracts/security/ReentrancyGuard.sol";
import {IERC20Metadata} from "openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {IBoldToken} from "../Interfaces/IBoldToken.sol";
import "./Owned.sol";

contract BoldConverter is Owned, ReentrancyGuard {
    uint256 public constant MAX_FEE = 10000;

    IBoldToken public bvUSD;

    struct Path {
        address underlyingReceiver;
        uint256 underlyingDecimals;
        uint256 withdrawalFee;
    }

    mapping(IERC20Metadata => Path) private _underlyingPaths;

    event NewPath(IERC20Metadata indexed underlying);
    event DeletedPath(IERC20Metadata indexed underlying);

    constructor(
        IERC20Metadata[] memory underlyings_,
        Path[] memory paths_,
        address bvUSD_
    ) Owned(msg.sender) {
        _setPaths(underlyings_, paths_);
        bvUSD = IBoldToken(bvUSD_);
    }

    function isValidPath(
        IERC20Metadata underlying
    ) external view returns (bool) {
        return _underlyingPaths[underlying].underlyingReceiver != address(0);
    }

    function getPath(
        IERC20Metadata underlying
    ) external view returns (Path memory path) {
        path = _underlyingPaths[underlying];
    }

    // amount in underlying token decimals
    function deposit(
        IERC20Metadata underlying,
        uint256 amount,
        address to
    ) public nonReentrant returns (uint256 boldAmount) {
        Path memory path = _underlyingPaths[underlying];
        require(path.underlyingReceiver != address(0), "Invalid path");

        // pull underlying
        SafeERC20.safeTransferFrom(
            underlying,
            msg.sender,
            path.underlyingReceiver,
            amount
        );

        // scale to 18 decimals
        boldAmount = amount * 10 ** (18 - path.underlyingDecimals);
        require(boldAmount > 0, "out = 0");

        // mint bvUSD
        bvUSD.mint(to, boldAmount);
    }

    function deposit(
        IERC20Metadata underlying,
        uint256 amount
    ) external returns (uint256 boldAmount) {
        return deposit(underlying, amount, msg.sender);
    }


    function withdraw(
        IERC20Metadata underlying,
        uint256 amount,
        address to
    ) public nonReentrant returns (uint256 underlyingOut) {
        Path memory path = _underlyingPaths[underlying];
        require(path.underlyingReceiver != address(0), "Invalid path");

        // burn bvUSD
        bvUSD.burn(msg.sender, amount);

        // scale amount
        uint256 withdrawalAmount = amount /
            (10 ** (18 - path.underlyingDecimals));

        // scale amount and subtract fee
        underlyingOut =
            withdrawalAmount -
            ((withdrawalAmount * path.withdrawalFee) / MAX_FEE);
        require(underlyingOut > 0, "out = 0");

        // transfer underlyings
        SafeERC20.safeTransferFrom(
            underlying,
            path.underlyingReceiver,
            to,
            underlyingOut
        );
    }

    function withdraw(
        IERC20Metadata underlying,
        uint256 amount
    ) external returns (uint256 underlyingOut) {
        return withdraw(underlying, amount, msg.sender);
    }

    function deletePaths(
        IERC20Metadata[] memory underlyings
    ) external onlyOwner {
        for (uint i = 0; i < underlyings.length; i++) {
            delete _underlyingPaths[underlyings[i]];

            emit DeletedPath(underlyings[i]);
        }
    }

    function setPaths(
        IERC20Metadata[] memory underlyings,
        Path[] memory paths
    ) external onlyOwner {
        _setPaths(underlyings, paths);
    }

    function _setPaths(
        IERC20Metadata[] memory underlyings,
        Path[] memory paths
    ) internal {
        uint256 length = underlyings.length;
        require(length == paths.length, "Invalid length");

        for (uint i = 0; i < length; i++) {
            Path memory path = paths[i];

            require(path.withdrawalFee <= MAX_FEE, "Invalid fee");
            require(path.underlyingReceiver != address(0), "Invalid receiver");

            IERC20Metadata underlying = underlyings[i];

            path.underlyingDecimals = underlying.decimals();
            require(
                path.underlyingDecimals <= 18,
                "Max 18 underlying decimals"
            );

            _underlyingPaths[underlying] = path;

            emit NewPath(underlying);
        }
    }
}

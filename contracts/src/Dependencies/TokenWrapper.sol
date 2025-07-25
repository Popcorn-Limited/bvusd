// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.24;

import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import "openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "openzeppelin-contracts/contracts/security/ReentrancyGuard.sol";

import {ITokenWrapper} from "../Interfaces/ITokenWrapper.sol";

// token wrapper with decimal scaling
contract TokenWrapper is ERC20, ITokenWrapper, ReentrancyGuard {
    IERC20Metadata private immutable _underlying;

    uint256 private immutable _underlyingDecimals;

    constructor(
        IERC20Metadata underlyingToken
    )
        ERC20(
            string(abi.encodePacked("Wrapped ", underlyingToken.name())),
            string(abi.encodePacked("w", underlyingToken.symbol()))
        )
    {
        _underlying = underlyingToken;
        _underlyingDecimals = underlyingToken.decimals();

        require(_underlyingDecimals <= 18, "Max 18 underlying decimals");
    }

    function underlying() external view override returns (IERC20Metadata) {
        return _underlying;
    }

    // amount in underlying token decimals
    function deposit(uint256 amount, address to) public override nonReentrant {
        address sender = msg.sender;
        require(sender != address(this), "Wrapper can't deposit");
        SafeERC20.safeTransferFrom(_underlying, sender, address(this), amount);

        uint256 amountOut = amount * 10 ** (18 - _underlyingDecimals);
        require(amountOut > 0, "out = 0");

        _mint(to, amountOut);
    }

    function deposit(uint256 amount) external override {
        deposit(amount, msg.sender);
    }

    // amount in wrapped token decimals (18)
    function withdraw(uint256 amount, address to) public override nonReentrant {
        address sender = msg.sender;

        _burn(sender, amount);

        uint256 amountOut = amount / 10 ** (18 - _underlyingDecimals);
        require(amountOut > 0, "out = 0");

        SafeERC20.safeTransfer(_underlying, to, amountOut);
    }

    function withdraw(uint256 amount) external override {
        withdraw(amount, msg.sender);
    }
}

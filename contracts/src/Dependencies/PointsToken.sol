// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.24;

import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {Owned} from "src/Dependencies/Owned.sol";

contract PointsToken is ERC20, Owned {
    constructor(address owner) ERC20("BitVault Points token", "BitVaultPoints") Owned(owner) {}

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }
}
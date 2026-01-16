// SPDX-License-Identifier: GPL-3.0
// Docgen-SOLC: 0.8.25

pragma solidity ^0.8.24;

import {Owned} from "./Owned.sol";
import {IWhitelist} from "../Interfaces/IWhitelist.sol";

contract Whitelist is IWhitelist, Owned {
    // calling contract -> funcSig -> whitelisted
    mapping(address => mapping(bytes4 => bool)) public whitelistedFunc;
    // calling contract -> funcSig -> user -> whitelisted
    mapping(address => mapping(bytes4 => mapping(address => bool))) whitelist;

    event WhitelistedFuncAdded(address callingContract, bytes4 funcSig);
    event WhitelistFuncRemoved(
        address callingContract,
        bytes4 funcSig
    );
    event Whitelisted(address callingContract, bytes4 funcSig, address user);
    event WhitelistRemoved(
        address callingContract,
        bytes4 funcSig,
        address user
    );

    error FuncNotWhitelisted();

    constructor(address owner) Owned(owner) {}

    function addWhitelistedFunc(
        address callingContract,
        bytes4 funcSig
    ) external override onlyOwner {
        whitelistedFunc[callingContract][funcSig] = true;

        emit WhitelistedFuncAdded(callingContract, funcSig);
    }

    function removeWhitelistedFunc(
        address callingContract,
        bytes4 funcSig
    ) external override onlyOwner {
        whitelistedFunc[callingContract][funcSig] = false;

        emit WhitelistFuncRemoved(callingContract, funcSig);
    }

    function addToWhitelist(
        address callingContract,
        bytes4 funcSig,
        address user
    ) external override onlyOwner {
        if (!whitelistedFunc[callingContract][funcSig]) {
            revert FuncNotWhitelisted();
        }
        whitelist[callingContract][funcSig][user] = true;

        emit Whitelisted(callingContract, funcSig, user);
    }

    function removeFromWhitelist(
        address callingContract,
        bytes4 funcSig,
        address user
    ) external override onlyOwner {
        whitelist[callingContract][funcSig][user] = false;

        emit WhitelistRemoved(callingContract, funcSig, user);
    }

    function isWhitelisted(
        address callingContract,
        bytes4 funcSig,
        address user
    ) external view override returns (bool) {
        if (!whitelistedFunc[callingContract][funcSig]) {
            return true;
        }
        return whitelist[callingContract][funcSig][user];
    }

    function isWhitelistedFunc(
        address callingContract,
        bytes4 funcSig
    ) external view returns (bool) {
        return whitelistedFunc[callingContract][funcSig];
    }
}

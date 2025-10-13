// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IWhitelist {
    function addWhitelistedFunc(address callingContract, bytes4 funcSig) external;
    function removeWhitelistedFunc(address callingContract, bytes4 funcSig) external;
    function addToWhitelist(address callingContract, bytes4 funcSig, address user) external;
    function removeFromWhitelist(address callingContract, bytes4 funcSig, address user) external;
    function isWhitelisted(address callingContract, bytes4 funcSig, address user) external view returns (bool);
    function isWhitelistedFunc(address callingContract, bytes4 funcSig) external view returns (bool);
}

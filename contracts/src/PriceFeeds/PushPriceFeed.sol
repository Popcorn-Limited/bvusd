// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import "../Dependencies/Owned.sol";

contract PushPriceFeed is Owned {
    
    uint256 public lastGoodPrice;

    constructor(address _owner) Owned(_owner) {}

    function fetchPrice() external returns (uint256, bool) {
        return (lastGoodPrice, false);
    }

    function setPrice(uint256 _price) external onlyOwner {
        lastGoodPrice = _price;
    }
}

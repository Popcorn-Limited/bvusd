/**
 *Submitted for verification at polygonscan.com on 2024-11-01
 */

// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "./Owned.sol";

interface IPoRAddressList {
    /// @notice Get total number of addresses in the list.
    function getPoRAddressListLength() external view returns (uint256);

    /**
     * @notice Get a batch of human-readable addresses from the address list.
     * @dev Due to limitations of gas usage in off-chain calls, we need to support fetching the addresses in batches.
     * EVM addresses need to be converted to human-readable strings. The address strings need to be in the same format
     * that would be used when querying the balance of that address.
     * @param startIndex The index of the first address in the batch.
     * @param endIndex The index of the last address in the batch. If `endIndex > getPoRAddressListLength()-1`,
     * endIndex need to default to `getPoRAddressListLength()-1`. If `endIndex < startIndex`, the result would be an
     * empty array.
     * @return Array of addresses as strings.
     */
    function getPoRAddressList(
        uint256 startIndex,
        uint256 endIndex
    ) external view returns (string[] memory);
}

contract StringPoRAddressList is IPoRAddressList, Owned {
    string[] private addresses;

    constructor() Owned(msg.sender) {}

    function getPoRAddressListLength()
        external
        view
        override
        returns (uint256)
    {
        return addresses.length;
    }

    function getPoRAddressList(
        uint256 startIndex,
        uint256 endIndex
    ) external view override returns (string[] memory) {
        if (startIndex > endIndex) {
            return new string[](0);
        }
        endIndex = endIndex > addresses.length - 1
            ? addresses.length - 1
            : endIndex;
        string[] memory stringAddresses = new string[](
            endIndex - startIndex + 1
        );
        uint256 currIdx = startIndex;
        uint256 strAddrIdx = 0;
        while (currIdx <= endIndex) {
            stringAddresses[strAddrIdx] = addresses[currIdx];
            strAddrIdx++;
            currIdx++;
        }
        return stringAddresses;
    }

    function addAddresses(string[] calldata _addresses) external onlyOwner {
        for (uint256 i = 0; i < _addresses.length; i++) {
            addresses.push(_addresses[i]);
        }
    }

    function removeAddresses(
        uint256[] calldata addressIndexes
    ) external onlyOwner {
        for (uint256 i = 0; i < addressIndexes.length; i++) {
            uint256 indexToRemove = addressIndexes[
                addressIndexes.length - 1 - i
            ];
            require(indexToRemove < addresses.length, "Index out of bounds");
            addresses[indexToRemove] = addresses[addresses.length - 1];
            addresses.pop();
        }
    }
}

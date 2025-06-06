// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import "../Interfaces/IAddressesRegistry.sol";
import "../Interfaces/IBorrowerOperations.sol";
import "../Dependencies/AddRemoveManagers.sol";
import "./LeftoversSweep.sol";
import "./Interfaces/ITokenZapper.sol";

abstract contract BaseCollateralZapper is AddRemoveManagers, LeftoversSweep, ITokenZapper {
    IBorrowerOperations public immutable borrowerOperations;
    ITroveManager public immutable troveManager;
    IERC20 public immutable collateralToken;
    IBoldToken public immutable boldToken;
    IWETH public immutable WETH;

    constructor(IAddressesRegistry _addressesRegistry, IERC20 _collateralToken)
        AddRemoveManagers(_addressesRegistry)
    {
        borrowerOperations = _addressesRegistry.borrowerOperations();
        troveManager = _addressesRegistry.troveManager();
        boldToken = _addressesRegistry.boldToken();
        WETH = _addressesRegistry.WETH();

        collateralToken = _collateralToken;
    }

    function _checkAdjustTroveManagers(
        uint256 _troveId,
        uint256 _collChange,
        bool _isCollIncrease,
        uint256 _boldChange,
        bool _isDebtIncrease
    ) internal view returns (address) {
        address owner = troveNFT.ownerOf(_troveId);
        address receiver = owner;

        if ((!_isCollIncrease && _collChange > 0) || _isDebtIncrease) {
            receiver = _requireSenderIsOwnerOrRemoveManagerAndGetReceiver(_troveId, owner);
        }

        if (_isCollIncrease || (!_isDebtIncrease && _boldChange > 0)) {
            _requireSenderIsOwnerOrAddManager(_troveId, owner);
        }

        return receiver;
    }
}

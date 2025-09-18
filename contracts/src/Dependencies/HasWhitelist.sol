// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.24;
import "../Interfaces/IWhitelist.sol";

abstract contract HasWhitelist {
    IWhitelist public whitelist;

    error NotWhitelisted(address _user);

    function _setWhitelist(IWhitelist _whitelist) internal {
        whitelist = _whitelist;
    }

    function _requireWhitelisted(
        IWhitelist _whitelist,
        bytes4 _funcSig,
        address _user
    ) internal view {
        if (!_whitelist.isWhitelisted(address(this), _funcSig, _user)) {
            revert NotWhitelisted(_user);
        }
    }

    modifier checkWhitelisted(bytes4 _funcSig) {
        IWhitelist _whitelist = whitelist;
        if (address(_whitelist) != address(0)) {
            _requireWhitelisted(_whitelist, _funcSig, msg.sender);
        }
        _;
    }
}

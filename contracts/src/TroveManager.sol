// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";

import "./Interfaces/ITroveManager.sol";
import "./Interfaces/IStabilityPool.sol";
import "./Interfaces/ICollSurplusPool.sol";
import "./Interfaces/IBoldToken.sol";
import "./Interfaces/ISortedTroves.sol";
import "./Interfaces/ITroveEvents.sol";
import "./Dependencies/LiquityBase.sol";
import "./Dependencies/Ownable.sol";

// import "forge-std/console2.sol";

contract TroveManager is ERC721, LiquityBase, Ownable, ITroveManager, ITroveEvents {
    string public constant NAME = "TroveManager"; // TODO
    string public constant SYMBOL = "Lv2T"; // TODO

    // --- Connected contract declarations ---

    address public borrowerOperationsAddress;
    IStabilityPool public override stabilityPool;
    address gasPoolAddress;
    ICollSurplusPool collSurplusPool;
    IBoldToken public override boldToken;
    // A doubly linked list of Troves, sorted by their sorted by their collateral ratios
    ISortedTroves public sortedTroves;
    address public collateralRegistryAddress;

    // --- Data structures ---

    // Minimum collateral ratio for individual troves
    uint256 public immutable MCR;
    // Liquidation penalty for troves offset to the SP
    uint256 public immutable LIQUIDATION_PENALTY_SP;
    // Liquidation penalty for troves redistributed
    uint256 public immutable LIQUIDATION_PENALTY_REDISTRIBUTION;

    enum Status {
        nonExistent,
        active,
        closedByOwner,
        closedByLiquidation,
        unredeemable
    }

    // Store the necessary data for a trove
    struct Trove {
        uint256 debt;
        uint256 coll;
        uint256 stake;
        Status status;
        uint64 arrayIndex;
        uint64 lastDebtUpdateTime;
        uint64 lastInterestRateAdjTime;
        uint256 annualInterestRate;
    }
    // TODO: optimize this struct packing for gas reduction, which may break v1 tests that assume a certain order of properties

    mapping(uint256 => Trove) public Troves;

    uint256 public totalStakes;

    // Snapshot of the value of totalStakes, taken immediately after the latest liquidation
    uint256 public totalStakesSnapshot;

    // Snapshot of the total collateral across the ActivePool and DefaultPool, immediately after the latest liquidation.
    uint256 public totalCollateralSnapshot;

    /*
    * L_ETH and L_boldDebt track the sums of accumulated liquidation rewards per unit staked. During its lifetime, each stake earns:
    *
    * An ETH gain of ( stake * [L_ETH - L_ETH(0)] )
    * A boldDebt increase  of ( stake * [L_boldDebt - L_boldDebt(0)] )
    *
    * Where L_ETH(0) and L_boldDebt(0) are snapshots of L_ETH and L_boldDebt for the active Trove taken at the instant the stake was made
    */
    uint256 public L_ETH;
    uint256 public L_boldDebt;

    // Map addresses with active troves to their RewardSnapshot
    mapping(uint256 => RewardSnapshot) public rewardSnapshots;

    // Object containing the ETH and Bold snapshots for a given active trove
    struct RewardSnapshot {
        uint256 ETH;
        uint256 boldDebt;
    }

    // Array of all active trove addresses - used to to compute an approximate hint off-chain, for the sorted list insertion
    uint256[] public TroveIds;

    // Error trackers for the trove redistribution calculation
    uint256 public lastETHError_Redistribution;
    uint256 public lastBoldDebtError_Redistribution;

    /*
    * --- Variable container structs for liquidations ---
    *
    * These structs are used to hold, return and assign variables inside the liquidation functions,
    * in order to avoid the error: "CompilerError: Stack too deep".
    **/

    struct LocalVariables_LiquidationSequence {
        uint256 remainingBoldInStabPool;
        uint256 i;
        uint256 ICR;
        uint256 troveId;
        uint256 entireSystemDebt;
        uint256 entireSystemColl;
    }

    struct LiquidationValues {
        LatestTroveData trove;
        uint256 collGasCompensation;
        uint256 debtToOffset;
        uint256 collToSendToSP;
        uint256 debtToRedistribute;
        uint256 collToRedistribute;
        uint256 collSurplus;
    }

    struct LiquidationTotals {
        TroveChange troveChange;
        uint256 totalCollGasCompensation;
        uint256 totalBoldGasCompensation;
        uint256 totalDebtToOffset;
        uint256 totalCollToSendToSP;
        uint256 totalDebtToRedistribute;
        uint256 totalCollToRedistribute;
        uint256 totalCollSurplus;
    }

    struct ContractsCache {
        IActivePool activePool;
        IDefaultPool defaultPool;
        IBoldToken boldToken;
        ISortedTroves sortedTroves;
        ICollSurplusPool collSurplusPool;
        address gasPoolAddress;
    }

    // --- Variable container structs for redemptions ---

    struct RedemptionTotals {
        TroveChange troveChange;
        uint256 ETHFee;
    }

    struct SingleRedemptionValues {
        uint256 BoldLot;
        uint256 ETHLot;
        uint256 ETHFee;
        uint256 appliedRedistBoldDebtGain;
        uint256 oldWeightedRecordedDebt;
        uint256 newWeightedRecordedDebt;
    }

    // --- Events ---

    event BorrowerOperationsAddressChanged(address _newBorrowerOperationsAddress);
    event PriceFeedAddressChanged(address _newPriceFeedAddress);
    event BoldTokenAddressChanged(address _newBoldTokenAddress);
    event ActivePoolAddressChanged(address _activePoolAddress);
    event DefaultPoolAddressChanged(address _defaultPoolAddress);
    event StabilityPoolAddressChanged(address _stabilityPoolAddress);
    event GasPoolAddressChanged(address _gasPoolAddress);
    event CollSurplusPoolAddressChanged(address _collSurplusPoolAddress);
    event SortedTrovesAddressChanged(address _sortedTrovesAddress);
    event CollateralRegistryAddressChanged(address _collateralRegistryAddress);

    constructor(uint256 _mcr, uint256 _liquidationPenaltySP, uint256 _liquidationPenaltyRedistribution)
        ERC721(NAME, SYMBOL)
    {
        require(_mcr > 1e18 && _mcr < 2e18, "Invalid MCR");
        require(_liquidationPenaltySP >= 5e16, "SP penalty too low");
        require(_liquidationPenaltySP <= _liquidationPenaltyRedistribution, "SP penalty cannot be > redist");
        require(_liquidationPenaltyRedistribution <= 10e16, "Redistribution penalty too high");

        MCR = _mcr;
        LIQUIDATION_PENALTY_SP = _liquidationPenaltySP;
        LIQUIDATION_PENALTY_REDISTRIBUTION = _liquidationPenaltyRedistribution;
    }

    // --- Dependency setter ---

    function setAddresses(
        address _borrowerOperationsAddress,
        address _activePoolAddress,
        address _defaultPoolAddress,
        address _stabilityPoolAddress,
        address _gasPoolAddress,
        address _collSurplusPoolAddress,
        address _priceFeedAddress,
        address _boldTokenAddress,
        address _sortedTrovesAddress
    ) external override onlyOwner {
        borrowerOperationsAddress = _borrowerOperationsAddress;
        activePool = IActivePool(_activePoolAddress);
        defaultPool = IDefaultPool(_defaultPoolAddress);
        stabilityPool = IStabilityPool(_stabilityPoolAddress);
        gasPoolAddress = _gasPoolAddress;
        collSurplusPool = ICollSurplusPool(_collSurplusPoolAddress);
        priceFeed = IPriceFeed(_priceFeedAddress);
        boldToken = IBoldToken(_boldTokenAddress);
        sortedTroves = ISortedTroves(_sortedTrovesAddress);

        emit BorrowerOperationsAddressChanged(_borrowerOperationsAddress);
        emit ActivePoolAddressChanged(_activePoolAddress);
        emit DefaultPoolAddressChanged(_defaultPoolAddress);
        emit StabilityPoolAddressChanged(_stabilityPoolAddress);
        emit GasPoolAddressChanged(_gasPoolAddress);
        emit CollSurplusPoolAddressChanged(_collSurplusPoolAddress);
        emit PriceFeedAddressChanged(_priceFeedAddress);
        emit BoldTokenAddressChanged(_boldTokenAddress);
        emit SortedTrovesAddressChanged(_sortedTrovesAddress);
    }

    function setCollateralRegistry(address _collateralRegistryAddress) external override onlyOwner {
        collateralRegistryAddress = _collateralRegistryAddress;
        emit CollateralRegistryAddressChanged(_collateralRegistryAddress);

        _renounceOwnership();
    }

    // --- Getters ---

    function getTroveIdsCount() external view override returns (uint256) {
        return TroveIds.length;
    }

    function getTroveFromTroveIdsArray(uint256 _index) external view override returns (uint256) {
        return TroveIds[_index];
    }

    // --- Trove Liquidation functions ---

    // Single liquidation function. Closes the trove if its ICR is lower than the minimum collateral ratio.
    function liquidate(uint256 _troveId) external override {
        _requireTroveIsOpen(_troveId);

        uint256[] memory troves = new uint256[](1);
        troves[0] = _troveId;
        batchLiquidateTroves(troves);
    }

    // --- Inner single liquidation functions ---

    // Liquidate one trove
    function _liquidate(
        IDefaultPool _defaultPool,
        uint256 _troveId,
        uint256 _boldInStabPool,
        uint256 _price,
        LiquidationValues memory singleLiquidation
    ) internal {
        address owner = ownerOf(_troveId);

        _getLatestTroveData(_troveId, singleLiquidation.trove);

        _movePendingTroveRewardsToActivePool(
            _defaultPool, singleLiquidation.trove.redistBoldDebtGain, singleLiquidation.trove.redistETHGain
        );

        singleLiquidation.collGasCompensation = _getCollGasCompensation(singleLiquidation.trove.entireColl);
        // console2.log(singleLiquidation.collGasCompensation, "singleLiquidation.collGasCompensation");
        uint256 collToLiquidate = singleLiquidation.trove.entireColl - singleLiquidation.collGasCompensation;
        // console2.log(collToLiquidate, "collToLiquidate");

        (
            singleLiquidation.debtToOffset,
            singleLiquidation.collToSendToSP,
            singleLiquidation.debtToRedistribute,
            singleLiquidation.collToRedistribute,
            singleLiquidation.collSurplus
        ) = _getOffsetAndRedistributionVals(
            singleLiquidation.trove.entireDebt, collToLiquidate, _boldInStabPool, _price
        );

        _closeTrove(_troveId, Status.closedByLiquidation);
        // console2.log(singleLiquidation.collSurplus, "singleLiquidation.collSurplus");
        // Differencen between liquidation penalty and liquidation threshold
        if (singleLiquidation.collSurplus > 0) {
            collSurplusPool.accountSurplus(owner, singleLiquidation.collSurplus);
        }

        emit TroveUpdated(
            _troveId,
            0, // _debt
            0, // _coll
            0, // _stake
            0, // _annualInterestRate
            0, // _snapshotOfTotalDebtRedist
            0 // _snapshotOfTotalCollRedist
        );

        emit TroveOperation(
            _troveId,
            Operation.liquidate,
            0, // _annualInterestRate
            singleLiquidation.trove.redistBoldDebtGain,
            0, // _debtIncreaseFromUpfrontFee
            -int256(singleLiquidation.trove.entireDebt),
            singleLiquidation.trove.redistETHGain,
            -int256(singleLiquidation.trove.entireColl)
        );
    }

    /* In a full liquidation, returns the values for a trove's coll and debt to be offset, and coll and debt to be
    * redistributed to active troves.
    */
    function _getOffsetAndRedistributionVals(
        uint256 _entireTroveDebt,
        uint256 _collToLiquidate, // gas compensation is already subtracted
        uint256 _boldInStabPool,
        uint256 _price
    )
        internal
        view
        returns (
            uint256 debtToOffset,
            uint256 collToSendToSP,
            uint256 debtToRedistribute,
            uint256 collToRedistribute,
            uint256 collSurplus
        )
    {
        uint256 collSPPortion;
        /*
         * Offset as much debt & collateral as possible against the Stability Pool, and redistribute the remainder
         * between all active troves.
         *
         *  If the trove's debt is larger than the deposited Bold in the Stability Pool:
         *
         *  - Offset an amount of the trove's debt equal to the Bold in the Stability Pool
         *  - Send a fraction of the trove's collateral to the Stability Pool, equal to the fraction of its offset debt
         *
         */
        if (_boldInStabPool > 0) {
            debtToOffset = LiquityMath._min(_entireTroveDebt, _boldInStabPool);
            collSPPortion = _collToLiquidate * debtToOffset / _entireTroveDebt;
            (collToSendToSP, collSurplus) =
                _getCollPenaltyAndSurplus(collSPPortion, debtToOffset, LIQUIDATION_PENALTY_SP, _price);
        }
        // TODO: this fails if debt in gwei is less than price (rounding coll to zero)
        //assert(debtToOffset == 0 || collToSendToSP > 0);

        // Redistribution
        debtToRedistribute = _entireTroveDebt - debtToOffset;
        if (debtToRedistribute > 0) {
            uint256 collRedistributionPortion = _collToLiquidate - collSPPortion;
            if (collRedistributionPortion > 0) {
                (collToRedistribute, collSurplus) = _getCollPenaltyAndSurplus(
                    collRedistributionPortion + collSurplus, // Coll surplus from offset can be eaten up by red. penalty
                    debtToRedistribute,
                    LIQUIDATION_PENALTY_REDISTRIBUTION, // _penaltyRatio
                    _price
                );
            }
        }
        assert(_collToLiquidate == collToSendToSP + collToRedistribute + collSurplus);
    }

    function _getCollPenaltyAndSurplus(
        uint256 _collToLiquidate,
        uint256 _debtToLiquidate,
        uint256 _penaltyRatio,
        uint256 _price
    ) internal pure returns (uint256 seizedColl, uint256 collSurplus) {
        uint256 maxSeizedColl = _debtToLiquidate * (DECIMAL_PRECISION + _penaltyRatio) / _price;
        // console2.log(_price, "tm::_price");
        // console2.log(maxSeizedColl, "maxSeizedColl");
        // console2.log(_debtToLiquidate, "_debtToLiquidate");
        // console2.log(_penaltyRatio, "_penaltyRatio");
        if (_collToLiquidate > maxSeizedColl) {
            seizedColl = maxSeizedColl;
            collSurplus = _collToLiquidate - maxSeizedColl;
        } else {
            seizedColl = _collToLiquidate;
            collSurplus = 0;
        }
        //  console2.log(seizedColl, "tm::seizedColl");
    }

    /*
     * Attempt to liquidate a custom list of troves provided by the caller.
     */
    function batchLiquidateTroves(uint256[] memory _troveArray) public override {
        require(_troveArray.length != 0, "TroveManager: Calldata address array must not be empty");

        IActivePool activePoolCached = activePool;
        IDefaultPool defaultPoolCached = defaultPool;
        IStabilityPool stabilityPoolCached = stabilityPool;

        LiquidationTotals memory totals;

        uint256 price = priceFeed.fetchPrice();
        uint256 boldInStabPool = stabilityPoolCached.getTotalBoldDeposits();

        // Perform the appropriate liquidation sequence - tally values and obtain their totals.
        _batchLiquidateTroves(defaultPoolCached, price, boldInStabPool, _troveArray, totals);

        require(totals.troveChange.debtDecrease > 0, "TroveManager: nothing to liquidate");

        activePool.mintAggInterestAndAccountForTroveChange(totals.troveChange);

        // Move liquidated ETH and Bold to the appropriate pools
        if (totals.totalDebtToOffset > 0 || totals.totalCollToSendToSP > 0) {
            stabilityPoolCached.offset(totals.totalDebtToOffset, totals.totalCollToSendToSP);
        }
        // we check amount is not zero inside
        _redistributeDebtAndColl(
            activePoolCached, defaultPoolCached, totals.totalDebtToRedistribute, totals.totalCollToRedistribute
        );
        if (totals.totalCollSurplus > 0) {
            activePoolCached.sendETH(address(collSurplusPool), totals.totalCollSurplus);
        }

        // Update system snapshots
        _updateSystemSnapshots_excludeCollRemainder(activePoolCached, totals.totalCollGasCompensation);

        emit Liquidation(
            totals.totalDebtToOffset,
            totals.totalDebtToRedistribute,
            totals.totalBoldGasCompensation,
            totals.totalCollGasCompensation,
            totals.totalCollToSendToSP,
            totals.totalCollToRedistribute,
            totals.totalCollSurplus,
            L_ETH,
            L_boldDebt,
            price
        );

        // Send gas compensation to caller
        _sendGasCompensation(
            activePoolCached, msg.sender, totals.totalBoldGasCompensation, totals.totalCollGasCompensation
        );
    }

    function _isLiquidatableStatus(Status _status) internal pure returns (bool) {
        return _status == Status.active || _status == Status.unredeemable;
    }

    function _batchLiquidateTroves(
        IDefaultPool _defaultPool,
        uint256 _price,
        uint256 _boldInStabPool,
        uint256[] memory _troveArray,
        LiquidationTotals memory totals
    ) internal {
        LocalVariables_LiquidationSequence memory vars;

        vars.remainingBoldInStabPool = _boldInStabPool;

        for (vars.i = 0; vars.i < _troveArray.length; vars.i++) {
            vars.troveId = _troveArray[vars.i];

            // Skip non-liquidatable troves
            if (!_isLiquidatableStatus(Troves[vars.troveId].status)) continue;

            vars.ICR = getCurrentICR(vars.troveId, _price);

            if (vars.ICR < MCR) {
                LiquidationValues memory singleLiquidation;

                _liquidate(_defaultPool, vars.troveId, vars.remainingBoldInStabPool, _price, singleLiquidation);
                vars.remainingBoldInStabPool -= singleLiquidation.debtToOffset;

                // Add liquidation values to their respective running totals
                _addLiquidationValuesToTotals(totals, singleLiquidation);
            }
        }
    }

    // --- Liquidation helper functions ---

    // Adds all values from `singleLiquidation` to their respective totals in `totals` in-place
    function _addLiquidationValuesToTotals(LiquidationTotals memory totals, LiquidationValues memory singleLiquidation)
        internal
        pure
    {
        // Tally all the values with their respective running totals
        totals.totalCollGasCompensation += singleLiquidation.collGasCompensation;
        totals.totalBoldGasCompensation += BOLD_GAS_COMPENSATION;
        totals.troveChange.debtDecrease += singleLiquidation.trove.entireDebt;
        totals.troveChange.collDecrease += singleLiquidation.trove.entireColl;
        totals.troveChange.appliedRedistBoldDebtGain += singleLiquidation.trove.redistBoldDebtGain;
        totals.troveChange.oldWeightedRecordedDebt += singleLiquidation.trove.weightedRecordedDebt;
        totals.totalDebtToOffset += singleLiquidation.debtToOffset;
        totals.totalCollToSendToSP += singleLiquidation.collToSendToSP;
        totals.totalDebtToRedistribute += singleLiquidation.debtToRedistribute;
        totals.totalCollToRedistribute += singleLiquidation.collToRedistribute;
        totals.totalCollSurplus += singleLiquidation.collSurplus;
    }

    function _sendGasCompensation(IActivePool _activePool, address _liquidator, uint256 _bold, uint256 _ETH) internal {
        if (_bold > 0) {
            boldToken.returnFromPool(gasPoolAddress, _liquidator, _bold);
        }

        if (_ETH > 0) {
            _activePool.sendETH(_liquidator, _ETH);
        }
    }

    // Move a Trove's pending debt and collateral rewards from distributions, from the Default Pool to the Active Pool
    function _movePendingTroveRewardsToActivePool(IDefaultPool _defaultPool, uint256 _bold, uint256 _ETH) internal {
        if (_bold > 0) {
            _defaultPool.decreaseBoldDebt(_bold);
        }

        if (_ETH > 0) {
            _defaultPool.sendETHToActivePool(_ETH);
        }
    }

    // --- Redemption functions ---

    // Redeem as much collateral as possible from _borrower's Trove in exchange for Bold up to _maxBoldamount
    function _redeemCollateralFromTrove(
        ContractsCache memory _contractsCache,
        uint256 _troveId,
        uint256 _maxBoldamount,
        uint256 _price,
        uint256 _redemptionRate,
        SingleRedemptionValues memory singleRedemption
    ) internal {
        LatestTroveData memory trove;
        _getLatestTroveData(_troveId, trove);

        // Determine the remaining amount (lot) to be redeemed, capped by the entire debt of the Trove minus the liquidation reserve
        singleRedemption.BoldLot = LiquityMath._min(_maxBoldamount, trove.entireDebt - BOLD_GAS_COMPENSATION);

        // Get the amount of ETH equal in USD value to the BoldLot redeemed
        uint256 correspondingETH = singleRedemption.BoldLot * DECIMAL_PRECISION / _price;
        // Calculate the ETHFee separately (for events)
        singleRedemption.ETHFee = correspondingETH * _redemptionRate / DECIMAL_PRECISION;
        // Get the final ETHLot to send to redeemer, leaving the fee in the Trove
        singleRedemption.ETHLot = correspondingETH - singleRedemption.ETHFee;

        // Decrease the debt and collateral of the current Trove according to the Bold lot and corresponding ETH to send
        uint256 newDebt = trove.entireDebt - singleRedemption.BoldLot;
        uint256 newColl = trove.entireColl - singleRedemption.ETHLot;

        singleRedemption.appliedRedistBoldDebtGain = trove.redistBoldDebtGain;
        singleRedemption.oldWeightedRecordedDebt = trove.weightedRecordedDebt;
        singleRedemption.newWeightedRecordedDebt = newDebt * trove.annualInterestRate;

        if (newDebt < MIN_DEBT) {
            Troves[_troveId].status = Status.unredeemable;
            sortedTroves.remove(_troveId);
            // TODO: should we also remove from the Troves array? Seems unneccessary as it's only used for off-chain hints.
            // We save borrowers gas by not removing
        }

        Troves[_troveId].debt = newDebt;
        Troves[_troveId].coll = newColl;
        Troves[_troveId].lastDebtUpdateTime = uint64(block.timestamp);

        // TODO: Gas optimize? We update totalStakes N times for a sequence of N Troves(!).
        uint256 newStake = _updateStakeAndTotalStakes(_troveId, newColl);
        // TODO: Gas optimize? We move pending rewards N times for a sequence of N Troves(!).
        _movePendingTroveRewardsToActivePool(_contractsCache.defaultPool, trove.redistBoldDebtGain, trove.redistETHGain);
        _updateTroveRewardSnapshots(_troveId);

        emit TroveUpdated(_troveId, newDebt, newColl, newStake, trove.annualInterestRate, L_ETH, L_boldDebt);

        emit TroveOperation(
            _troveId,
            Operation.redeemCollateral,
            trove.annualInterestRate,
            trove.redistBoldDebtGain,
            0, // _debtIncreaseFromUpfrontFee
            -int256(singleRedemption.BoldLot),
            trove.redistETHGain,
            -int256(singleRedemption.ETHLot)
        );

        emit RedemptionFeePaidToTrove(_troveId, singleRedemption.ETHFee);
    }

    /* Send _boldamount Bold to the system and redeem the corresponding amount of collateral from as many Troves as are needed to fill the redemption
    * request.  Applies redistribution gains to a Trove before reducing its debt and coll.
    *
    * Note that if _amount is very large, this function can run out of gas, specially if traversed troves are small. This can be easily avoided by
    * splitting the total _amount in appropriate chunks and calling the function multiple times.
    *
    * Param `_maxIterations` can also be provided, so the loop through Troves is capped (if it’s zero, it will be ignored).This makes it easier to
    * avoid OOG for the frontend, as only knowing approximately the average cost of an iteration is enough, without needing to know the “topology”
    * of the trove list. It also avoids the need to set the cap in stone in the contract, nor doing gas calculations, as both gas price and opcode
    * costs can vary.
    *
    * All Troves that are redeemed from -- with the likely exception of the last one -- will end up with no debt left, therefore they will be closed.
    * If the last Trove does have some remaining debt, it has a finite ICR, and the reinsertion could be anywhere in the list, therefore it requires a hint.
    * A frontend should use getRedemptionHints() to calculate what the ICR of this Trove will be after redemption, and pass a hint for its position
    * in the sortedTroves list along with the ICR value that the hint was found for.
    *
    * If another transaction modifies the list between calling getRedemptionHints() and passing the hints to redeemCollateral(), it
    * is very likely that the last (partially) redeemed Trove would end up with a different ICR than what the hint is for. In this case the
    * redemption will stop after the last completely redeemed Trove and the sender will keep the remaining Bold amount, which they can attempt
    * to redeem later.
    */
    function redeemCollateral(
        address _sender,
        uint256 _boldamount,
        uint256 _price,
        uint256 _redemptionRate,
        uint256 _maxIterations
    ) external override returns (uint256 _redemeedAmount) {
        _requireIsCollateralRegistry();

        ContractsCache memory contractsCache =
            ContractsCache(activePool, defaultPool, boldToken, sortedTroves, collSurplusPool, gasPoolAddress);
        RedemptionTotals memory totals;

        uint256 remainingBold = _boldamount;
        uint256 currentTroveId;

        currentTroveId = contractsCache.sortedTroves.getLast();

        // Loop through the Troves starting from the one with lowest collateral ratio until _amount of Bold is exchanged for collateral
        if (_maxIterations == 0) _maxIterations = type(uint256).max;
        while (currentTroveId != 0 && remainingBold > 0 && _maxIterations > 0) {
            _maxIterations--;
            // Save the uint256 of the Trove preceding the current one
            uint256 nextUserToCheck = contractsCache.sortedTroves.getPrev(currentTroveId);
            // Skip if ICR < 100%, to make sure that redemptions always improve the CR of hit Troves
            if (getCurrentICR(currentTroveId, _price) < _100pct) {
                currentTroveId = nextUserToCheck;
                continue;
            }

            SingleRedemptionValues memory singleRedemption;
            _redeemCollateralFromTrove(
                contractsCache, currentTroveId, remainingBold, _price, _redemptionRate, singleRedemption
            );

            totals.troveChange.collDecrease += singleRedemption.ETHLot;
            totals.troveChange.debtDecrease += singleRedemption.BoldLot;
            totals.troveChange.appliedRedistBoldDebtGain += singleRedemption.appliedRedistBoldDebtGain;
            // For recorded and weighted recorded debt totals, we need to capture the increases and decreases,
            // since the net debt change for a given Trove could be positive or negative: redemptions decrease a Trove's recorded
            // (and weighted recorded) debt, but the accrued interest increases it.
            totals.troveChange.newWeightedRecordedDebt += singleRedemption.newWeightedRecordedDebt;
            totals.troveChange.oldWeightedRecordedDebt += singleRedemption.oldWeightedRecordedDebt;
            totals.ETHFee += singleRedemption.ETHFee;

            remainingBold -= singleRedemption.BoldLot;
            currentTroveId = nextUserToCheck;
        }

        // We are removing this condition to prevent blocking redemptions
        //require(totals.totalETHDrawn > 0, "TroveManager: Unable to redeem any amount");

        emit Redemption(
            _boldamount, totals.troveChange.debtDecrease, totals.troveChange.collDecrease, totals.ETHFee, _price
        );

        activePool.mintAggInterestAndAccountForTroveChange(totals.troveChange);

        // Send the redeemed ETH to sender
        contractsCache.activePool.sendETH(_sender, totals.troveChange.collDecrease);
        // We’ll burn all the Bold together out in the CollateralRegistry, to save gas

        return totals.troveChange.debtDecrease;
    }

    // --- Helper functions ---

    // Return the current collateral ratio (ICR) of a given Trove. Takes a trove's pending coll and debt rewards from redistributions into account.
    function getCurrentICR(uint256 _troveId, uint256 _price) public view override returns (uint256) {
        LatestTroveData memory trove;
        _getLatestTroveData(_troveId, trove);
        return LiquityMath._computeCR(trove.entireColl, trove.entireDebt, _price);
    }

    function _updateTroveRewardSnapshots(uint256 _troveId) internal {
        rewardSnapshots[_troveId].ETH = L_ETH;
        rewardSnapshots[_troveId].boldDebt = L_boldDebt;
    }

    // Get the borrower's pending accumulated ETH reward, earned by their stake
    function getPendingETHReward(uint256 _troveId) external view override returns (uint256 redistETHGain) {
        LatestTroveData memory trove;
        _getLatestTroveData(_troveId, trove);
        return trove.redistETHGain;
    }

    // Get the borrower's pending accumulated Bold reward, earned by their stake
    function getPendingBoldDebtReward(uint256 _troveId) external view override returns (uint256 redistBoldDebtGain) {
        LatestTroveData memory trove;
        _getLatestTroveData(_troveId, trove);
        return trove.redistBoldDebtGain;
    }

    function hasRedistributionGains(uint256 _troveId) external view override returns (bool) {
        /*
        * A Trove has redistribution gains if its snapshot is less than the current rewards per-unit-staked sum:
        * this indicates that rewards have occured since the snapshot was made, and the user therefore has
        * redistribution gains
        */
        if (!checkTroveIsOpen(_troveId)) return false;

        return (rewardSnapshots[_troveId].ETH < L_ETH);
    }

    // Return the Troves entire debt and coll, including redistribution gains from redistributions.
    function _getLatestTroveData(uint256 _troveId, LatestTroveData memory trove) internal view {
        uint256 stake = Troves[_troveId].stake;
        trove.redistBoldDebtGain = stake * (L_boldDebt - rewardSnapshots[_troveId].boldDebt) / DECIMAL_PRECISION;
        trove.redistETHGain = stake * (L_ETH - rewardSnapshots[_troveId].ETH) / DECIMAL_PRECISION;

        trove.recordedDebt = Troves[_troveId].debt;
        trove.annualInterestRate = Troves[_troveId].annualInterestRate;
        trove.weightedRecordedDebt = trove.recordedDebt * trove.annualInterestRate;
        trove.accruedInterest =
            _calcInterest(trove.weightedRecordedDebt, block.timestamp - Troves[_troveId].lastDebtUpdateTime);

        trove.entireDebt = trove.recordedDebt + trove.redistBoldDebtGain + trove.accruedInterest;
        trove.entireColl = Troves[_troveId].coll + trove.redistETHGain;
        trove.lastInterestRateAdjTime = Troves[_troveId].lastInterestRateAdjTime;
    }

    function getLatestTroveData(uint256 _troveId) external view returns (LatestTroveData memory trove) {
        _getLatestTroveData(_troveId, trove);
    }

    function getEntireDebtAndColl(uint256 _troveId)
        external
        view
        returns (
            uint256 entireDebt,
            uint256 entireColl,
            uint256 pendingBoldDebtReward,
            uint256 pendingETHReward,
            uint256 accruedTroveInterest
        )
    {
        LatestTroveData memory trove;
        _getLatestTroveData(_troveId, trove);

        return
            (trove.entireDebt, trove.entireColl, trove.redistBoldDebtGain, trove.redistETHGain, trove.accruedInterest);
    }

    function getTroveEntireDebt(uint256 _troveId) public view returns (uint256) {
        LatestTroveData memory trove;
        _getLatestTroveData(_troveId, trove);
        return trove.entireDebt;
    }

    function getTroveEntireColl(uint256 _troveId) external view returns (uint256) {
        LatestTroveData memory trove;
        _getLatestTroveData(_troveId, trove);
        return trove.entireColl;
    }

    // Update borrower's stake based on their latest collateral value
    function _updateStakeAndTotalStakes(uint256 _troveId, uint256 _coll) internal returns (uint256 newStake) {
        newStake = _computeNewStake(_coll);
        uint256 oldStake = Troves[_troveId].stake;
        Troves[_troveId].stake = newStake;

        totalStakes = totalStakes - oldStake + newStake;
    }

    // Calculate a new stake based on the snapshots of the totalStakes and totalCollateral taken at the last liquidation
    function _computeNewStake(uint256 _coll) internal view returns (uint256) {
        uint256 stake;
        if (totalCollateralSnapshot == 0) {
            stake = _coll;
        } else {
            /*
            * The following assert() holds true because:
            * - The system always contains >= 1 trove
            * - When we close or liquidate a trove, we redistribute the redistribution gains, so if all troves were closed/liquidated,
            * rewards would’ve been emptied and totalCollateralSnapshot would be zero too.
            */
            assert(totalStakesSnapshot > 0);
            stake = _coll * totalStakesSnapshot / totalCollateralSnapshot;
        }
        return stake;
    }

    function _redistributeDebtAndColl(
        IActivePool _activePool,
        IDefaultPool _defaultPool,
        uint256 _debtToRedistribute,
        uint256 _collToRedistribute
    ) internal {
        if (_debtToRedistribute == 0) return;

        /*
        * Add distributed coll and debt rewards-per-unit-staked to the running totals. Division uses a "feedback"
        * error correction, to keep the cumulative error low in the running totals L_ETH and L_boldDebt:
        *
        * 1) Form numerators which compensate for the floor division errors that occurred the last time this
        * function was called.
        * 2) Calculate "per-unit-staked" ratios.
        * 3) Multiply each ratio back by its denominator, to reveal the current floor division error.
        * 4) Store these errors for use in the next correction when this function is called.
        * 5) Note: static analysis tools complain about this "division before multiplication", however, it is intended.
        */
        uint256 ETHNumerator = _collToRedistribute * DECIMAL_PRECISION + lastETHError_Redistribution;
        uint256 boldDebtNumerator = _debtToRedistribute * DECIMAL_PRECISION + lastBoldDebtError_Redistribution;

        // Get the per-unit-staked terms
        uint256 ETHRewardPerUnitStaked = ETHNumerator / totalStakes;
        uint256 boldDebtRewardPerUnitStaked = boldDebtNumerator / totalStakes;

        lastETHError_Redistribution = ETHNumerator - ETHRewardPerUnitStaked * totalStakes;
        lastBoldDebtError_Redistribution = boldDebtNumerator - boldDebtRewardPerUnitStaked * totalStakes;

        // Add per-unit-staked terms to the running totals
        L_ETH = L_ETH + ETHRewardPerUnitStaked;
        L_boldDebt = L_boldDebt + boldDebtRewardPerUnitStaked;

        _defaultPool.increaseBoldDebt(_debtToRedistribute);
        _activePool.sendETHToDefaultPool(_collToRedistribute);
    }

    function onCloseTrove(uint256 _troveId, TroveChange calldata _troveChange) external override {
        _requireCallerIsBorrowerOperations();
        _closeTrove(_troveId, Status.closedByOwner);
        _movePendingTroveRewardsToActivePool(
            defaultPool, _troveChange.appliedRedistBoldDebtGain, _troveChange.appliedRedistETHGain
        );

        emit TroveUpdated(
            _troveId,
            0, // _debt
            0, // _coll
            0, // _stake
            0, // _annualInterestRate
            0, // _snapshotOfTotalDebtRedist
            0 // _snapshotOfTotalCollRedist
        );

        emit TroveOperation(
            _troveId,
            Operation.closeTrove,
            0, // _annualInterestRate
            _troveChange.appliedRedistBoldDebtGain,
            _troveChange.upfrontFee,
            int256(_troveChange.debtIncrease) - int256(_troveChange.debtDecrease),
            _troveChange.appliedRedistETHGain,
            int256(_troveChange.collIncrease) - int256(_troveChange.collDecrease)
        );
    }

    function _closeTrove(uint256 _troveId, Status closedStatus) internal {
        assert(closedStatus == Status.closedByLiquidation || closedStatus == Status.closedByOwner);

        uint256 TroveIdsArrayLength = TroveIds.length;
        _requireMoreThanOneTroveInSystem(TroveIdsArrayLength);

        _removeTroveId(_troveId, TroveIdsArrayLength);

        if (Troves[_troveId].status == Status.active) {
            sortedTroves.remove(_troveId);
        }

        uint256 newTotalStakes = totalStakes - Troves[_troveId].stake;
        totalStakes = newTotalStakes;

        // Zero Trove properties
        delete Troves[_troveId];
        Troves[_troveId].status = closedStatus;

        // Zero Trove snapshots
        delete rewardSnapshots[_troveId];

        // burn ERC721
        // TODO: Should we do it?
        _burn(_troveId);
    }

    /*
    * Updates snapshots of system total stakes and total collateral, excluding a given collateral remainder from the calculation.
    * Used in a liquidation sequence.
    *
    * The calculation excludes a portion of collateral that is in the ActivePool:
    *
    * the total ETH gas compensation from the liquidation sequence
    *
    * The ETH as compensation must be excluded as it is always sent out at the very end of the liquidation sequence.
    */
    function _updateSystemSnapshots_excludeCollRemainder(IActivePool _activePool, uint256 _collRemainder) internal {
        totalStakesSnapshot = totalStakes;

        uint256 activeColl = _activePool.getETHBalance();
        uint256 liquidatedColl = defaultPool.getETHBalance();
        totalCollateralSnapshot = activeColl - _collRemainder + liquidatedColl;
    }

    /*
    * Remove a Trove owner from the TroveIds array, not preserving array order. Removing owner 'B' does the following:
    * [A B C D E] => [A E C D], and updates E's Trove struct to point to its new array index.
    */
    function _removeTroveId(uint256 _troveId, uint256 TroveIdsArrayLength) internal {
        uint64 index = Troves[_troveId].arrayIndex;
        uint256 idxLast = TroveIdsArrayLength - 1;

        assert(index <= idxLast);

        uint256 idToMove = TroveIds[idxLast];

        TroveIds[index] = idToMove;
        Troves[idToMove].arrayIndex = index;

        TroveIds.pop();
    }

    // --- TCR functions ---

    function getTCR(uint256 _price) external view override returns (uint256) {
        return _getTCR(_price);
    }

    function checkBelowCriticalThreshold(uint256 _price) external view override returns (bool) {
        return _checkBelowCriticalThreshold(_price);
    }

    function checkTroveIsOpen(uint256 _troveId) public view returns (bool) {
        Status status = Troves[_troveId].status;
        return status == Status.active || status == Status.unredeemable;
    }

    function checkTroveIsActive(uint256 _troveId) external view returns (bool) {
        Status status = Troves[_troveId].status;
        return status == Status.active;
    }

    function checkTroveIsUnredeemable(uint256 _troveId) external view returns (bool) {
        Status status = Troves[_troveId].status;
        return status == Status.unredeemable;
    }

    // --- Interest rate calculations ---

    // TODO: analyze precision loss in interest functions and decide upon the minimum granularity
    // (per-second, per-block, etc)
    function calcTroveAccruedInterest(uint256 _troveId) public view returns (uint256) {
        uint256 recordedDebt = Troves[_troveId].debt;
        // convert annual interest to per-second and multiply by the principal
        uint256 annualInterestRate = Troves[_troveId].annualInterestRate;
        uint256 lastDebtUpdateTime = Troves[_troveId].lastDebtUpdateTime;

        return _calcInterest(recordedDebt * annualInterestRate, (block.timestamp - lastDebtUpdateTime));
    }

    // --- 'require' wrapper functions ---

    function _requireCallerIsBorrowerOperations() internal view {
        require(msg.sender == borrowerOperationsAddress, "TroveManager: Caller is not the BorrowerOperations contract");
    }

    function _requireIsCollateralRegistry() internal view {
        require(msg.sender == collateralRegistryAddress, "TroveManager: Caller is not the CollateralRegistry contract");
    }

    function _requireTroveIsOpen(uint256 _troveId) internal view {
        require(checkTroveIsOpen(_troveId), "TroveManager: Trove does not exist or is closed");
    }

    function _requireMoreThanOneTroveInSystem(uint256 TroveIdsArrayLength) internal view {
        require(TroveIdsArrayLength > 1 && sortedTroves.getSize() > 1, "TroveManager: Only one trove in the system");
    }

    // --- Trove property getters ---

    function getTroveStatus(uint256 _troveId) external view override returns (uint256) {
        return uint256(Troves[_troveId].status);
    }

    function getTroveStake(uint256 _troveId) external view override returns (uint256) {
        return Troves[_troveId].stake;
    }

    function getTroveDebt(uint256 _troveId) external view override returns (uint256) {
        return Troves[_troveId].debt;
    }

    function getTroveWeightedRecordedDebt(uint256 _troveId) public view returns (uint256) {
        return Troves[_troveId].debt * Troves[_troveId].annualInterestRate;
    }

    function getTroveColl(uint256 _troveId) external view override returns (uint256) {
        return Troves[_troveId].coll;
    }

    function getTroveAnnualInterestRate(uint256 _troveId) external view returns (uint256) {
        return Troves[_troveId].annualInterestRate;
    }

    function getTroveLastDebtUpdateTime(uint256 _troveId) external view returns (uint256) {
        return Troves[_troveId].lastDebtUpdateTime;
    }

    function troveIsStale(uint256 _troveId) external view returns (bool) {
        return block.timestamp - Troves[_troveId].lastDebtUpdateTime > STALE_TROVE_DURATION;
    }

    function getUnbackedPortionPriceAndRedeemability() external returns (uint256, uint256, bool) {
        uint256 totalDebt = getEntireSystemDebt();
        uint256 spSize = stabilityPool.getTotalBoldDeposits();
        uint256 unbackedPortion = totalDebt > spSize ? totalDebt - spSize : 0;

        uint256 price = priceFeed.fetchPrice();
        bool redeemable = _getTCR(price) >= _100pct;

        return (unbackedPortion, price, redeemable);
    }

    // --- Trove property setters, called by BorrowerOperations ---

    function onOpenTrove(
        address _owner,
        uint256 _troveId,
        uint256 _coll,
        uint256 _debt,
        uint256 _annualInterestRate,
        uint256 _upfrontFee
    ) external {
        _requireCallerIsBorrowerOperations();

        uint256 newStake = _computeNewStake(_coll);

        // Trove memory newTrove;
        Troves[_troveId].debt = _debt;
        Troves[_troveId].coll = _coll;
        Troves[_troveId].stake = newStake;
        Troves[_troveId].status = Status.active;
        Troves[_troveId].arrayIndex = uint64(TroveIds.length);
        Troves[_troveId].lastDebtUpdateTime = uint64(block.timestamp);
        Troves[_troveId].lastInterestRateAdjTime = uint64(block.timestamp);
        Troves[_troveId].annualInterestRate = _annualInterestRate;

        // Push the trove's id to the Trove list
        TroveIds.push(_troveId);

        uint256 newTotalStakes = totalStakes + newStake;
        totalStakes = newTotalStakes;

        // mint ERC721
        _mint(_owner, _troveId);

        _updateTroveRewardSnapshots(_troveId);

        emit TroveUpdated(_troveId, _debt, _coll, newStake, _annualInterestRate, L_ETH, L_boldDebt);

        emit TroveOperation(
            _troveId,
            Operation.openTrove,
            _annualInterestRate,
            0, // _debtIncreaseFromRedist
            _upfrontFee,
            int256(_debt - _upfrontFee),
            0, // _collIncreaseFromRedist
            int256(_coll)
        );
    }

    function setTroveStatusToActive(uint256 _troveId) external {
        _requireCallerIsBorrowerOperations();
        Troves[_troveId].status = Status.active;
    }

    function onAdjustTroveInterestRate(
        uint256 _troveId,
        uint256 _newColl,
        uint256 _newDebt,
        uint256 _newAnnualInterestRate,
        TroveChange calldata _troveChange
    ) external {
        _requireCallerIsBorrowerOperations();

        Troves[_troveId].coll = _newColl;
        Troves[_troveId].debt = _newDebt;
        Troves[_troveId].annualInterestRate = _newAnnualInterestRate;
        Troves[_troveId].lastDebtUpdateTime = uint64(block.timestamp);
        Troves[_troveId].lastInterestRateAdjTime = uint64(block.timestamp);

        _movePendingTroveRewardsToActivePool(
            defaultPool, _troveChange.appliedRedistBoldDebtGain, _troveChange.appliedRedistETHGain
        );

        _updateTroveRewardSnapshots(_troveId);

        emit TroveUpdated(
            _troveId, _newDebt, _newColl, Troves[_troveId].stake, _newAnnualInterestRate, L_ETH, L_boldDebt
        );

        emit TroveOperation(
            _troveId,
            Operation.adjustTroveInterestRate,
            _newAnnualInterestRate,
            _troveChange.appliedRedistBoldDebtGain,
            _troveChange.upfrontFee,
            int256(_troveChange.debtIncrease) - int256(_troveChange.debtDecrease),
            _troveChange.appliedRedistETHGain,
            int256(_troveChange.collIncrease) - int256(_troveChange.collDecrease)
        );
    }

    function onAdjustTrove(uint256 _troveId, uint256 _newColl, uint256 _newDebt, TroveChange calldata _troveChange)
        external
    {
        _requireCallerIsBorrowerOperations();

        Troves[_troveId].coll = _newColl;
        Troves[_troveId].debt = _newDebt;
        Troves[_troveId].lastDebtUpdateTime = uint64(block.timestamp);

        _movePendingTroveRewardsToActivePool(
            defaultPool, _troveChange.appliedRedistBoldDebtGain, _troveChange.appliedRedistETHGain
        );

        uint256 newStake = _updateStakeAndTotalStakes(_troveId, _newColl);
        _updateTroveRewardSnapshots(_troveId);

        emit TroveUpdated(
            _troveId, _newDebt, _newColl, newStake, Troves[_troveId].annualInterestRate, L_ETH, L_boldDebt
        );

        emit TroveOperation(
            _troveId,
            Operation.adjustTrove,
            Troves[_troveId].annualInterestRate,
            _troveChange.appliedRedistBoldDebtGain,
            _troveChange.upfrontFee,
            int256(_troveChange.debtIncrease) - int256(_troveChange.debtDecrease),
            _troveChange.appliedRedistETHGain,
            int256(_troveChange.collIncrease) - int256(_troveChange.collDecrease)
        );
    }

    function onApplyTroveInterest(
        uint256 _troveId,
        uint256 _newColl,
        uint256 _newDebt,
        TroveChange calldata _troveChange
    ) external {
        _requireCallerIsBorrowerOperations();

        Troves[_troveId].coll = _newColl;
        Troves[_troveId].debt = _newDebt;
        Troves[_troveId].lastDebtUpdateTime = uint64(block.timestamp);

        _movePendingTroveRewardsToActivePool(
            defaultPool, _troveChange.appliedRedistBoldDebtGain, _troveChange.appliedRedistETHGain
        );

        _updateTroveRewardSnapshots(_troveId);

        emit TroveUpdated(
            _troveId, _newDebt, _newColl, Troves[_troveId].stake, Troves[_troveId].annualInterestRate, L_ETH, L_boldDebt
        );

        emit TroveOperation(
            _troveId,
            Operation.applyTroveInterestPermissionless,
            Troves[_troveId].annualInterestRate,
            _troveChange.appliedRedistBoldDebtGain,
            _troveChange.upfrontFee,
            int256(_troveChange.debtIncrease) - int256(_troveChange.debtDecrease),
            _troveChange.appliedRedistETHGain,
            int256(_troveChange.collIncrease) - int256(_troveChange.collDecrease)
        );
    }
}

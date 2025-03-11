// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.24;

import {StdCheats} from "forge-std/StdCheats.sol";
import {IERC20Metadata} from "openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {Strings} from "openzeppelin-contracts/contracts/utils/Strings.sol";
import {IERC20 as IERC20_GOV} from "openzeppelin/contracts/token/ERC20/IERC20.sol";

import {StringFormatting} from "test/Utils/StringFormatting.sol";
import {Accounts} from "test/TestContracts/Accounts.sol";
import {ERC20Faucet} from "test/TestContracts/ERC20Faucet.sol";
import {ETH_GAS_COMPENSATION} from "src/Dependencies/Constants.sol";
import {IBorrowerOperations} from "src/Interfaces/IBorrowerOperations.sol";
import "src/AddressesRegistry.sol";
import "src/ActivePool.sol";
import "src/BoldToken.sol";
import "src/BorrowerOperations.sol";
import "src/TroveManager.sol";
import "src/TroveNFT.sol";
import "src/CollSurplusPool.sol";
import "src/DefaultPool.sol";
import "src/GasPool.sol";
import "src/HintHelpers.sol";
import "src/MultiTroveGetter.sol";
import "src/SortedTroves.sol";
import "src/StabilityPool.sol";
import "src/PriceFeeds/WETHPriceFeed.sol";
import "src/PriceFeeds/WSTETHPriceFeed.sol";
import "src/PriceFeeds/RETHPriceFeed.sol";
import "src/CollateralRegistry.sol";
import "test/TestContracts/PriceFeedTestnet.sol";
import "test/TestContracts/MetadataDeployment.sol";
import "test/Utils/Logging.sol";
import "test/Utils/StringEquality.sol";
import "src/Zappers/WETHZapper.sol";
import "src/Zappers/GasCompZapper.sol";
import "src/Zappers/LeverageLSTZapper.sol";
import "src/Zappers/LeverageWETHZapper.sol";
import "src/Zappers/Modules/Exchanges/HybridCurveUniV3ExchangeHelpers.sol";
import {BalancerFlashLoan} from "src/Zappers/Modules/FlashLoans/BalancerFlashLoan.sol";
import "src/Zappers/Modules/Exchanges/Curve/ICurveStableswapNGFactory.sol";
import "src/Zappers/Modules/Exchanges/UniswapV3/ISwapRouter.sol";
import "src/Zappers/Modules/Exchanges/UniswapV3/IQuoterV2.sol";
import "src/Zappers/Modules/Exchanges/UniswapV3/IUniswapV3Pool.sol";
import "src/Zappers/Modules/Exchanges/UniswapV3/IUniswapV3Factory.sol";
import "src/Zappers/Modules/Exchanges/UniswapV3/INonfungiblePositionManager.sol";
import "src/Zappers/Modules/Exchanges/UniswapV3/UniPriceConverter.sol";
import "src/Zappers/Modules/Exchanges/HybridCurveUniV3Exchange.sol";
import {WETHTester} from "test/TestContracts/WETHTester.sol";
import "forge-std/console2.sol";
import {IRateProvider, IWeightedPool, IWeightedPoolFactory} from "./Interfaces/Balancer/IWeightedPool.sol";
import {IVault} from "./Interfaces/Balancer/IVault.sol";
import {MockStakingV1} from "V2-gov/test/mocks/MockStakingV1.sol";

import {DeployGovernance} from "./DeployGovernance.s.sol";

function _latestUTCMidnightBetweenWednesdayAndThursday()
    view
    returns (uint256)
{
    return (block.timestamp / 1 weeks) * 1 weeks;
}

contract DeployLiquity2ArbiScript is
    DeployGovernance,
    UniPriceConverter,
    StdCheats,
    MetadataDeployment,
    Logging
{
    using Strings for *;
    using StringFormatting for *;
    using StringEquality for string;

    string constant DEPLOYMENT_MODE_COMPLETE = "complete";
    string constant DEPLOYMENT_MODE_BOLD_ONLY = "bold-only";
    string constant DEPLOYMENT_MODE_USE_EXISTING_BOLD = "use-existing-bold";

    address WETH_ADDRESS = 0x82aF49447D8a07e3bd95BD0d56f35241523fBab1;
    address USDC_ADDRESS = 0xaf88d065e77c8cC2239327C5EDb3A432268e5831;

    // used for gas compensation and as collateral of the first branch
    // tapping disallowed
    IWETH WETH = IWETH(WETH_ADDRESS);
    IERC20Metadata USDC = IERC20Metadata(USDC_ADDRESS);
    address WSTETH_ADDRESS = 0x0fBcbaEA96Ce0cF7Ee00A8c19c3ab6f5Dc8E1921;
    address ETH_ORACLE_ADDRESS = 0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612;
    address STETH_ORACLE_ADDRESS = 0xb523AE262D20A936BC152e6023996e46FDC2A95D;
    uint256 ETH_USD_STALENESS_THRESHOLD = 24 hours;
    uint256 STETH_USD_STALENESS_THRESHOLD = 24 hours;

    // Curve
    ICurveStableswapNGFactory curveStableswapFactory =
        ICurveStableswapNGFactory(0x9AF14D26075f142eb3F292D5065EB3faa646167b);
    // https://docs.curve.fi/deployments/amm/#stableswap-ng
    uint128 constant BOLD_TOKEN_INDEX = 0;
    uint128 constant OTHER_TOKEN_INDEX = 1;

    // Uni V3
    uint24 constant UNIV3_FEE = 0.3e4;
    uint24 constant UNIV3_FEE_USDC_WETH = 500; // 0.05%
    uint24 constant UNIV3_FEE_WETH_COLL = 100; // 0.01%
    ISwapRouter uniV3Router =
        ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);
    IQuoterV2 uniV3Quoter =
        IQuoterV2(0x61fFE014bA17989E743c5F6cB21bF9697530B21e);
    IUniswapV3Factory uniswapV3Factory =
        IUniswapV3Factory(0x1F98431c8aD98523631AE4a59f267346ea31F984);
    INonfungiblePositionManager uniV3PositionManager =
        INonfungiblePositionManager(0xC36442b4a4522E871399CD717aBDD847Ab11FE88);
    // https://docs.uniswap.org/contracts/v3/reference/deployments/ethereum-deployments

    // Balancer
    IVault constant balancerVault =
        IVault(0xbA1333333333a1BA1108E8412f11850A5C319bA9);
    IWeightedPoolFactory balancerFactory =
        IWeightedPoolFactory(0xD961E30156C2E0D0d925A0De45f931CB7815e970);

    bytes32 SALT;
    address deployer;
    bool useTestnetPriceFeeds;

    uint256 lastTroveIndex;

    struct LiquityContracts {
        IAddressesRegistry addressesRegistry;
        IActivePool activePool;
        IBorrowerOperations borrowerOperations;
        ICollSurplusPool collSurplusPool;
        IDefaultPool defaultPool;
        ISortedTroves sortedTroves;
        IStabilityPool stabilityPool;
        ITroveManager troveManager;
        ITroveNFT troveNFT;
        MetadataNFT metadataNFT;
        IPriceFeed priceFeed;
        GasPool gasPool;
        IInterestRouter interestRouter;
        IERC20Metadata collToken;
        WETHZapper wethZapper;
        GasCompZapper gasCompZapper;
        ILeverageZapper leverageZapper;
    }

    struct LiquityContractAddresses {
        address activePool;
        address borrowerOperations;
        address collSurplusPool;
        address defaultPool;
        address sortedTroves;
        address stabilityPool;
        address troveManager;
        address troveNFT;
        address metadataNFT;
        address priceFeed;
        address gasPool;
        address interestRouter;
    }

    struct Zappers {
        WETHZapper wethZapper;
        GasCompZapper gasCompZapper;
    }

    struct TroveManagerParams {
        uint256 CCR;
        uint256 MCR;
        uint256 SCR;
        uint256 LIQUIDATION_PENALTY_SP;
        uint256 LIQUIDATION_PENALTY_REDISTRIBUTION;
    }

    struct DeploymentVars {
        uint256 numCollaterals;
        IERC20Metadata[] collaterals;
        IPriceFeed[] priceFeeds;
        IAddressesRegistry[] addressesRegistries;
        ITroveManager[] troveManagers;
        LiquityContracts contracts;
        bytes bytecode;
        address boldTokenAddress;
        uint256 i;
    }

    struct DemoTroveParams {
        uint256 collIndex;
        uint256 owner;
        uint256 ownerIndex;
        uint256 coll;
        uint256 debt;
        uint256 annualInterestRate;
    }

    struct DeploymentResult {
        LiquityContracts[] contractsArray;
        ICollateralRegistry collateralRegistry;
        IBoldToken boldToken;
        ICurveStableswapNGPool usdcCurvePool;
        HintHelpers hintHelpers;
        MultiTroveGetter multiTroveGetter;
        IExchangeHelpers exchangeHelpers;
    }

    function run() external {
        string memory saltStr = vm.envOr("SALT", block.timestamp.toString());
        SALT = keccak256(bytes(saltStr));
        vm.startBroadcast();
        deployer = msg.sender;

        string memory deploymentMode = DEPLOYMENT_MODE_COMPLETE;

        uint256 epochStart = block.chainid == 31337
            ? 1
            : vm.envOr(
                "EPOCH_START",
                (
                    block.chainid == 42161
                        ? _latestUTCMidnightBetweenWednesdayAndThursday()
                        : block.timestamp
                ) - EPOCH_DURATION
            );
        useTestnetPriceFeeds = vm.envOr("USE_TESTNET_PRICEFEEDS", false);

        _log("Deployer:               ", deployer.toHexString());
        _log("Deployer balance:       ", deployer.balance.decimal());
        _log("Deployment mode:        ", deploymentMode);
        _log(
            "CREATE2 salt:           ",
            'keccak256(bytes("',
            saltStr,
            '")) = ',
            uint256(SALT).toHexString()
        );
        _log("Governance epoch start: ", epochStart.toString());
        _log("Use testnet PriceFeeds: ", useTestnetPriceFeeds ? "yes" : "no");

        // Deploy Bold or pick up existing deployment
        BoldToken boldToken = new BoldToken{salt: SALT}(deployer);
        address boldAddress = address(boldToken);
        console.log("BOLD TOKEN: ", boldAddress);

        TroveManagerParams[]
            memory troveManagerParamsArray = new TroveManagerParams[](1);

        // WETH
        troveManagerParamsArray[0] = TroveManagerParams({
            CCR: CCR_WETH,
            MCR: MCR_WETH,
            SCR: SCR_WETH,
            LIQUIDATION_PENALTY_SP: LIQUIDATION_PENALTY_SP_WETH,
            LIQUIDATION_PENALTY_REDISTRIBUTION: LIQUIDATION_PENALTY_REDISTRIBUTION_WETH
        });

        DeploymentResult memory deployed = _deployAndConnectContracts(
            troveManagerParamsArray,
            deployer,
            boldAddress
        );

        vm.stopBroadcast();
    }

    // See: https://solidity-by-example.org/app/create2/
    function getBytecode(
        bytes memory _creationCode,
        address _addressesRegistry
    ) public pure returns (bytes memory) {
        return abi.encodePacked(_creationCode, abi.encode(_addressesRegistry));
    }

    function _deployAndConnectContracts(
        TroveManagerParams[] memory troveManagerParamsArray,
        address _deployer,
        address _bold
    ) internal returns (DeploymentResult memory r) {
        DeploymentVars memory vars;
        vars.numCollaterals = troveManagerParamsArray.length;
        r.boldToken = BoldToken(_bold);

        // USDC and USDC-BOLD pool
        r.usdcCurvePool = _deployCurvePool(r.boldToken, USDC);
        console.log("CURVE POOL: ", address(r.usdcCurvePool));

        r.contractsArray = new LiquityContracts[](vars.numCollaterals);
        vars.collaterals = new IERC20Metadata[](vars.numCollaterals);
        vars.priceFeeds = new IPriceFeed[](vars.numCollaterals);
        vars.addressesRegistries = new IAddressesRegistry[](
            vars.numCollaterals
        );
        vars.troveManagers = new ITroveManager[](vars.numCollaterals);

        // arbitrum
        // ETH
        vars.collaterals[0] = IERC20Metadata(WETH_ADDRESS);
        vars.priceFeeds[0] = new WETHPriceFeed(
            deployer,
            ETH_ORACLE_ADDRESS,
            ETH_USD_STALENESS_THRESHOLD
        );
        console.log("WETH PRICE FEED: ", address(vars.priceFeeds[0]));

        // Deploy AddressesRegistries and get TroveManager addresses
        for (vars.i = 0; vars.i < vars.numCollaterals; vars.i++) {
            (
                IAddressesRegistry addressesRegistry,
                address troveManagerAddress
            ) = _deployAddressesRegistry(troveManagerParamsArray[vars.i]);
            vars.addressesRegistries[vars.i] = addressesRegistry;
            vars.troveManagers[vars.i] = ITroveManager(troveManagerAddress);
            console.log("TROVE MANAGER: ", troveManagerAddress);
            console.log("ADDRESS REGISTRY: ", address(addressesRegistry));
        }

        r.collateralRegistry = new CollateralRegistry(
            r.boldToken,
            vars.collaterals,
            vars.troveManagers
        );
        console.log("COLLATERAL REGISTRY: ", address(r.collateralRegistry));
        r.hintHelpers = new HintHelpers(r.collateralRegistry);
        console.log("HINT HELPERS: ", address(r.hintHelpers));
        r.multiTroveGetter = new MultiTroveGetter(r.collateralRegistry);
        console.log("MULTI TROVE GETTER: ", address(r.multiTroveGetter));

        // Deploy per-branch contracts for each branch
        for (vars.i = 0; vars.i < vars.numCollaterals; vars.i++) {
            vars.contracts = _deployAndConnectCollateralContracts(
                vars.collaterals[vars.i],
                vars.priceFeeds[vars.i],
                r.boldToken,
                r.collateralRegistry,
                r.usdcCurvePool,
                vars.addressesRegistries[vars.i],
                address(vars.troveManagers[vars.i]),
                r.hintHelpers,
                r.multiTroveGetter,
                _deployer
            );
            r.contractsArray[vars.i] = vars.contracts;
        }

        r.boldToken.setCollateralRegistry(address(r.collateralRegistry));

        // exchange helpers
        r.exchangeHelpers = new HybridCurveUniV3ExchangeHelpers(
            USDC,
            WETH,
            r.usdcCurvePool,
            OTHER_TOKEN_INDEX, // USDC Curve pool index
            BOLD_TOKEN_INDEX, // BOLD Curve pool index
            UNIV3_FEE_USDC_WETH,
            UNIV3_FEE_WETH_COLL,
            uniV3Quoter
        );
        console.log("EXCHANGE HELPERS: ", address(r.exchangeHelpers));
    }

    function _deployAddressesRegistry(
        TroveManagerParams memory _troveManagerParams
    ) internal returns (IAddressesRegistry, address) {
        IAddressesRegistry addressesRegistry = new AddressesRegistry(
            deployer,
            _troveManagerParams.CCR,
            _troveManagerParams.MCR,
            _troveManagerParams.SCR,
            _troveManagerParams.LIQUIDATION_PENALTY_SP,
            _troveManagerParams.LIQUIDATION_PENALTY_REDISTRIBUTION
        );
        address troveManagerAddress = vm.computeCreate2Address(
            SALT,
            keccak256(
                getBytecode(
                    type(TroveManager).creationCode,
                    address(addressesRegistry)
                )
            )
        );

        return (addressesRegistry, troveManagerAddress);
    }

    function _deployAndConnectCollateralContracts(
        IERC20Metadata _collToken,
        IPriceFeed _priceFeed,
        IBoldToken _boldToken,
        ICollateralRegistry _collateralRegistry,
        ICurveStableswapNGPool _usdcCurvePool,
        IAddressesRegistry _addressesRegistry,
        address _troveManagerAddress,
        IHintHelpers _hintHelpers,
        IMultiTroveGetter _multiTroveGetter,
        address _governance
    ) internal returns (LiquityContracts memory contracts) {
        LiquityContractAddresses memory addresses;
        contracts.collToken = _collToken;

        // Deploy all contracts, using testers for TM and PriceFeed
        contracts.addressesRegistry = _addressesRegistry;

        // Deploy Metadata
        contracts.metadataNFT = deployMetadata(SALT);
        addresses.metadataNFT = vm.computeCreate2Address(
            SALT,
            keccak256(
                getBytecode(
                    type(MetadataNFT).creationCode,
                    address(initializedFixedAssetReader)
                )
            )
        );
        console.log("METADATA NFT: ", address(contracts.metadataNFT));
        assert(address(contracts.metadataNFT) == addresses.metadataNFT);

        contracts.priceFeed = _priceFeed;
        contracts.interestRouter = IInterestRouter(_governance);
        console.log("INTEREST ROUTER: ", address(contracts.interestRouter));
        addresses.borrowerOperations = vm.computeCreate2Address(
            SALT,
            keccak256(
                getBytecode(
                    type(BorrowerOperations).creationCode,
                    address(contracts.addressesRegistry)
                )
            )
        );
        console.log("BORROWER OPERATIONS: ", addresses.borrowerOperations);
        addresses.troveManager = _troveManagerAddress;
        addresses.troveNFT = vm.computeCreate2Address(
            SALT,
            keccak256(
                getBytecode(
                    type(TroveNFT).creationCode,
                    address(contracts.addressesRegistry)
                )
            )
        );
        addresses.stabilityPool = vm.computeCreate2Address(
            SALT,
            keccak256(
                getBytecode(
                    type(StabilityPool).creationCode,
                    address(contracts.addressesRegistry)
                )
            )
        );
        console.log("STABILITY POOL: ", addresses.stabilityPool);
        addresses.activePool = vm.computeCreate2Address(
            SALT,
            keccak256(
                getBytecode(
                    type(ActivePool).creationCode,
                    address(contracts.addressesRegistry)
                )
            )
        );
        console.log("ACTIVE POOL: ", addresses.activePool);
        addresses.defaultPool = vm.computeCreate2Address(
            SALT,
            keccak256(
                getBytecode(
                    type(DefaultPool).creationCode,
                    address(contracts.addressesRegistry)
                )
            )
        );
        console.log("DEFAULT POOL: ", addresses.defaultPool);
        addresses.gasPool = vm.computeCreate2Address(
            SALT,
            keccak256(
                getBytecode(
                    type(GasPool).creationCode,
                    address(contracts.addressesRegistry)
                )
            )
        );
        console.log("GAS POOL: ", addresses.gasPool);
        addresses.collSurplusPool = vm.computeCreate2Address(
            SALT,
            keccak256(
                getBytecode(
                    type(CollSurplusPool).creationCode,
                    address(contracts.addressesRegistry)
                )
            )
        );
        console.log("COLL SURPLUS POOL: ", addresses.collSurplusPool);
        addresses.sortedTroves = vm.computeCreate2Address(
            SALT,
            keccak256(
                getBytecode(
                    type(SortedTroves).creationCode,
                    address(contracts.addressesRegistry)
                )
            )
        );
        console.log("SORTED TROVES: ", addresses.sortedTroves);
        IAddressesRegistry.AddressVars memory addressVars = IAddressesRegistry
            .AddressVars({
                collToken: _collToken,
                borrowerOperations: IBorrowerOperations(
                    addresses.borrowerOperations
                ),
                troveManager: ITroveManager(addresses.troveManager),
                troveNFT: ITroveNFT(addresses.troveNFT),
                metadataNFT: IMetadataNFT(addresses.metadataNFT),
                stabilityPool: IStabilityPool(addresses.stabilityPool),
                priceFeed: contracts.priceFeed,
                activePool: IActivePool(addresses.activePool),
                defaultPool: IDefaultPool(addresses.defaultPool),
                gasPoolAddress: addresses.gasPool,
                collSurplusPool: ICollSurplusPool(addresses.collSurplusPool),
                sortedTroves: ISortedTroves(addresses.sortedTroves),
                interestRouter: contracts.interestRouter,
                hintHelpers: _hintHelpers,
                multiTroveGetter: _multiTroveGetter,
                collateralRegistry: _collateralRegistry,
                boldToken: _boldToken,
                WETH: WETH
            });
        contracts.addressesRegistry.setAddresses(addressVars);
        contracts.priceFeed.setAddresses(addresses.borrowerOperations);

        contracts.borrowerOperations = new BorrowerOperations{salt: SALT}(
            contracts.addressesRegistry
        );
        contracts.troveManager = new TroveManager{salt: SALT}(
            contracts.addressesRegistry
        );
        contracts.troveNFT = new TroveNFT{salt: SALT}(
            contracts.addressesRegistry
        );
        contracts.stabilityPool = new StabilityPool{salt: SALT}(
            contracts.addressesRegistry
        );
        contracts.activePool = new ActivePool{salt: SALT}(
            contracts.addressesRegistry
        );
        contracts.defaultPool = new DefaultPool{salt: SALT}(
            contracts.addressesRegistry
        );
        contracts.gasPool = new GasPool{salt: SALT}(
            contracts.addressesRegistry
        );
        contracts.collSurplusPool = new CollSurplusPool{salt: SALT}(
            contracts.addressesRegistry
        );
        contracts.sortedTroves = new SortedTroves{salt: SALT}(
            contracts.addressesRegistry
        );

        assert(
            address(contracts.borrowerOperations) ==
                addresses.borrowerOperations
        );
        assert(address(contracts.troveManager) == addresses.troveManager);
        assert(address(contracts.troveNFT) == addresses.troveNFT);
        assert(address(contracts.stabilityPool) == addresses.stabilityPool);
        assert(address(contracts.activePool) == addresses.activePool);
        assert(address(contracts.defaultPool) == addresses.defaultPool);
        assert(address(contracts.gasPool) == addresses.gasPool);
        assert(address(contracts.collSurplusPool) == addresses.collSurplusPool);
        assert(address(contracts.sortedTroves) == addresses.sortedTroves);

        // Connect contracts
        _boldToken.setBranchAddresses(
            address(contracts.troveManager),
            address(contracts.stabilityPool),
            address(contracts.borrowerOperations),
            address(contracts.activePool)
        );

        // deploy zappers
        (
            contracts.gasCompZapper,
            contracts.wethZapper,
            contracts.leverageZapper
        ) = _deployZappers(
            contracts.addressesRegistry,
            contracts.collToken,
            _boldToken,
            _usdcCurvePool
        );
        console.log("GAS COMP ZAPPER: ", address(contracts.gasCompZapper));
        console.log("WETH ZAPPER: ", address(contracts.wethZapper));
        console.log("LEVERAGE ZAPPER: ", address(contracts.leverageZapper));
    }

    function _deployZappers(
        IAddressesRegistry _addressesRegistry,
        IERC20 _collToken,
        IBoldToken _boldToken,
        ICurveStableswapNGPool _usdcCurvePool
    )
        internal
        returns (
            GasCompZapper gasCompZapper,
            WETHZapper wethZapper,
            ILeverageZapper leverageZapper
        )
    {
        IFlashLoanProvider flashLoanProvider = new BalancerFlashLoan();

        IExchange hybridExchange = new HybridCurveUniV3Exchange(
            _collToken,
            _boldToken,
            USDC,
            WETH,
            _usdcCurvePool,
            OTHER_TOKEN_INDEX, // USDC Curve pool index
            BOLD_TOKEN_INDEX, // BOLD Curve pool index
            UNIV3_FEE_USDC_WETH,
            UNIV3_FEE_WETH_COLL,
            uniV3Router
        );

        bool lst = _collToken != WETH;
        if (lst) {
            gasCompZapper = new GasCompZapper(
                _addressesRegistry,
                flashLoanProvider,
                hybridExchange
            );
        } else {
            wethZapper = new WETHZapper(
                _addressesRegistry,
                flashLoanProvider,
                hybridExchange
            );
        }
        leverageZapper = _deployHybridLeverageZapper(
            _addressesRegistry,
            flashLoanProvider,
            hybridExchange,
            lst
        );
    }

    function _deployHybridLeverageZapper(
        IAddressesRegistry _addressesRegistry,
        IFlashLoanProvider _flashLoanProvider,
        IExchange _hybridExchange,
        bool _lst
    ) internal returns (ILeverageZapper) {
        ILeverageZapper leverageZapperHybrid;
        if (_lst) {
            leverageZapperHybrid = new LeverageLSTZapper(
                _addressesRegistry,
                _flashLoanProvider,
                _hybridExchange
            );
        } else {
            leverageZapperHybrid = new LeverageWETHZapper(
                _addressesRegistry,
                _flashLoanProvider,
                _hybridExchange
            );
        }

        return leverageZapperHybrid;
    }

    function _deployCurvePool(
        IBoldToken _boldToken,
        IERC20Metadata _otherToken
    ) internal returns (ICurveStableswapNGPool) {
        // deploy Curve StableswapNG pool
        address[] memory coins = new address[](2);
        coins[BOLD_TOKEN_INDEX] = address(_boldToken);
        coins[OTHER_TOKEN_INDEX] = address(_otherToken);
        uint8[] memory assetTypes = new uint8[](2); // 0: standard
        bytes4[] memory methodIds = new bytes4[](2);
        address[] memory oracles = new address[](2);

        ICurveStableswapNGPool curvePool = curveStableswapFactory
            .deploy_plain_pool({
                name: "BOLD/USDC Pool",
                symbol: "BOLD/USDC",
                coins: coins,
                A: 100,
                fee: 4000000,
                offpeg_fee_multiplier: 20000000000,
                ma_exp_time: 866,
                implementation_id: 0,
                asset_types: assetTypes,
                method_ids: methodIds,
                oracles: oracles
            });

        return curvePool;
    }
}
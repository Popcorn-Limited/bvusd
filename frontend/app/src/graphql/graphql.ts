/* eslint-disable */
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigDecimal: { input: string; output: string; }
  BigInt: { input: bigint; output: bigint; }
  Bytes: { input: string; output: string; }
  /**
   * 8 bytes signed integer
   *
   */
  Int8: { input: number; output: number; }
  /**
   * A string representation of microseconds UNIX timestamp (16 digits)
   *
   */
  Timestamp: { input: string; output: string; }
};

export enum Aggregation_Interval {
  Day = 'day',
  Hour = 'hour'
}

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

export type BorrowerInfo = {
  __typename?: 'BorrowerInfo';
  id: Scalars['ID']['output'];
  nextOwnerIndexes: Array<Scalars['Int']['output']>;
  troves: Scalars['Int']['output'];
  trovesByCollateral: Array<Scalars['Int']['output']>;
};

export type BorrowerInfo_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<BorrowerInfo_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  nextOwnerIndexes?: InputMaybe<Array<Scalars['Int']['input']>>;
  nextOwnerIndexes_contains?: InputMaybe<Array<Scalars['Int']['input']>>;
  nextOwnerIndexes_contains_nocase?: InputMaybe<Array<Scalars['Int']['input']>>;
  nextOwnerIndexes_not?: InputMaybe<Array<Scalars['Int']['input']>>;
  nextOwnerIndexes_not_contains?: InputMaybe<Array<Scalars['Int']['input']>>;
  nextOwnerIndexes_not_contains_nocase?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<BorrowerInfo_Filter>>>;
  troves?: InputMaybe<Scalars['Int']['input']>;
  trovesByCollateral?: InputMaybe<Array<Scalars['Int']['input']>>;
  trovesByCollateral_contains?: InputMaybe<Array<Scalars['Int']['input']>>;
  trovesByCollateral_contains_nocase?: InputMaybe<Array<Scalars['Int']['input']>>;
  trovesByCollateral_not?: InputMaybe<Array<Scalars['Int']['input']>>;
  trovesByCollateral_not_contains?: InputMaybe<Array<Scalars['Int']['input']>>;
  trovesByCollateral_not_contains_nocase?: InputMaybe<Array<Scalars['Int']['input']>>;
  troves_gt?: InputMaybe<Scalars['Int']['input']>;
  troves_gte?: InputMaybe<Scalars['Int']['input']>;
  troves_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  troves_lt?: InputMaybe<Scalars['Int']['input']>;
  troves_lte?: InputMaybe<Scalars['Int']['input']>;
  troves_not?: InputMaybe<Scalars['Int']['input']>;
  troves_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export enum BorrowerInfo_OrderBy {
  Id = 'id',
  NextOwnerIndexes = 'nextOwnerIndexes',
  Troves = 'troves',
  TrovesByCollateral = 'trovesByCollateral'
}

export type CollSurplus = {
  __typename?: 'CollSurplus';
  amount: Scalars['BigInt']['output'];
  id: Scalars['String']['output'];
};

export type CollSurplus_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<CollSurplus_Filter>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<CollSurplus_Filter>>>;
};

export enum CollSurplus_OrderBy {
  Amount = 'amount',
  Id = 'id'
}

export type Collateral = {
  __typename?: 'Collateral';
  addresses: CollateralAddresses;
  collIndex: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  minCollRatio: Scalars['BigInt']['output'];
  stabilityPoolDeposits: Array<StabilityPoolDeposit>;
  token: Token;
  troves: Array<Trove>;
};


export type CollateralStabilityPoolDepositsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<StabilityPoolDeposit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<StabilityPoolDeposit_Filter>;
};


export type CollateralTrovesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Trove_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Trove_Filter>;
};

export type CollateralAddresses = {
  __typename?: 'CollateralAddresses';
  borrowerOperations: Scalars['Bytes']['output'];
  collateral: Collateral;
  id: Scalars['ID']['output'];
  sortedTroves: Scalars['Bytes']['output'];
  stabilityPool: Scalars['Bytes']['output'];
  token: Scalars['Bytes']['output'];
  troveManager: Scalars['Bytes']['output'];
  troveNft: Scalars['Bytes']['output'];
};

export type CollateralAddresses_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<CollateralAddresses_Filter>>>;
  borrowerOperations?: InputMaybe<Scalars['Bytes']['input']>;
  borrowerOperations_contains?: InputMaybe<Scalars['Bytes']['input']>;
  borrowerOperations_gt?: InputMaybe<Scalars['Bytes']['input']>;
  borrowerOperations_gte?: InputMaybe<Scalars['Bytes']['input']>;
  borrowerOperations_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  borrowerOperations_lt?: InputMaybe<Scalars['Bytes']['input']>;
  borrowerOperations_lte?: InputMaybe<Scalars['Bytes']['input']>;
  borrowerOperations_not?: InputMaybe<Scalars['Bytes']['input']>;
  borrowerOperations_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  borrowerOperations_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  collateral?: InputMaybe<Scalars['String']['input']>;
  collateral_?: InputMaybe<Collateral_Filter>;
  collateral_contains?: InputMaybe<Scalars['String']['input']>;
  collateral_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  collateral_ends_with?: InputMaybe<Scalars['String']['input']>;
  collateral_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  collateral_gt?: InputMaybe<Scalars['String']['input']>;
  collateral_gte?: InputMaybe<Scalars['String']['input']>;
  collateral_in?: InputMaybe<Array<Scalars['String']['input']>>;
  collateral_lt?: InputMaybe<Scalars['String']['input']>;
  collateral_lte?: InputMaybe<Scalars['String']['input']>;
  collateral_not?: InputMaybe<Scalars['String']['input']>;
  collateral_not_contains?: InputMaybe<Scalars['String']['input']>;
  collateral_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  collateral_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  collateral_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  collateral_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  collateral_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  collateral_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  collateral_starts_with?: InputMaybe<Scalars['String']['input']>;
  collateral_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<CollateralAddresses_Filter>>>;
  sortedTroves?: InputMaybe<Scalars['Bytes']['input']>;
  sortedTroves_contains?: InputMaybe<Scalars['Bytes']['input']>;
  sortedTroves_gt?: InputMaybe<Scalars['Bytes']['input']>;
  sortedTroves_gte?: InputMaybe<Scalars['Bytes']['input']>;
  sortedTroves_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  sortedTroves_lt?: InputMaybe<Scalars['Bytes']['input']>;
  sortedTroves_lte?: InputMaybe<Scalars['Bytes']['input']>;
  sortedTroves_not?: InputMaybe<Scalars['Bytes']['input']>;
  sortedTroves_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  sortedTroves_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  stabilityPool?: InputMaybe<Scalars['Bytes']['input']>;
  stabilityPool_contains?: InputMaybe<Scalars['Bytes']['input']>;
  stabilityPool_gt?: InputMaybe<Scalars['Bytes']['input']>;
  stabilityPool_gte?: InputMaybe<Scalars['Bytes']['input']>;
  stabilityPool_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  stabilityPool_lt?: InputMaybe<Scalars['Bytes']['input']>;
  stabilityPool_lte?: InputMaybe<Scalars['Bytes']['input']>;
  stabilityPool_not?: InputMaybe<Scalars['Bytes']['input']>;
  stabilityPool_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  stabilityPool_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  token?: InputMaybe<Scalars['Bytes']['input']>;
  token_contains?: InputMaybe<Scalars['Bytes']['input']>;
  token_gt?: InputMaybe<Scalars['Bytes']['input']>;
  token_gte?: InputMaybe<Scalars['Bytes']['input']>;
  token_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  token_lt?: InputMaybe<Scalars['Bytes']['input']>;
  token_lte?: InputMaybe<Scalars['Bytes']['input']>;
  token_not?: InputMaybe<Scalars['Bytes']['input']>;
  token_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  troveManager?: InputMaybe<Scalars['Bytes']['input']>;
  troveManager_contains?: InputMaybe<Scalars['Bytes']['input']>;
  troveManager_gt?: InputMaybe<Scalars['Bytes']['input']>;
  troveManager_gte?: InputMaybe<Scalars['Bytes']['input']>;
  troveManager_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  troveManager_lt?: InputMaybe<Scalars['Bytes']['input']>;
  troveManager_lte?: InputMaybe<Scalars['Bytes']['input']>;
  troveManager_not?: InputMaybe<Scalars['Bytes']['input']>;
  troveManager_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  troveManager_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  troveNft?: InputMaybe<Scalars['Bytes']['input']>;
  troveNft_contains?: InputMaybe<Scalars['Bytes']['input']>;
  troveNft_gt?: InputMaybe<Scalars['Bytes']['input']>;
  troveNft_gte?: InputMaybe<Scalars['Bytes']['input']>;
  troveNft_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  troveNft_lt?: InputMaybe<Scalars['Bytes']['input']>;
  troveNft_lte?: InputMaybe<Scalars['Bytes']['input']>;
  troveNft_not?: InputMaybe<Scalars['Bytes']['input']>;
  troveNft_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  troveNft_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export enum CollateralAddresses_OrderBy {
  BorrowerOperations = 'borrowerOperations',
  Collateral = 'collateral',
  CollateralCollIndex = 'collateral__collIndex',
  CollateralId = 'collateral__id',
  CollateralMinCollRatio = 'collateral__minCollRatio',
  Id = 'id',
  SortedTroves = 'sortedTroves',
  StabilityPool = 'stabilityPool',
  Token = 'token',
  TroveManager = 'troveManager',
  TroveNft = 'troveNft'
}

export type Collateral_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  addresses_?: InputMaybe<CollateralAddresses_Filter>;
  and?: InputMaybe<Array<InputMaybe<Collateral_Filter>>>;
  collIndex?: InputMaybe<Scalars['Int']['input']>;
  collIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  collIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  collIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  collIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  collIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  collIndex_not?: InputMaybe<Scalars['Int']['input']>;
  collIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  minCollRatio?: InputMaybe<Scalars['BigInt']['input']>;
  minCollRatio_gt?: InputMaybe<Scalars['BigInt']['input']>;
  minCollRatio_gte?: InputMaybe<Scalars['BigInt']['input']>;
  minCollRatio_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  minCollRatio_lt?: InputMaybe<Scalars['BigInt']['input']>;
  minCollRatio_lte?: InputMaybe<Scalars['BigInt']['input']>;
  minCollRatio_not?: InputMaybe<Scalars['BigInt']['input']>;
  minCollRatio_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Collateral_Filter>>>;
  stabilityPoolDeposits_?: InputMaybe<StabilityPoolDeposit_Filter>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  troves_?: InputMaybe<Trove_Filter>;
};

export enum Collateral_OrderBy {
  Addresses = 'addresses',
  AddressesBorrowerOperations = 'addresses__borrowerOperations',
  AddressesId = 'addresses__id',
  AddressesSortedTroves = 'addresses__sortedTroves',
  AddressesStabilityPool = 'addresses__stabilityPool',
  AddressesToken = 'addresses__token',
  AddressesTroveManager = 'addresses__troveManager',
  AddressesTroveNft = 'addresses__troveNft',
  CollIndex = 'collIndex',
  Id = 'id',
  MinCollRatio = 'minCollRatio',
  StabilityPoolDeposits = 'stabilityPoolDeposits',
  Token = 'token',
  TokenDecimals = 'token__decimals',
  TokenId = 'token__id',
  TokenName = 'token__name',
  TokenSymbol = 'token__symbol',
  Troves = 'troves'
}

export type InterestBatch = {
  __typename?: 'InterestBatch';
  annualInterestRate: Scalars['BigInt']['output'];
  annualManagementFee: Scalars['BigInt']['output'];
  batchManager: Scalars['Bytes']['output'];
  coll: Scalars['BigInt']['output'];
  collateral: Collateral;
  debt: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  troves: Array<Trove>;
};


export type InterestBatchTrovesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Trove_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Trove_Filter>;
};

export type InterestBatch_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<InterestBatch_Filter>>>;
  annualInterestRate?: InputMaybe<Scalars['BigInt']['input']>;
  annualInterestRate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  annualInterestRate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  annualInterestRate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  annualInterestRate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  annualInterestRate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  annualInterestRate_not?: InputMaybe<Scalars['BigInt']['input']>;
  annualInterestRate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  annualManagementFee?: InputMaybe<Scalars['BigInt']['input']>;
  annualManagementFee_gt?: InputMaybe<Scalars['BigInt']['input']>;
  annualManagementFee_gte?: InputMaybe<Scalars['BigInt']['input']>;
  annualManagementFee_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  annualManagementFee_lt?: InputMaybe<Scalars['BigInt']['input']>;
  annualManagementFee_lte?: InputMaybe<Scalars['BigInt']['input']>;
  annualManagementFee_not?: InputMaybe<Scalars['BigInt']['input']>;
  annualManagementFee_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  batchManager?: InputMaybe<Scalars['Bytes']['input']>;
  batchManager_contains?: InputMaybe<Scalars['Bytes']['input']>;
  batchManager_gt?: InputMaybe<Scalars['Bytes']['input']>;
  batchManager_gte?: InputMaybe<Scalars['Bytes']['input']>;
  batchManager_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  batchManager_lt?: InputMaybe<Scalars['Bytes']['input']>;
  batchManager_lte?: InputMaybe<Scalars['Bytes']['input']>;
  batchManager_not?: InputMaybe<Scalars['Bytes']['input']>;
  batchManager_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  batchManager_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  coll?: InputMaybe<Scalars['BigInt']['input']>;
  coll_gt?: InputMaybe<Scalars['BigInt']['input']>;
  coll_gte?: InputMaybe<Scalars['BigInt']['input']>;
  coll_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  coll_lt?: InputMaybe<Scalars['BigInt']['input']>;
  coll_lte?: InputMaybe<Scalars['BigInt']['input']>;
  coll_not?: InputMaybe<Scalars['BigInt']['input']>;
  coll_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  collateral?: InputMaybe<Scalars['String']['input']>;
  collateral_?: InputMaybe<Collateral_Filter>;
  collateral_contains?: InputMaybe<Scalars['String']['input']>;
  collateral_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  collateral_ends_with?: InputMaybe<Scalars['String']['input']>;
  collateral_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  collateral_gt?: InputMaybe<Scalars['String']['input']>;
  collateral_gte?: InputMaybe<Scalars['String']['input']>;
  collateral_in?: InputMaybe<Array<Scalars['String']['input']>>;
  collateral_lt?: InputMaybe<Scalars['String']['input']>;
  collateral_lte?: InputMaybe<Scalars['String']['input']>;
  collateral_not?: InputMaybe<Scalars['String']['input']>;
  collateral_not_contains?: InputMaybe<Scalars['String']['input']>;
  collateral_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  collateral_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  collateral_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  collateral_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  collateral_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  collateral_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  collateral_starts_with?: InputMaybe<Scalars['String']['input']>;
  collateral_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  debt?: InputMaybe<Scalars['BigInt']['input']>;
  debt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  debt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  debt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  debt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  debt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  debt_not?: InputMaybe<Scalars['BigInt']['input']>;
  debt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<InterestBatch_Filter>>>;
  troves_?: InputMaybe<Trove_Filter>;
};

export enum InterestBatch_OrderBy {
  AnnualInterestRate = 'annualInterestRate',
  AnnualManagementFee = 'annualManagementFee',
  BatchManager = 'batchManager',
  Coll = 'coll',
  Collateral = 'collateral',
  CollateralCollIndex = 'collateral__collIndex',
  CollateralId = 'collateral__id',
  CollateralMinCollRatio = 'collateral__minCollRatio',
  Debt = 'debt',
  Id = 'id',
  Troves = 'troves'
}

export type InterestRateBracket = {
  __typename?: 'InterestRateBracket';
  collateral: Collateral;
  id: Scalars['ID']['output'];
  rate: Scalars['BigInt']['output'];
  totalDebt: Scalars['BigInt']['output'];
};

export type InterestRateBracket_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<InterestRateBracket_Filter>>>;
  collateral?: InputMaybe<Scalars['String']['input']>;
  collateral_?: InputMaybe<Collateral_Filter>;
  collateral_contains?: InputMaybe<Scalars['String']['input']>;
  collateral_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  collateral_ends_with?: InputMaybe<Scalars['String']['input']>;
  collateral_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  collateral_gt?: InputMaybe<Scalars['String']['input']>;
  collateral_gte?: InputMaybe<Scalars['String']['input']>;
  collateral_in?: InputMaybe<Array<Scalars['String']['input']>>;
  collateral_lt?: InputMaybe<Scalars['String']['input']>;
  collateral_lte?: InputMaybe<Scalars['String']['input']>;
  collateral_not?: InputMaybe<Scalars['String']['input']>;
  collateral_not_contains?: InputMaybe<Scalars['String']['input']>;
  collateral_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  collateral_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  collateral_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  collateral_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  collateral_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  collateral_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  collateral_starts_with?: InputMaybe<Scalars['String']['input']>;
  collateral_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<InterestRateBracket_Filter>>>;
  rate?: InputMaybe<Scalars['BigInt']['input']>;
  rate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  rate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  rate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  rate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  rate_not?: InputMaybe<Scalars['BigInt']['input']>;
  rate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalDebt?: InputMaybe<Scalars['BigInt']['input']>;
  totalDebt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalDebt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalDebt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalDebt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalDebt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalDebt_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalDebt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum InterestRateBracket_OrderBy {
  Collateral = 'collateral',
  CollateralCollIndex = 'collateral__collIndex',
  CollateralId = 'collateral__id',
  CollateralMinCollRatio = 'collateral__minCollRatio',
  Id = 'id',
  Rate = 'rate',
  TotalDebt = 'totalDebt'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  borrowerInfo?: Maybe<BorrowerInfo>;
  borrowerInfos: Array<BorrowerInfo>;
  collSurplus?: Maybe<CollSurplus>;
  collSurpluses: Array<CollSurplus>;
  collateral?: Maybe<Collateral>;
  collateralAddresses?: Maybe<CollateralAddresses>;
  collateralAddresses_collection: Array<CollateralAddresses>;
  collaterals: Array<Collateral>;
  interestBatch?: Maybe<InterestBatch>;
  interestBatches: Array<InterestBatch>;
  interestRateBracket?: Maybe<InterestRateBracket>;
  interestRateBrackets: Array<InterestRateBracket>;
  stabilityPool?: Maybe<StabilityPool>;
  stabilityPoolDeposit?: Maybe<StabilityPoolDeposit>;
  stabilityPoolDepositSnapshot?: Maybe<StabilityPoolDepositSnapshot>;
  stabilityPoolDepositSnapshots: Array<StabilityPoolDepositSnapshot>;
  stabilityPoolDeposits: Array<StabilityPoolDeposit>;
  stabilityPoolEpochScale?: Maybe<StabilityPoolEpochScale>;
  stabilityPoolEpochScales: Array<StabilityPoolEpochScale>;
  stabilityPools: Array<StabilityPool>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
  trove?: Maybe<Trove>;
  troves: Array<Trove>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryBorrowerInfoArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryBorrowerInfosArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BorrowerInfo_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BorrowerInfo_Filter>;
};


export type QueryCollSurplusArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryCollSurplusesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<CollSurplus_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CollSurplus_Filter>;
};


export type QueryCollateralArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryCollateralAddressesArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryCollateralAddresses_CollectionArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<CollateralAddresses_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CollateralAddresses_Filter>;
};


export type QueryCollateralsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Collateral_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Collateral_Filter>;
};


export type QueryInterestBatchArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryInterestBatchesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<InterestBatch_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<InterestBatch_Filter>;
};


export type QueryInterestRateBracketArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryInterestRateBracketsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<InterestRateBracket_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<InterestRateBracket_Filter>;
};


export type QueryStabilityPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryStabilityPoolDepositArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryStabilityPoolDepositSnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryStabilityPoolDepositSnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<StabilityPoolDepositSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StabilityPoolDepositSnapshot_Filter>;
};


export type QueryStabilityPoolDepositsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<StabilityPoolDeposit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StabilityPoolDeposit_Filter>;
};


export type QueryStabilityPoolEpochScaleArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryStabilityPoolEpochScalesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<StabilityPoolEpochScale_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StabilityPoolEpochScale_Filter>;
};


export type QueryStabilityPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<StabilityPool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StabilityPool_Filter>;
};


export type QueryTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Token_Filter>;
};


export type QueryTroveArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTrovesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Trove_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Trove_Filter>;
};

export type StabilityPool = {
  __typename?: 'StabilityPool';
  id: Scalars['ID']['output'];
  totalDeposited: Scalars['BigInt']['output'];
};

export type StabilityPoolDeposit = {
  __typename?: 'StabilityPoolDeposit';
  collateral: Collateral;
  deposit: Scalars['BigInt']['output'];
  depositor: Scalars['Bytes']['output'];
  id: Scalars['ID']['output'];
  snapshot: StabilityPoolDepositSnapshot;
};

export type StabilityPoolDepositSnapshot = {
  __typename?: 'StabilityPoolDepositSnapshot';
  B: Scalars['BigInt']['output'];
  P: Scalars['BigInt']['output'];
  S: Scalars['BigInt']['output'];
  deposit: StabilityPoolDeposit;
  epoch: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  scale: Scalars['BigInt']['output'];
};

export type StabilityPoolDepositSnapshot_Filter = {
  B?: InputMaybe<Scalars['BigInt']['input']>;
  B_gt?: InputMaybe<Scalars['BigInt']['input']>;
  B_gte?: InputMaybe<Scalars['BigInt']['input']>;
  B_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  B_lt?: InputMaybe<Scalars['BigInt']['input']>;
  B_lte?: InputMaybe<Scalars['BigInt']['input']>;
  B_not?: InputMaybe<Scalars['BigInt']['input']>;
  B_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  P?: InputMaybe<Scalars['BigInt']['input']>;
  P_gt?: InputMaybe<Scalars['BigInt']['input']>;
  P_gte?: InputMaybe<Scalars['BigInt']['input']>;
  P_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  P_lt?: InputMaybe<Scalars['BigInt']['input']>;
  P_lte?: InputMaybe<Scalars['BigInt']['input']>;
  P_not?: InputMaybe<Scalars['BigInt']['input']>;
  P_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  S?: InputMaybe<Scalars['BigInt']['input']>;
  S_gt?: InputMaybe<Scalars['BigInt']['input']>;
  S_gte?: InputMaybe<Scalars['BigInt']['input']>;
  S_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  S_lt?: InputMaybe<Scalars['BigInt']['input']>;
  S_lte?: InputMaybe<Scalars['BigInt']['input']>;
  S_not?: InputMaybe<Scalars['BigInt']['input']>;
  S_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<StabilityPoolDepositSnapshot_Filter>>>;
  deposit_?: InputMaybe<StabilityPoolDeposit_Filter>;
  epoch?: InputMaybe<Scalars['BigInt']['input']>;
  epoch_gt?: InputMaybe<Scalars['BigInt']['input']>;
  epoch_gte?: InputMaybe<Scalars['BigInt']['input']>;
  epoch_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  epoch_lt?: InputMaybe<Scalars['BigInt']['input']>;
  epoch_lte?: InputMaybe<Scalars['BigInt']['input']>;
  epoch_not?: InputMaybe<Scalars['BigInt']['input']>;
  epoch_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<StabilityPoolDepositSnapshot_Filter>>>;
  scale?: InputMaybe<Scalars['BigInt']['input']>;
  scale_gt?: InputMaybe<Scalars['BigInt']['input']>;
  scale_gte?: InputMaybe<Scalars['BigInt']['input']>;
  scale_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  scale_lt?: InputMaybe<Scalars['BigInt']['input']>;
  scale_lte?: InputMaybe<Scalars['BigInt']['input']>;
  scale_not?: InputMaybe<Scalars['BigInt']['input']>;
  scale_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum StabilityPoolDepositSnapshot_OrderBy {
  B = 'B',
  P = 'P',
  S = 'S',
  Deposit = 'deposit',
  DepositDeposit = 'deposit__deposit',
  DepositDepositor = 'deposit__depositor',
  DepositId = 'deposit__id',
  Epoch = 'epoch',
  Id = 'id',
  Scale = 'scale'
}

export type StabilityPoolDeposit_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<StabilityPoolDeposit_Filter>>>;
  collateral?: InputMaybe<Scalars['String']['input']>;
  collateral_?: InputMaybe<Collateral_Filter>;
  collateral_contains?: InputMaybe<Scalars['String']['input']>;
  collateral_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  collateral_ends_with?: InputMaybe<Scalars['String']['input']>;
  collateral_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  collateral_gt?: InputMaybe<Scalars['String']['input']>;
  collateral_gte?: InputMaybe<Scalars['String']['input']>;
  collateral_in?: InputMaybe<Array<Scalars['String']['input']>>;
  collateral_lt?: InputMaybe<Scalars['String']['input']>;
  collateral_lte?: InputMaybe<Scalars['String']['input']>;
  collateral_not?: InputMaybe<Scalars['String']['input']>;
  collateral_not_contains?: InputMaybe<Scalars['String']['input']>;
  collateral_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  collateral_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  collateral_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  collateral_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  collateral_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  collateral_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  collateral_starts_with?: InputMaybe<Scalars['String']['input']>;
  collateral_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  deposit?: InputMaybe<Scalars['BigInt']['input']>;
  deposit_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deposit_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deposit_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deposit_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deposit_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deposit_not?: InputMaybe<Scalars['BigInt']['input']>;
  deposit_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  depositor?: InputMaybe<Scalars['Bytes']['input']>;
  depositor_contains?: InputMaybe<Scalars['Bytes']['input']>;
  depositor_gt?: InputMaybe<Scalars['Bytes']['input']>;
  depositor_gte?: InputMaybe<Scalars['Bytes']['input']>;
  depositor_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  depositor_lt?: InputMaybe<Scalars['Bytes']['input']>;
  depositor_lte?: InputMaybe<Scalars['Bytes']['input']>;
  depositor_not?: InputMaybe<Scalars['Bytes']['input']>;
  depositor_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  depositor_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<StabilityPoolDeposit_Filter>>>;
  snapshot?: InputMaybe<Scalars['String']['input']>;
  snapshot_?: InputMaybe<StabilityPoolDepositSnapshot_Filter>;
  snapshot_contains?: InputMaybe<Scalars['String']['input']>;
  snapshot_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  snapshot_ends_with?: InputMaybe<Scalars['String']['input']>;
  snapshot_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  snapshot_gt?: InputMaybe<Scalars['String']['input']>;
  snapshot_gte?: InputMaybe<Scalars['String']['input']>;
  snapshot_in?: InputMaybe<Array<Scalars['String']['input']>>;
  snapshot_lt?: InputMaybe<Scalars['String']['input']>;
  snapshot_lte?: InputMaybe<Scalars['String']['input']>;
  snapshot_not?: InputMaybe<Scalars['String']['input']>;
  snapshot_not_contains?: InputMaybe<Scalars['String']['input']>;
  snapshot_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  snapshot_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  snapshot_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  snapshot_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  snapshot_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  snapshot_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  snapshot_starts_with?: InputMaybe<Scalars['String']['input']>;
  snapshot_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum StabilityPoolDeposit_OrderBy {
  Collateral = 'collateral',
  CollateralCollIndex = 'collateral__collIndex',
  CollateralId = 'collateral__id',
  CollateralMinCollRatio = 'collateral__minCollRatio',
  Deposit = 'deposit',
  Depositor = 'depositor',
  Id = 'id',
  Snapshot = 'snapshot',
  SnapshotB = 'snapshot__B',
  SnapshotP = 'snapshot__P',
  SnapshotS = 'snapshot__S',
  SnapshotEpoch = 'snapshot__epoch',
  SnapshotId = 'snapshot__id',
  SnapshotScale = 'snapshot__scale'
}

export type StabilityPoolEpochScale = {
  __typename?: 'StabilityPoolEpochScale';
  B: Scalars['BigInt']['output'];
  S: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
};

export type StabilityPoolEpochScale_Filter = {
  B?: InputMaybe<Scalars['BigInt']['input']>;
  B_gt?: InputMaybe<Scalars['BigInt']['input']>;
  B_gte?: InputMaybe<Scalars['BigInt']['input']>;
  B_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  B_lt?: InputMaybe<Scalars['BigInt']['input']>;
  B_lte?: InputMaybe<Scalars['BigInt']['input']>;
  B_not?: InputMaybe<Scalars['BigInt']['input']>;
  B_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  S?: InputMaybe<Scalars['BigInt']['input']>;
  S_gt?: InputMaybe<Scalars['BigInt']['input']>;
  S_gte?: InputMaybe<Scalars['BigInt']['input']>;
  S_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  S_lt?: InputMaybe<Scalars['BigInt']['input']>;
  S_lte?: InputMaybe<Scalars['BigInt']['input']>;
  S_not?: InputMaybe<Scalars['BigInt']['input']>;
  S_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<StabilityPoolEpochScale_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<StabilityPoolEpochScale_Filter>>>;
};

export enum StabilityPoolEpochScale_OrderBy {
  B = 'B',
  S = 'S',
  Id = 'id'
}

export type StabilityPool_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<StabilityPool_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<StabilityPool_Filter>>>;
  totalDeposited?: InputMaybe<Scalars['BigInt']['input']>;
  totalDeposited_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalDeposited_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalDeposited_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalDeposited_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalDeposited_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalDeposited_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalDeposited_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum StabilityPool_OrderBy {
  Id = 'id',
  TotalDeposited = 'totalDeposited'
}

export type Token = {
  __typename?: 'Token';
  collateral: Collateral;
  decimals: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
};

export type Token_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Token_Filter>>>;
  collateral?: InputMaybe<Scalars['String']['input']>;
  collateral_?: InputMaybe<Collateral_Filter>;
  collateral_contains?: InputMaybe<Scalars['String']['input']>;
  collateral_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  collateral_ends_with?: InputMaybe<Scalars['String']['input']>;
  collateral_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  collateral_gt?: InputMaybe<Scalars['String']['input']>;
  collateral_gte?: InputMaybe<Scalars['String']['input']>;
  collateral_in?: InputMaybe<Array<Scalars['String']['input']>>;
  collateral_lt?: InputMaybe<Scalars['String']['input']>;
  collateral_lte?: InputMaybe<Scalars['String']['input']>;
  collateral_not?: InputMaybe<Scalars['String']['input']>;
  collateral_not_contains?: InputMaybe<Scalars['String']['input']>;
  collateral_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  collateral_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  collateral_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  collateral_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  collateral_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  collateral_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  collateral_starts_with?: InputMaybe<Scalars['String']['input']>;
  collateral_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  decimals?: InputMaybe<Scalars['Int']['input']>;
  decimals_gt?: InputMaybe<Scalars['Int']['input']>;
  decimals_gte?: InputMaybe<Scalars['Int']['input']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  decimals_lt?: InputMaybe<Scalars['Int']['input']>;
  decimals_lte?: InputMaybe<Scalars['Int']['input']>;
  decimals_not?: InputMaybe<Scalars['Int']['input']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Token_Filter>>>;
  symbol?: InputMaybe<Scalars['String']['input']>;
  symbol_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_gt?: InputMaybe<Scalars['String']['input']>;
  symbol_gte?: InputMaybe<Scalars['String']['input']>;
  symbol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_lt?: InputMaybe<Scalars['String']['input']>;
  symbol_lte?: InputMaybe<Scalars['String']['input']>;
  symbol_not?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export enum Token_OrderBy {
  Collateral = 'collateral',
  CollateralCollIndex = 'collateral__collIndex',
  CollateralId = 'collateral__id',
  CollateralMinCollRatio = 'collateral__minCollRatio',
  Decimals = 'decimals',
  Id = 'id',
  Name = 'name',
  Symbol = 'symbol'
}

export type Trove = {
  __typename?: 'Trove';
  borrower: Scalars['Bytes']['output'];
  closedAt?: Maybe<Scalars['BigInt']['output']>;
  collateral: Collateral;
  createdAt: Scalars['BigInt']['output'];
  debt: Scalars['BigInt']['output'];
  deposit: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  interestBatch?: Maybe<InterestBatch>;
  interestRate: Scalars['BigInt']['output'];
  mightBeLeveraged: Scalars['Boolean']['output'];
  stake: Scalars['BigInt']['output'];
  status: TroveStatus;
  troveId: Scalars['String']['output'];
  updatedAt: Scalars['BigInt']['output'];
};

export enum TroveStatus {
  Active = 'active',
  Closed = 'closed',
  Liquidated = 'liquidated',
  Redeemed = 'redeemed'
}

export type Trove_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Trove_Filter>>>;
  borrower?: InputMaybe<Scalars['Bytes']['input']>;
  borrower_contains?: InputMaybe<Scalars['Bytes']['input']>;
  borrower_gt?: InputMaybe<Scalars['Bytes']['input']>;
  borrower_gte?: InputMaybe<Scalars['Bytes']['input']>;
  borrower_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  borrower_lt?: InputMaybe<Scalars['Bytes']['input']>;
  borrower_lte?: InputMaybe<Scalars['Bytes']['input']>;
  borrower_not?: InputMaybe<Scalars['Bytes']['input']>;
  borrower_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  borrower_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  closedAt?: InputMaybe<Scalars['BigInt']['input']>;
  closedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  closedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  closedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  closedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  closedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  closedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  closedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  collateral?: InputMaybe<Scalars['String']['input']>;
  collateral_?: InputMaybe<Collateral_Filter>;
  collateral_contains?: InputMaybe<Scalars['String']['input']>;
  collateral_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  collateral_ends_with?: InputMaybe<Scalars['String']['input']>;
  collateral_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  collateral_gt?: InputMaybe<Scalars['String']['input']>;
  collateral_gte?: InputMaybe<Scalars['String']['input']>;
  collateral_in?: InputMaybe<Array<Scalars['String']['input']>>;
  collateral_lt?: InputMaybe<Scalars['String']['input']>;
  collateral_lte?: InputMaybe<Scalars['String']['input']>;
  collateral_not?: InputMaybe<Scalars['String']['input']>;
  collateral_not_contains?: InputMaybe<Scalars['String']['input']>;
  collateral_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  collateral_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  collateral_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  collateral_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  collateral_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  collateral_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  collateral_starts_with?: InputMaybe<Scalars['String']['input']>;
  collateral_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  debt?: InputMaybe<Scalars['BigInt']['input']>;
  debt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  debt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  debt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  debt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  debt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  debt_not?: InputMaybe<Scalars['BigInt']['input']>;
  debt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deposit?: InputMaybe<Scalars['BigInt']['input']>;
  deposit_gt?: InputMaybe<Scalars['BigInt']['input']>;
  deposit_gte?: InputMaybe<Scalars['BigInt']['input']>;
  deposit_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  deposit_lt?: InputMaybe<Scalars['BigInt']['input']>;
  deposit_lte?: InputMaybe<Scalars['BigInt']['input']>;
  deposit_not?: InputMaybe<Scalars['BigInt']['input']>;
  deposit_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  interestBatch?: InputMaybe<Scalars['String']['input']>;
  interestBatch_?: InputMaybe<InterestBatch_Filter>;
  interestBatch_contains?: InputMaybe<Scalars['String']['input']>;
  interestBatch_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  interestBatch_ends_with?: InputMaybe<Scalars['String']['input']>;
  interestBatch_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  interestBatch_gt?: InputMaybe<Scalars['String']['input']>;
  interestBatch_gte?: InputMaybe<Scalars['String']['input']>;
  interestBatch_in?: InputMaybe<Array<Scalars['String']['input']>>;
  interestBatch_lt?: InputMaybe<Scalars['String']['input']>;
  interestBatch_lte?: InputMaybe<Scalars['String']['input']>;
  interestBatch_not?: InputMaybe<Scalars['String']['input']>;
  interestBatch_not_contains?: InputMaybe<Scalars['String']['input']>;
  interestBatch_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  interestBatch_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  interestBatch_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  interestBatch_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  interestBatch_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  interestBatch_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  interestBatch_starts_with?: InputMaybe<Scalars['String']['input']>;
  interestBatch_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  interestRate?: InputMaybe<Scalars['BigInt']['input']>;
  interestRate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  interestRate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  interestRate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  interestRate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  interestRate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  interestRate_not?: InputMaybe<Scalars['BigInt']['input']>;
  interestRate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  mightBeLeveraged?: InputMaybe<Scalars['Boolean']['input']>;
  mightBeLeveraged_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  mightBeLeveraged_not?: InputMaybe<Scalars['Boolean']['input']>;
  mightBeLeveraged_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Trove_Filter>>>;
  stake?: InputMaybe<Scalars['BigInt']['input']>;
  stake_gt?: InputMaybe<Scalars['BigInt']['input']>;
  stake_gte?: InputMaybe<Scalars['BigInt']['input']>;
  stake_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stake_lt?: InputMaybe<Scalars['BigInt']['input']>;
  stake_lte?: InputMaybe<Scalars['BigInt']['input']>;
  stake_not?: InputMaybe<Scalars['BigInt']['input']>;
  stake_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  status?: InputMaybe<TroveStatus>;
  status_in?: InputMaybe<Array<TroveStatus>>;
  status_not?: InputMaybe<TroveStatus>;
  status_not_in?: InputMaybe<Array<TroveStatus>>;
  troveId?: InputMaybe<Scalars['String']['input']>;
  troveId_contains?: InputMaybe<Scalars['String']['input']>;
  troveId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  troveId_ends_with?: InputMaybe<Scalars['String']['input']>;
  troveId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  troveId_gt?: InputMaybe<Scalars['String']['input']>;
  troveId_gte?: InputMaybe<Scalars['String']['input']>;
  troveId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  troveId_lt?: InputMaybe<Scalars['String']['input']>;
  troveId_lte?: InputMaybe<Scalars['String']['input']>;
  troveId_not?: InputMaybe<Scalars['String']['input']>;
  troveId_not_contains?: InputMaybe<Scalars['String']['input']>;
  troveId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  troveId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  troveId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  troveId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  troveId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  troveId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  troveId_starts_with?: InputMaybe<Scalars['String']['input']>;
  troveId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export enum Trove_OrderBy {
  Borrower = 'borrower',
  ClosedAt = 'closedAt',
  Collateral = 'collateral',
  CollateralCollIndex = 'collateral__collIndex',
  CollateralId = 'collateral__id',
  CollateralMinCollRatio = 'collateral__minCollRatio',
  CreatedAt = 'createdAt',
  Debt = 'debt',
  Deposit = 'deposit',
  Id = 'id',
  InterestBatch = 'interestBatch',
  InterestBatchAnnualInterestRate = 'interestBatch__annualInterestRate',
  InterestBatchAnnualManagementFee = 'interestBatch__annualManagementFee',
  InterestBatchBatchManager = 'interestBatch__batchManager',
  InterestBatchColl = 'interestBatch__coll',
  InterestBatchDebt = 'interestBatch__debt',
  InterestBatchId = 'interestBatch__id',
  InterestRate = 'interestRate',
  MightBeLeveraged = 'mightBeLeveraged',
  Stake = 'stake',
  Status = 'status',
  TroveId = 'troveId',
  UpdatedAt = 'updatedAt'
}

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']['output']>;
  /** The block number */
  number: Scalars['Int']['output'];
  /** The hash of the parent block */
  parentHash?: Maybe<Scalars['Bytes']['output']>;
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']['output']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String']['output'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean']['output'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}

export type BorrowerInfoQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type BorrowerInfoQuery = { __typename?: 'Query', borrowerInfo?: { __typename?: 'BorrowerInfo', nextOwnerIndexes: Array<number>, troves: number, trovesByCollateral: Array<number> } | null };

export type FullTroveFragmentFragment = { __typename?: 'Trove', id: string, borrower: string, closedAt?: bigint | null, createdAt: bigint, debt: bigint, deposit: bigint, interestRate: bigint, mightBeLeveraged: boolean, stake: bigint, status: TroveStatus, troveId: string, updatedAt: bigint, collateral: { __typename?: 'Collateral', id: string, minCollRatio: bigint, collIndex: number, token: { __typename?: 'Token', symbol: string, name: string } }, interestBatch?: { __typename?: 'InterestBatch', id: string, annualInterestRate: bigint, annualManagementFee: bigint, batchManager: string } | null } & { ' $fragmentName'?: 'FullTroveFragmentFragment' };

export type TrovesByAccountQueryVariables = Exact<{
  account: Scalars['Bytes']['input'];
}>;


export type TrovesByAccountQuery = { __typename?: 'Query', troves: Array<{ __typename?: 'Trove', id: string, borrower: string, closedAt?: bigint | null, createdAt: bigint, debt: bigint, deposit: bigint, interestRate: bigint, mightBeLeveraged: boolean, stake: bigint, status: TroveStatus, troveId: string, updatedAt: bigint, collateral: { __typename?: 'Collateral', id: string, minCollRatio: bigint, collIndex: number, token: { __typename?: 'Token', symbol: string, name: string } }, interestBatch?: { __typename?: 'InterestBatch', id: string, annualInterestRate: bigint, annualManagementFee: bigint, batchManager: string } | null }> };

export type TroveByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type TroveByIdQuery = { __typename?: 'Query', trove?: { __typename?: 'Trove', id: string, borrower: string, closedAt?: bigint | null, createdAt: bigint, debt: bigint, deposit: bigint, interestRate: bigint, mightBeLeveraged: boolean, stake: bigint, status: TroveStatus, troveId: string, updatedAt: bigint, collateral: { __typename?: 'Collateral', id: string, minCollRatio: bigint, collIndex: number, token: { __typename?: 'Token', symbol: string, name: string } }, interestBatch?: { __typename?: 'InterestBatch', id: string, annualInterestRate: bigint, annualManagementFee: bigint, batchManager: string } | null } | null };

export type StabilityPoolsQueryVariables = Exact<{ [key: string]: never; }>;


export type StabilityPoolsQuery = { __typename?: 'Query', stabilityPools: Array<{ __typename?: 'StabilityPool', id: string, totalDeposited: bigint }> };

export type StabilityPoolDepositFragmentFragment = { __typename?: 'StabilityPoolDeposit', id: string, deposit: bigint, depositor: string, collateral: { __typename?: 'Collateral', collIndex: number }, snapshot: { __typename?: 'StabilityPoolDepositSnapshot', B: bigint, P: bigint, S: bigint, epoch: bigint, scale: bigint } } & { ' $fragmentName'?: 'StabilityPoolDepositFragmentFragment' };

export type StabilityPoolDepositsByAccountQueryVariables = Exact<{
  account: Scalars['Bytes']['input'];
}>;


export type StabilityPoolDepositsByAccountQuery = { __typename?: 'Query', stabilityPoolDeposits: Array<{ __typename?: 'StabilityPoolDeposit', id: string, deposit: bigint, depositor: string, collateral: { __typename?: 'Collateral', collIndex: number }, snapshot: { __typename?: 'StabilityPoolDepositSnapshot', B: bigint, P: bigint, S: bigint, epoch: bigint, scale: bigint } }> };

export type StabilityPoolDepositQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type StabilityPoolDepositQuery = { __typename?: 'Query', stabilityPoolDeposit?: { __typename?: 'StabilityPoolDeposit', id: string, deposit: bigint, depositor: string, collateral: { __typename?: 'Collateral', collIndex: number }, snapshot: { __typename?: 'StabilityPoolDepositSnapshot', B: bigint, P: bigint, S: bigint, epoch: bigint, scale: bigint } } | null };

export type StabilityPoolEpochScaleQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type StabilityPoolEpochScaleQuery = { __typename?: 'Query', stabilityPoolEpochScale?: { __typename?: 'StabilityPoolEpochScale', id: string, B: bigint, S: bigint } | null };

export type InterestBatchesQueryVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type InterestBatchesQuery = { __typename?: 'Query', interestBatches: Array<{ __typename?: 'InterestBatch', batchManager: string, debt: bigint, coll: bigint, annualInterestRate: bigint, annualManagementFee: bigint, collateral: { __typename?: 'Collateral', collIndex: number } }> };

export type AllInterestRateBracketsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllInterestRateBracketsQuery = { __typename?: 'Query', interestRateBrackets: Array<{ __typename?: 'InterestRateBracket', rate: bigint, totalDebt: bigint, collateral: { __typename?: 'Collateral', collIndex: number } }> };

export type BlockNumberQueryVariables = Exact<{ [key: string]: never; }>;


export type BlockNumberQuery = { __typename?: 'Query', _meta?: { __typename?: '_Meta_', block: { __typename?: '_Block_', number: number } } | null };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: DocumentTypeDecoration<TResult, TVariables>['__apiType'];

  constructor(private value: string, public __meta__?: Record<string, any> | undefined) {
    super(value);
  }

  toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}
export const FullTroveFragmentFragmentDoc = new TypedDocumentString(`
    fragment FullTroveFragment on Trove {
  id
  borrower
  closedAt
  createdAt
  debt
  deposit
  interestRate
  mightBeLeveraged
  stake
  status
  troveId
  updatedAt
  collateral {
    id
    token {
      symbol
      name
    }
    minCollRatio
    collIndex
  }
  interestBatch {
    id
    annualInterestRate
    annualManagementFee
    batchManager
  }
}
    `, {"fragmentName":"FullTroveFragment"}) as unknown as TypedDocumentString<FullTroveFragmentFragment, unknown>;
export const StabilityPoolDepositFragmentFragmentDoc = new TypedDocumentString(`
    fragment StabilityPoolDepositFragment on StabilityPoolDeposit {
  id
  deposit
  depositor
  collateral {
    collIndex
  }
  snapshot {
    B
    P
    S
    epoch
    scale
  }
}
    `, {"fragmentName":"StabilityPoolDepositFragment"}) as unknown as TypedDocumentString<StabilityPoolDepositFragmentFragment, unknown>;
export const BorrowerInfoDocument = new TypedDocumentString(`
    query BorrowerInfo($id: ID!) {
  borrowerInfo(id: $id) {
    nextOwnerIndexes
    troves
    trovesByCollateral
  }
}
    `) as unknown as TypedDocumentString<BorrowerInfoQuery, BorrowerInfoQueryVariables>;
export const TrovesByAccountDocument = new TypedDocumentString(`
    query TrovesByAccount($account: Bytes!) {
  troves(
    where: {borrower: $account, status_in: [active, redeemed, liquidated]}
    orderBy: updatedAt
    orderDirection: desc
  ) {
    id
    borrower
    closedAt
    createdAt
    debt
    deposit
    interestRate
    mightBeLeveraged
    stake
    status
    troveId
    updatedAt
    collateral {
      id
      token {
        symbol
        name
      }
      minCollRatio
      collIndex
    }
    interestBatch {
      id
      annualInterestRate
      annualManagementFee
      batchManager
    }
  }
}
    `) as unknown as TypedDocumentString<TrovesByAccountQuery, TrovesByAccountQueryVariables>;
export const TroveByIdDocument = new TypedDocumentString(`
    query TroveById($id: ID!) {
  trove(id: $id) {
    id
    borrower
    closedAt
    createdAt
    debt
    deposit
    interestRate
    mightBeLeveraged
    stake
    status
    troveId
    updatedAt
    collateral {
      id
      token {
        symbol
        name
      }
      minCollRatio
      collIndex
    }
    interestBatch {
      id
      annualInterestRate
      annualManagementFee
      batchManager
    }
  }
}
    `) as unknown as TypedDocumentString<TroveByIdQuery, TroveByIdQueryVariables>;
export const StabilityPoolsDocument = new TypedDocumentString(`
    query StabilityPools {
  stabilityPools {
    id
    totalDeposited
  }
}
    `) as unknown as TypedDocumentString<StabilityPoolsQuery, StabilityPoolsQueryVariables>;
export const StabilityPoolDepositsByAccountDocument = new TypedDocumentString(`
    query StabilityPoolDepositsByAccount($account: Bytes!) {
  stabilityPoolDeposits(where: {depositor: $account, deposit_gt: 0}) {
    id
    deposit
    depositor
    collateral {
      collIndex
    }
    snapshot {
      B
      P
      S
      epoch
      scale
    }
  }
}
    `) as unknown as TypedDocumentString<StabilityPoolDepositsByAccountQuery, StabilityPoolDepositsByAccountQueryVariables>;
export const StabilityPoolDepositDocument = new TypedDocumentString(`
    query StabilityPoolDeposit($id: ID!) {
  stabilityPoolDeposit(id: $id) {
    id
    deposit
    depositor
    collateral {
      collIndex
    }
    snapshot {
      B
      P
      S
      epoch
      scale
    }
  }
}
    `) as unknown as TypedDocumentString<StabilityPoolDepositQuery, StabilityPoolDepositQueryVariables>;
export const StabilityPoolEpochScaleDocument = new TypedDocumentString(`
    query StabilityPoolEpochScale($id: ID!) {
  stabilityPoolEpochScale(id: $id) {
    id
    B
    S
  }
}
    `) as unknown as TypedDocumentString<StabilityPoolEpochScaleQuery, StabilityPoolEpochScaleQueryVariables>;
export const InterestBatchesDocument = new TypedDocumentString(`
    query InterestBatches($ids: [ID!]!) {
  interestBatches(where: {id_in: $ids}) {
    collateral {
      collIndex
    }
    batchManager
    debt
    coll
    annualInterestRate
    annualManagementFee
  }
}
    `) as unknown as TypedDocumentString<InterestBatchesQuery, InterestBatchesQueryVariables>;
export const AllInterestRateBracketsDocument = new TypedDocumentString(`
    query AllInterestRateBrackets {
  interestRateBrackets(orderBy: rate) {
    collateral {
      collIndex
    }
    rate
    totalDebt
  }
}
    `) as unknown as TypedDocumentString<AllInterestRateBracketsQuery, AllInterestRateBracketsQueryVariables>;
export const BlockNumberDocument = new TypedDocumentString(`
    query BlockNumber {
  _meta {
    block {
      number
    }
  }
}
    `) as unknown as TypedDocumentString<BlockNumberQuery, BlockNumberQueryVariables>;
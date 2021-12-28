# DevOps and Deployment

### Overview
This is an attempt to deploy copies of these contracts onto the Mumbai testnet and activate the DApp using them. The process appears to have worked properly but ran into two challenges:
1. Difficulty in adding initial liquidity via quickswap. It should still be possible to do this via our DApp on the Liquidity page. Quickswap would not load our tokens.
2. Our DApp would not display token information even after modifying all config files. Files in Redux/Blockchain/* (ABI folder and contracts.js) control contract address as well as web3 providers. At the time of this writing, even token balances were not loading properly.

Deploy date: 12/24/21
**Deployment Address**: 0x3F70b41F8362ffE8b6fFAE8f43924DdC0e435D1b
**Mumbai** Quickswap Router: 0x8954AfA98594b838bda56FE4C12a09D7739D179b

### Contracts
### capl.sol // Deploy token
Solidity 0.8.0
Contract: 0x638821D52fE1A2622030df86A08c7fb0799196E4 - CAPL-TEST
Deploy: TOKENAMOUNT: 0 // mints initial amount to owner/deployer
Mint: Add 6 zeros to account for decimals! - 100,000

### USDC_Test.sol
Contract: 0xa0a41AE9d8eA53E32F7Fc7C2Ef90855b27589B09 - USDC-TEST
Mint: Add 6 zeros to account for decimals! - 100,000

### swap.sol // Create pair
Solidity 0.6.12+
Contract: 0x45D1Eb5Bc29c7BF335298f887B645D7c4E07EaD1
Update line 845 to include proper quickswap/uniswap router (V2)
Constructor: Include CAPL and USDC token addresses
caplUsdcPair (LP): 0x25FCb98E8963a47EaA89E011CeB2e8894D7F68c1
Transaction: setSlippageTolerance: 0

### reward.sol
Solidity 0.6.12+
Update Addresses: Line 1458, 1825
Contract: 0xf6E0b210c29e7F853daB3e12aa70472a9b06ad3e

### vault.sol
Solidity 0.6.12+
0xeeF13F813Cc76C14C9fCAFA439522528E09C9c6b
rewardAddress: Reward contract
CAPLAddress: Reward token
feeReceiver: Address that receives fees
wantAddress: Token desired
govAdd: Governance Address (owner)

### Reward Calls (after vault deployed)
add()
allocPoint: 43200 /// Rewards per block - For testing set to 1 per second
want: (LP token)
withUpdate: true
strat: strategy/vault contract

### rewardSource.sol
Solidity 0.8.0
Contract: 0xDFaE61777b43a7d37d039f476FDf0e1E39d9aD58
capltoken: capl address
rewardcontract: reward contract address

### addLiquidity.sol
Solidity 0.6.12+
Contract: 0x21854C4A5e30d98117DF0bCBD47471a072e63974
Update line 835 with uniswap V2 router
CAPL: Token Address
USDC: Token Address
PAIR: LP Token

### Rewards
setAddLiquidity: 0x21854C4A5e30d98117DF0bCBD47471a072e63974
setFundSource: 0xDFaE61777b43a7d37d039f476FDf0e1E39d9aD58

##### Transaction: Send 100,000 CAPL-TEST to rewardSource
##### Transaction: rewardSource.approve()
##### Transaction: Approve quickswap router for CAPL-TEST
1000000000000000000000000000000
##### Transaction: Approve quickswap router for USDC-TEST
1000000000000000000000000000000


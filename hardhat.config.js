/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 require("@nomiclabs/hardhat-waffle")
 require("@nomiclabs/hardhat-truffle5");
 require("@nomiclabs/hardhat-etherscan");
  // require("solidity-coverage");
  
  // require('hardhat-spdx-license-identifier');
  // require("hardhat-gas-reporter");
  const CONFIG = require("./credentials.js");
  
  module.exports = {
      solidity: {
          compilers: [
              {
                  version: "0.6.12",
                  settings: {
                      optimizer: {
                          enabled: true,
                          runs: 1000,
                      },
                  },
              },
          ],
          overrides: {
            "contracts/version1/CAPL.sol": {
                version: "0.8.0",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 1,
                    },
                },
              },
			  "contracts/version1/USDC.sol": {
				version: "0.8.0",
				settings: {
					optimizer: {
						enabled: true,
						runs: 1,
					},
				},
			  },
			},
      },
      spdxLicenseIdentifier: {
          overwrite: true,
          runOnCompile: true,
      },
      // gasReporter: {
      //     currency: 'USD',
      //     gasPrice: 1
      // },
      defaultNetwork: "hardhat",
      mocha: {
          timeout: 1000000000000,
      },
  
      networks: {
          hardhat: {
              blockGasLimit: 10000000000000,
              allowUnlimitedContractSize: true,
              timeout: 1000000000000,
              accounts: {
                  accountsBalance: "10000000000000000000000000000000",
                  count: 20,
              },
              forking: {
                // url: "https://bsc-dataseed.binance.org/",
                url: "https://mainnet.infura.io/v3/7431868d5d1d49e99286e1f59569a0e0",
                timeout: 1000000000000
              }
          },
        //   localhost: {
        //     url: "http://127.0.0.1:8545",
        //     forking: {
        //         url: "https://bsc-dataseed.binance.org/",
        //         timeout: 1000000000000
        //     }
        //   },
          bscTestnet: {
              url: `https://data-seed-prebsc-1-s1.binance.org:8545/`,
              accounts: [CONFIG.wallet.PKEY],
              gasPrice: 30000000000,
          },
      },
  
      contractSizer: {
          alphaSort: false,
          runOnCompile: true,
          disambiguatePaths: false,
      }
  };
  
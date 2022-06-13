require('dotenv').config();
const PKProvider = require('@truffle/hdwallet-provider');
const AlchemyAPIKey = process.env.ALCHEMY_API_MUMBAI_KEY;
const OwnerPK = process.env.PRIVATE_KEY;

module.exports = {
  networks: {
    develop: {
      port: 8545
    },
    matic:{
      provider:()=> new PKProvider(OwnerPK,`https://polygon-mumbai.g.alchemy.com/v2/${AlchemyAPIKey}`),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.14",
      // version: "0.5.1",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      optimizer: {
          enabled: true,
          runs: 200
        }
      //  evmVersion: "byzantium"
      // }
    }
  }
}

const path = require("path");
var HDWalletProvider = require("truffle-hdwallet-provider");
const MNEMONIC = 'wheat correct extra little perfect weasel affair come jelly emerge involve distance';
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777"
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(MNEMONIC, "https://ropsten.infura.io/v3/45b7d80742e14d16855de1497ee3bcb6")
      },
      network_id: 3,
      gas: 4000000
    }
  }
};
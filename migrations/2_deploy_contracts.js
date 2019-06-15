var VehicleOwnershipDatabase = artifacts.require("./VehicleOwnershipDatabase.sol");

module.exports = function(deployer) {
  deployer.deploy(VehicleOwnershipDatabase);
};

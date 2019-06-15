const VehicleOwnershipDatabase = artifacts.require("./VehicleOwnershipDatabase.sol");

contract("VehicleOwnershipDatabase", accounts => {
  it("should load basic contract instance", async () => {
    const vehicleOwnershipDatabaseInstance = await VehicleOwnershipDatabase.deployed();

    assert.notEqual(vehicleOwnershipDatabaseInstance, null, "Contract instance is null.");
  });
});

const VehicleOwnershipDatabase = artifacts.require("./VehicleOwnershipDatabase.sol");

contract("VehicleOwnershipDatabase", accounts => {
  it("should add car to pending vehicles", async () => {
    const vehicleOwnershipDatabaseInstance = await VehicleOwnershipDatabase.deployed();

    const carVin = "1ZVBP8AM0C5265607";
    const carModel = "Ford Fiesta";
    const vehicleType = 0;

    const id = web3.utils.fromAscii(carVin);

    await vehicleOwnershipDatabaseInstance.addVehicle(id, carModel, vehicleType, { from: accounts[0] });

    const storedVehicle = await vehicleOwnershipDatabaseInstance.waitingForApprovals.call(id);

    assert.equal(storedVehicle[0].toNumber(), 0, "Car type should be stored.");
    assert.equal(storedVehicle[1], carModel, "Car model should be stored.");
    assert.equal(storedVehicle[2], accounts[0], "Car owner should be stored.");
    assert.equal(storedVehicle[3], true, "Car should exist.");
  });
});

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
    const pendingIds = await vehicleOwnershipDatabaseInstance.getPendingIds.call();
    const returnedId = web3.utils.toAscii(pendingIds[0]).replace(/\u0000/g, '');
    console.log(storedVehicle);

    assert.equal(storedVehicle[0].toNumber(), 0, "Car type should be stored.");
    assert.equal(storedVehicle[1], carModel, "Car model should be stored.");
    assert.equal(storedVehicle[2], accounts[0], "Car owner should be stored.");
    assert.equal(storedVehicle[3], true, "Car should exist.");
    assert.equal(returnedId, carVin, "Vin should be added to ids list.");
  });

  it("should move vehicle to registered after two approvals", async () => {
    const vehicleOwnershipDatabaseInstance = await VehicleOwnershipDatabase.deployed();

    const carVin = "1ZVBP8AM0AAAA5607";
    const carModel = "Ford Escort";
    const vehicleType = 0;

    const id = web3.utils.fromAscii(carVin);
    // adding car first to pending ids
    await vehicleOwnershipDatabaseInstance.addVehicle(id, carModel, vehicleType, { from: accounts[0] });

    // approving by two different users
    await vehicleOwnershipDatabaseInstance.approveVehicle(id, { from: accounts[1] });
    await vehicleOwnershipDatabaseInstance.approveVehicle(id, { from: accounts[2] });

    const storedVehicle = await vehicleOwnershipDatabaseInstance.vehicleRegistry.call(id);
    const existingIds = await vehicleOwnershipDatabaseInstance.getRegisteredIds.call();
    const returnedId = web3.utils.toAscii(existingIds[0]).replace(/\u0000/g, '');

    const notStoredVehicle = await vehicleOwnershipDatabaseInstance.waitingForApprovals.call(id);

    //check if stored in vehicle registry
    assert.equal(storedVehicle[0].toNumber(), 0, "Car type should be stored.");
    assert.equal(storedVehicle[1], carModel, "Car model should be stored.");
    assert.equal(storedVehicle[2], accounts[0], "Car owner should be stored.");
    assert.equal(storedVehicle[3], true, "Car should exist.");
    assert.equal(returnedId, carVin, "Vin should be added to ids list.");

    //check if removed from pending
    assert.equal(notStoredVehicle[3], false, "Car should not exist in pending.");
  });
});


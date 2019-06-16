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

  it("user should not be able to approve again when approved once", async () => {
    const vehicleOwnershipDatabaseInstance = await VehicleOwnershipDatabase.deployed();

    const carVin = "1ZVBP8AM0AAAA5333";
    const carModel = "Ford Escort";
    const vehicleType = 0;

    const id = web3.utils.fromAscii(carVin);
    // adding car first to pending ids
    await vehicleOwnershipDatabaseInstance.addVehicle(id, carModel, vehicleType, { from: accounts[0] });

    // approving by two different users
    await vehicleOwnershipDatabaseInstance.approveVehicle(id, { from: accounts[1] });

    const notApprovedYetAccount1 = await vehicleOwnershipDatabaseInstance.notApprovingYet(id, { from: accounts[1] });
    const notApprovedYetAccount2 = await vehicleOwnershipDatabaseInstance.notApprovingYet(id, { from: accounts[2] });

    //check if stored in vehicle registry
    assert.equal(notApprovedYetAccount1, false, "Car should be approved already by account 1.");
    assert.equal(notApprovedYetAccount2, true, "Car should not be approved already by account 2.");

  });

  it("should add vehicle to transfer list", async () => {
    const vehicleOwnershipDatabaseInstance = await VehicleOwnershipDatabase.deployed();

    const carVin = "2ZVBP8AM0AAAA5607";
    const carModel = "Ford Mondeo";
    const vehicleType = 0;

    const id = web3.utils.fromAscii(carVin);

    // adding car first to pending ids
    await vehicleOwnershipDatabaseInstance.addVehicle(id, carModel, vehicleType, { from: accounts[0] });

    // approving by two different users
    await vehicleOwnershipDatabaseInstance.approveVehicle(id, { from: accounts[1] });
    await vehicleOwnershipDatabaseInstance.approveVehicle(id, { from: accounts[2] });

    const newOwner = accounts[1];

    await vehicleOwnershipDatabaseInstance.transferVehicle(id, newOwner, { from: accounts[0] });

    const transferredVehicle = await vehicleOwnershipDatabaseInstance.waitingForTransfers.call(id);

    assert.equal(transferredVehicle[0], accounts[0], "Car's owner should be stored.");
    assert.equal(transferredVehicle[1], newOwner, "Car's next owner should be stored.");
    assert.equal(transferredVehicle[2], true, "Car should exists in waiting for transfer structure.");

    const transferredIds = await vehicleOwnershipDatabaseInstance.getTransferIds.call();
    const transferredId = web3.utils.toAscii(transferredIds[0]).replace(/\u0000/g, '');

    assert.equal(transferredId, carVin, "Car should exists in waiting for transfer structure.");

  });

  it("should make transfer between users", async () => {
    const vehicleOwnershipDatabaseInstance = await VehicleOwnershipDatabase.deployed();

    const carVin = "2ZVBPNOC0AAAA5607";
    const carModel = "Ford Mondeo";
    const vehicleType = 0;

    const id = web3.utils.fromAscii(carVin);

    // adding car first to pending ids
    await vehicleOwnershipDatabaseInstance.addVehicle(id, carModel, vehicleType, { from: accounts[0] });

    // approving by two different users
    await vehicleOwnershipDatabaseInstance.approveVehicle(id, { from: accounts[1] });
    await vehicleOwnershipDatabaseInstance.approveVehicle(id, { from: accounts[2] });

    const newOwner = accounts[1];

    await vehicleOwnershipDatabaseInstance.transferVehicle(id, newOwner, { from: accounts[0] });
    await vehicleOwnershipDatabaseInstance.approveTransfer(id, {from : newOwner});

    const storedVehicle = await vehicleOwnershipDatabaseInstance.vehicleRegistry.call(id);
    const transferredVehicle = await vehicleOwnershipDatabaseInstance.waitingForTransfers.call(id);

    assert.equal(storedVehicle[2], newOwner, "Car should have new owner.");
    assert.equal(transferredVehicle[2], false, "Transfer should not exists in waiting for transfers.");

  });

});


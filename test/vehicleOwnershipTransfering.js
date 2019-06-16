const VehicleOwnershipDatabase = artifacts.require("./VehicleOwnershipDatabase.sol");

contract("VehicleOwnershipDatabase", accounts => {

    let contract;

    beforeEach('setup contract for each test', async () => {
        contract = await VehicleOwnershipDatabase.new(accounts[0]);
    });

    it("should add vehicle to transfer list", async () => {
        const carVin = "2ZVBP8AM0AAAA5607";
        const carModel = "Ford Mondeo";
        const vehicleType = 0;

        const id = web3.utils.fromAscii(carVin);

        // adding car first to pending ids
        await contract.addVehicle(id, carModel, vehicleType, {from: accounts[0]});

        // approving by two different users
        await contract.approveVehicle(id, {from: accounts[1]});
        await contract.approveVehicle(id, {from: accounts[2]});

        const newOwner = accounts[1];

        await contract.transferVehicle(id, newOwner, {from: accounts[0]});

        const transferredVehicle = await contract.waitingForTransfers.call(id);

        assert.equal(transferredVehicle[0], accounts[0], "Car's owner should be stored.");
        assert.equal(transferredVehicle[1], newOwner, "Car's next owner should be stored.");
        assert.equal(transferredVehicle[2], true, "Car should exists in waiting for transfer structure.");

        const transferredIds = await contract.getTransferIds.call();
        const transferredId = web3.utils.toAscii(transferredIds[0]).replace(/\u0000/g, '');

        assert.equal(transferredId, carVin, "Car should exists in waiting for transfer structure.");

    });

    it("should make transfer between users", async () => {
        const carVin = "2ZVBPNOC0AAAA5607";
        const carModel = "Ford Mondeo";
        const vehicleType = 0;

        const id = web3.utils.fromAscii(carVin);

        // adding car first to pending ids
        await contract.addVehicle(id, carModel, vehicleType, {from: accounts[0]});

        // approving by two different users
        await contract.approveVehicle(id, {from: accounts[1]});
        await contract.approveVehicle(id, {from: accounts[2]});

        const newOwner = accounts[1];

        await contract.transferVehicle(id, newOwner, {from: accounts[0]});
        await contract.approveTransfer(id, {from: newOwner});

        const storedVehicle = await contract.vehicleRegistry.call(id);
        const transferredVehicle = await contract.waitingForTransfers.call(id);

        assert.equal(storedVehicle[2], newOwner, "Car should have new owner.");
        assert.equal(transferredVehicle[2], false, "Transfer should not exists in waiting for transfers.");

    });

});
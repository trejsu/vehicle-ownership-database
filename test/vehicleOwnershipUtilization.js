const VehicleOwnershipDatabase = artifacts.require("./VehicleOwnershipDatabase.sol");

contract("VehicleOwnershipDatabase", accounts => {

    let contract;

    beforeEach('setup contract for each test', async () => {
        contract = await VehicleOwnershipDatabase.new(accounts[0]);
    });

    it("should add vehicle to utilization list", async () => {
        const carVin = "2ZVBP8AM0AAAA5607";
        const carModel = "Ford Mondeo";
        const vehicleType = 0;

        const id = web3.utils.fromAscii(carVin);

        // adding car first to pending ids
        await contract.addVehicle(id, carModel, vehicleType, {from: accounts[0]});

        // approving by two different users
        await contract.approveVehicle(id, {from: accounts[1]});
        await contract.approveVehicle(id, {from: accounts[2]});

        await contract.utilizeVehicle(id, {from: accounts[0]});

        const utilizedVehicle = await contract.vehicleForUtilization.call(id);

        assert.equal(utilizedVehicle[0], 0, "Car's owner should be stored.");
        assert.equal(utilizedVehicle[1], carModel, "Car's owner should be stored.");
        assert.equal(utilizedVehicle[2], accounts[0], "Car's next owner should be stored.");
        assert.equal(utilizedVehicle[3], true, "Car should exists in waiting for utilization structure.");

        const utilizedIds = await contract.getUtilizationIds.call();
        const utilizedId = web3.utils.toAscii(utilizedIds[0]).replace(/\u0000/g, '');

        assert.equal(utilizedId, carVin, "Car should exists in waiting for utilization list.");
    });

    it("should proceed successfully car utilization", async () => {
        const carVin = "2ZVBP8AM0AAAA5607";
        const carModel = "Ford Mondeo";
        const vehicleType = 0;

        const id = web3.utils.fromAscii(carVin);

        // adding car first to pending ids
        await contract.addVehicle(id, carModel, vehicleType, {from: accounts[0]});

        // approving by two different users
        await contract.approveVehicle(id, {from: accounts[1]});
        await contract.approveVehicle(id, {from: accounts[2]});

        await contract.utilizeVehicle(id, {from: accounts[0]});

        await contract.approveUtilization(id, {from: accounts[1]});

        const storedVehicle = await contract.vehicleRegistry.call(id);
        assert.equal(storedVehicle[3], false, "Car should not exists in vehicle registry.");

        const utilizedVehicle = await contract.vehicleForUtilization.call(id);
        assert.equal(utilizedVehicle[3], false, "Car should not exists in waiting for utilization structure.");

        const utilizedIds = await contract.getUtilizationIds.call();
        assert.equal(utilizedIds.length, 0, "Utilized ids list should be empty.");

        const registeredIds = await contract.getRegisteredIds.call();
        assert.equal(registeredIds.length, 0, "Existing ids list should be empty.");
    });
});
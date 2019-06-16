const VehicleOwnershipDatabase = artifacts.require("./VehicleOwnershipDatabase.sol");

contract("VehicleOwnershipDatabase", accounts => {

    let contract;

    beforeEach('setup contract for each test', async () => {
        contract = await VehicleOwnershipDatabase.new(accounts[0]);
    });

    it("should add car to pending vehicles", async () => {
        const carVin = "1ZVBP8AM0C5265607";
        const carModel = "Ford Fiesta";
        const vehicleType = 0;

        const id = web3.utils.fromAscii(carVin);

        await contract.addVehicle(id, carModel, vehicleType, {from: accounts[0]});

        const storedVehicle = await contract.waitingForApprovals.call(id);
        const pendingIds = await contract.getPendingIds.call();
        const returnedId = web3.utils.toAscii(pendingIds[0]).replace(/\u0000/g, '');

        assert.equal(storedVehicle[0].toNumber(), 0, "Car type should be stored.");
        assert.equal(storedVehicle[1], carModel, "Car model should be stored.");
        assert.equal(storedVehicle[2], accounts[0], "Car owner should be stored.");
        assert.equal(storedVehicle[3], true, "Car should exist.");
        assert.equal(returnedId, carVin, "Vin should be added to ids list.");
    });

    it("should move vehicle to registered after two approvals", async () => {
        const carVin = "1ZVBP8AM0AAAA5607";
        const carModel = "Ford Escort";
        const vehicleType = 0;

        const id = web3.utils.fromAscii(carVin);
        // adding car first to pending ids
        await contract.addVehicle(id, carModel, vehicleType, {from: accounts[0]});

        // approving by two different users
        await contract.approveVehicle(id, {from: accounts[1]});
        await contract.approveVehicle(id, {from: accounts[2]});

        const storedVehicle = await contract.vehicleRegistry.call(id);
        const existingIds = await contract.getRegisteredIds.call();
        const returnedId = web3.utils.toAscii(existingIds[0]).replace(/\u0000/g, '');

        const notStoredVehicle = await contract.waitingForApprovals.call(id);

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
        const carVin = "1ZVBP8AM0AAAA5333";
        const carModel = "Ford Escort";
        const vehicleType = 0;

        const id = web3.utils.fromAscii(carVin);
        // adding car first to pending ids
        await contract.addVehicle(id, carModel, vehicleType, {from: accounts[0]});

        // approving by two different users
        await contract.approveVehicle(id, {from: accounts[1]});

        const notApprovedYetAccount1 = await contract.notApprovingYet(id, {from: accounts[1]});
        const notApprovedYetAccount2 = await contract.notApprovingYet(id, {from: accounts[2]});

        //check if stored in vehicle registry
        assert.equal(notApprovedYetAccount1, false, "Car should be approved already by account 1.");
        assert.equal(notApprovedYetAccount2, true, "Car should not be approved already by account 2.");

    });

    it("2 approvals should be required", async () => {
        // given
        const car = {
            vehicleType: 0,
            vehicleModel: "car model 123",
            id: "car123"
        };
        const carByteId = web3.utils.fromAscii(car.id);
        const bike = {
            vehicleType: 1,
            vehicleModel: "bike model 123",
            id: "bike123"
        };
        const bikeByteId = web3.utils.fromAscii(bike.id);

        // when account 0 creates car
        await contract.addVehicle(carByteId, car.vehicleModel, car.vehicleType, {from: accounts[0]});

        // then car is not approved and 1 vehicle pending
        let pendings = await getPendings();
        assert.equal(pendings.includes(car.id), true, 'car not approved');
        assert.equal(pendings.length, 1, '1 vehicle is pending');

        // when account 1 creates bike
        await contract.addVehicle(bikeByteId, bike.vehicleModel, bike.vehicleType, {from: accounts[1]});

        // then bike is not approved and 2 vehicles are pending
        pendings = await getPendings();
        assert.equal(pendings.includes(bike.id), true, 'bike not approved');
        assert.equal(pendings.length, 2, '2 vehicles pending');

        // when account 0 approves bike
        await contract.approveVehicle(bikeByteId, {from: accounts[0]});

        // then bike is not approved and 2 vehicles are pending
        pendings = await getPendings();
        assert.equal(pendings.includes(bike.id), true, 'bike not approved');
        assert.equal(pendings.length, 2, '2 vehicles pending');

        // when account 1 approves car
        await contract.approveVehicle(carByteId, {from: accounts[1]});

        // then car is not approved and 2 vehicles are pending
        pendings = await getPendings();
        assert.equal(pendings.includes(car.id), true, 'car not approved');
        assert.equal(pendings.length, 2, '2 vehicles pending');

        // when account 2 approves bike
        await contract.approveVehicle(bikeByteId, {from: accounts[2]});

        // then bike is approved and 1 vehicle is pending
        pendings = await getPendings();
        assert.equal(pendings.includes(bike.id), false, 'bike approved');
        assert.equal(pendings.length, 1, '1 vehicle pending');

        // when account 2 approves car
        await contract.approveVehicle(carByteId, {from: accounts[2]});

        // then car is approved and there are no pending vehicles
        pendings = await getPendings();
        assert.equal(pendings.includes(car.id), false, 'car approved');
        assert.equal(pendings.length, 0, 'no pending vehicles');

    });

    async function getPendings() {
        return (await contract.getPendingIds())
            .map(web3.utils.toAscii)
            .map(id => id.replace(/\u0000/g, ''));
    }
});

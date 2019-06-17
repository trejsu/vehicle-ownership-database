import VehicleService from '../services/VehicleService';
import VehicleTypeMapper from '../utils/vehicleTypeMapper';

const ganache = require('ganache-cli');
const Web3 = require('web3');
const VehicleOwnershipDatabase = require('../contracts/VehicleOwnershipDatabase');

const typeMapper = new VehicleTypeMapper();

let web3;
let accounts;
let contract;

beforeAll(() => {
    console.log('Setting up ganache and web3...');
    const provider = ganache.provider();
    provider.setMaxListeners(24);
    web3 = new Web3(provider);
});

beforeEach(async () => {
    console.log('Deploying contract...');
    accounts = await web3.eth.getAccounts();
    const contractInstance = new web3.eth.Contract(VehicleOwnershipDatabase['abi']);
    const contractDeployed = contractInstance.deploy({
        data: VehicleOwnershipDatabase['bytecode']
    });
    contract = await contractDeployed.send({from: accounts[0], gas: '5000000'});
});

describe('VehicleService', () => {

    it('should fail when instantiated through constructor', () => {
        expect(() => new VehicleService()).toThrow(Error);
    });

    it('addVehicle should add vehicle to waiting for approvals', async () => {
        // given
        const service = new VehicleService(web3, contract);
        const id = 'abcd';
        const vehicle = {
            vehicleType: "car",
            vehicleModel: "model",
            id: id
        };

        // when
        await service.addVehicle(vehicle);
        const vehicleFromContract = await contract.methods.waitingForApprovals(toBytes(id)).call();

        // then
        expect(vehicleFromContract.approvalsNumber).toEqual("0");
        expect(vehicleFromContract.exists).toEqual(true);
        expect(vehicleFromContract.model).toEqual("model");
        expect(vehicleFromContract.owner).toEqual(accounts[0]);
        expect(vehicleFromContract.vType).toEqual("0");
    });

    it('getPendingApprovals should return list containing pending vehicles objects', async () => {
        // given
        const service = new VehicleService(web3, contract);
        const owner = accounts[0];
        const vehicle = {
            vehicleType: "car",
            vehicleModel: "model",
            id: 'abcd'
        };
        const expectedVehicle = {
            id: 'abcd',
            model: "model",
            owner: owner,
            type: "car"
        };
        await register(vehicle, owner);

        // when
        const pendings = await service.getPendingApprovals();

        // then
        expect(pendings).toEqual([expectedVehicle]);
    });

    it('getUserPendingApprovals should return list containing only user owned vehicles objects', async () => {
        // given
        const service = new VehicleService(web3, contract);
        const user1 = accounts[0];
        const user2 = accounts[1];
        const vehicle1 = {
            vehicleType: "car",
            vehicleModel: "model",
            id: 'abcd1'
        };
        const vehicle2 = {
            vehicleType: "car",
            vehicleModel: "model",
            id: 'abcd2'
        };
        const expectedVehicle = {
            id: 'abcd1',
            model: "model",
            owner: user1,
            type: "car"
        };

        await register(vehicle1, user1);
        await register(vehicle2, user2);

        // when
        const pendings = await service.getUserPendingApprovals();

        // then
        expect(pendings.length).toEqual(1);
        expect(pendings).toEqual([expectedVehicle]);
    });

    it('getAllPendingApprovalsPossibleToApprove should not return vehicles requested by current user', async () => {
        // given
        const service = new VehicleService(web3, contract);
        const user1 = accounts[0];
        const user2 = accounts[1];
        const vehicle1 = {
            vehicleType: "car",
            vehicleModel: "model",
            id: 'abcd1'
        };
        const vehicle2 = {
            vehicleType: "car",
            vehicleModel: "model",
            id: 'abcd2'
        };
        const expectedVehicle = {
            id: 'abcd2',
            model: "model",
            owner: user2,
            type: "car"
        };

        await register(vehicle1, user1);
        await register(vehicle2, user2);

        // when
        const pendings = await service.getAllRegistrationRequestsPossibleToApprove();

        // then
        expect(pendings.length).toEqual(1);
        expect(pendings).toEqual([expectedVehicle]);
    });

    it('getAllPendingApprovalsPossibleToApprove should not return vehicles already approved by current user',
        async () => {
            // given
            const service = new VehicleService(web3, contract);
            const user2 = accounts[1];
            const vehicle1Id = 'abcd1';
            const vehicle1 = {
                vehicleType: "car",
                vehicleModel: "model",
                id: vehicle1Id
            };
            const vehicle2 = {
                vehicleType: "car",
                vehicleModel: "model",
                id: 'abcd2'
            };
            const expectedVehicle = {
                id: 'abcd2',
                model: "model",
                owner: user2,
                type: "car"
            };

            await register(vehicle1, user2);
            await register(vehicle2, user2);
            // when
            const pendings = await service.getAllRegistrationRequestsPossibleToApprove();

            // then
            expect(pendings.length).toEqual(2);

            // when
            await contract.methods.approveVehicle(toBytes(vehicle1Id))
                .send({from: accounts[0], gas: '5000000'});
            const pendingAfterApproval = await service.getAllRegistrationRequestsPossibleToApprove();

            // then
            expect(pendingAfterApproval.length).toEqual(1);
            expect(pendingAfterApproval).toEqual([expectedVehicle]);
        });

    it('getUserUtilizationPendings should return user vehicles requested for utilization', async () => {
        jest.setTimeout(10000);
        // given
        const service = new VehicleService(web3, contract);
        const vehicle = {
            vehicleType: "car",
            vehicleModel: "model",
            id: "car123"
        };
        const expectedVehicle = {
            id: 'car123',
            model: "model",
            owner: accounts[0],
            type: "car"
        };

        // when
        await register(vehicle, accounts[0]);
        await approveRegistration(vehicle.id, accounts[1]);
        await approveRegistration(vehicle.id, accounts[2]);
        await utilize(vehicle.id, accounts[0]);
        const utilizationPendings = await service.getUserUtilizationPendings();

        // then
        expect(utilizationPendings).toEqual([expectedVehicle]);
    });

    it('getUserRegisteredVehicles should return user registered vehicles', async () => {
        // given
        const service = new VehicleService(web3, contract);
        const vehicle = {
            vehicleType: "car",
            vehicleModel: "model",
            id: "car123"
        };

        // when
        await register(vehicle, accounts[0]);
        let registered = await service.getUserRegisteredVehicles();

        // then
        expect(registered.length).toBe(0);

        // when
        await approveRegistration(vehicle.id, accounts[1]);
        registered = await service.getUserRegisteredVehicles();

        // then
        expect(registered.length).toBe(0);

        // when
        await approveRegistration(vehicle.id, accounts[2]);
        registered = await service.getUserRegisteredVehicles();

        // then
        expect(registered.length).toBe(1);
    });

    it('getIncomingTransfers should return pending transfers for current user', async () => {
        // given
        const service = new VehicleService(web3, contract);
        const vehicle = {
            vehicleType: "car",
            vehicleModel: "model",
            id: "car123"
        };
        const expectedVehicle = {
            id: 'car123',
            model: "model",
            owner: accounts[1],
            type: "car"
        };

        // when
        await register(vehicle, accounts[1]);
        await approveRegistration(vehicle.id, accounts[0]);
        await approveRegistration(vehicle.id, accounts[2]);
        await transfer(vehicle.id, accounts[1], accounts[0]);
        const incomingTransfers = await service.getIncomingTransfers();

        // then
        expect(incomingTransfers).toEqual([expectedVehicle]);
    });

});

async function register(vehicle, user) {
    await contract.methods.addVehicle(
        web3.utils.fromAscii(vehicle.id),
        vehicle.vehicleModel,
        typeMapper.getVehicleCode(vehicle.vehicleType)
    ).send({from: user, gas: 3000000});
}

async function approveRegistration(id, user) {
    await contract.methods.approveVehicle(web3.utils.fromAscii(id))
        .send({from: user, gas: 3000000});
}

async function utilize(id, user) {
    await contract.methods.utilizeVehicle(web3.utils.fromAscii(id))
        .send({from: user, gas: 3000000});
}

async function transfer(id, from, to) {
    await contract.methods.transferVehicle(web3.utils.fromAscii(id), to)
        .send({from: from, gas: 3000000});
}

const toBytes = x => web3.utils.fromAscii(x);
const fromBytes = x => web3.utils.toAscii(x);


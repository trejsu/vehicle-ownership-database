import VehicleOwnershipDatabase from "../contracts/VehicleOwnershipDatabase";
import VehicleTypeMapper from "../utils/vehicleTypeMapper";

export default class VehicleService {
    constructor(web3, contract) {
        if (typeof web3 === 'undefined') {
            throw new Error('Cannot instantiate VehicleService directly. Use init function instead.');
        }
        this.web3 = web3;
        this.contract = contract;
        this.typeMapper = new VehicleTypeMapper();
    }

    static init(web3) {
        return VehicleService.initContract(web3)
            .then(contract => new VehicleService(web3, contract));
    }

    static initContract(web3) {
        return web3.eth.net.getId().then(networkId => {
            const deployedNetwork = VehicleOwnershipDatabase.networks[networkId];
            return new web3.eth.Contract(
                VehicleOwnershipDatabase.abi,
                deployedNetwork && deployedNetwork.address,
            );
        });
    }

    // todo: validation of id
    addVehicle(vehicle) {
        console.log('Adding vehicle', vehicle);
        return this.web3.eth.getAccounts()
            .then(accounts => {
                return this.contract.methods.addVehicle(
                    this.toBytes(vehicle.id),
                    vehicle.vehicleModel,
                    this.typeMapper.getVehicleCode(vehicle.vehicleType)
                ).send({from: accounts[0], gas: 3000000})
            });
    }

    async getPendingApprovals() {
        console.log('Retrieving all pending approvals...');
        const pendingIds = (await this.contract.methods.getPendingIds().call());
        const vehicles = [];
        for (let i = 0; i < pendingIds.length; i++) {
            const vehicle = await this.contract.methods.waitingForApprovals(pendingIds[i]).call();
            vehicles.push({
                id: this.fromBytes(pendingIds[i]).replace(/\u0000/g, ''),
                type: this.typeMapper.getVehicleName(parseInt(vehicle[0])),
                model: vehicle[1],
                owner: vehicle[2]
            });

        }
        console.log("Found %d pending approvals", vehicles.length);
        return vehicles;
    }

    async getUserRegisteredVehicles() {
        return new Promise((resolve) => {
            resolve([]);
        });
    }

    async getUserPendingApprovals() {
        console.log('Retrieving current user approvals...');
        const owner = (await this.web3.eth.getAccounts())[0];
        const filtered = (await this.getPendingApprovals())
            .filter(vehicle => vehicle.owner === owner);
        console.log("Filtered %d approvals", filtered.length);
        return filtered;
    }

    async getAllPendingApprovalsPossibleToApprove() {
        console.log('Retrieving approvals possible to approve...');

        const currentUser = (await this.web3.eth.getAccounts())[0];
        const vehicles = (await this.getPendingApprovals());

        const vehiclesToApprove = [];

        for (let i = 0; i < vehicles.length; i++) {
            let vehicle = vehicles[i];
            let vehicleId = this.toBytes(vehicle.id);

            console.log('Checking if vehicle %s is approvable by %s', vehicle.id, currentUser);

            const notApprovedByCurrentUser = await this.contract.methods.notApprovingYet(vehicleId).call();

            if (notApprovedByCurrentUser && vehicle.owner !== currentUser) {
                console.log('Approve possible');
                vehiclesToApprove.push(vehicle);
            } else {
                console.log('Approve not possible');
            }
        }

        console.log("Filtered %d approvals", vehiclesToApprove.length);
        return vehiclesToApprove;
    }

    // todo: implement instead of stub
    async searchForVehicle(id) {
        const currentUser = (await this.web3.eth.getAccounts())[0];
        return new Promise((resolve) => {
            const owner = "0x1673A70D48E4aB1eB7c3391EF69DF5eb818147a5";
            resolve({
                id: id,
                type: "car",
                model: "model1",
                owner: owner,
                approvable: currentUser !== owner
            })
        });
    }

    async transferVehicle(address, id) {
        return new Promise((resolve) => {
            resolve();
        });
    }

    async approveVehicle(id) {
        return this.web3.eth.getAccounts()
            .then(accounts => {
                return this.contract.methods.approveVehicle(this.toBytes(id))
                    .send({from: accounts[0], gas: 3000000})
            });
    }

    toBytes = x => this.web3.utils.fromAscii(x);
    fromBytes = x => this.web3.utils.toAscii(x);
}
import VehicleOwnershipDatabase from "../contracts/VehicleOwnershipDatabase";
import VehicleTypeMapper from "../utils/vehicleTypeMapper";

const GAS = "3000000";

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
        return web3.eth.net.getId()
            .then(networkId => {
                const deployedNetwork = VehicleOwnershipDatabase.networks[networkId];

                if (deployedNetwork) {
                    return new web3.eth.Contract(
                        VehicleOwnershipDatabase.abi,
                        deployedNetwork && deployedNetwork.address,
                    );
                }
            });
    }

    // todo: validation of id
    addVehicle(vehicle) {
        console.log('[VEHICLE SERVICE] Adding vehicle', vehicle);
        return this.web3.eth.getAccounts()
            .then(accounts => {
                return this.contract.methods.addVehicle(
                    this.toBytes(vehicle.id),
                    vehicle.vehicleModel,
                    this.typeMapper.getVehicleCode(vehicle.vehicleType)
                ).send({from: accounts[0], gas: this.GAS})
            });
    }

    async getUserUtilizationPendings() {
        console.log('[VEHICLE SERVICE] Retrieving user utilization pendings...');
        return this.getUserVehicles(
            this.contract.methods.getUtilizationIds,
            this.contract.methods.vehicleForUtilization
        );
    }

    async getUserRegisteredVehicles() {
        console.log('[VEHICLE SERVICE] Retrieving user registered vehicles...');
        return this.getUserVehicles(
            this.contract.methods.getRegisteredIds,
            this.contract.methods.vehicleRegistry
        );
    }

    async getUserVehicles(getIds, vehicleRegistry) {
        const ids = (await getIds().call());
        const currentUser = await this.getCurrentUser();
        const vehicles = [];

        function currentUserOwnerOf(vehicle) {
            return currentUser === vehicle[2];
        }

        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            const vehicle = await vehicleRegistry(id).call();
            if (currentUserOwnerOf(vehicle)) {
                vehicles.push(this.getVehicleReturnObject(id, vehicle));
            }
        }
        console.log("[VEHICLE SERVICE] Found %d vehicles", vehicles.length);
        return vehicles;
    }

    getVehicleReturnObject(id, vehicle) {
        return {
            id: this.fromBytesWithReplace(id),
            type: this.typeMapper.getVehicleName(parseInt(vehicle[0])),
            model: vehicle[1],
            owner: vehicle[2]
        };
    }

    async getCurrentUser() {
        return (await this.web3.eth.getAccounts())[0];
    }

    async getIncomingTransfers() {
        const transferIds = (await this.contract.methods.getTransferIds().call());
        const currentUser = await this.getCurrentUser();
        const vehicles = [];
        for (let i = 0; i < transferIds.length; i++) {
            const transferId = transferIds[i];
            const vehicleTransfer = await this.contract.methods.waitingForTransfers(transferId).call();
            const vehicle = await this.contract.methods.vehicleRegistry(transferId).call();
            if (currentUser === vehicleTransfer[1]) {
                vehicles.push({
                    id: this.fromBytesWithReplace(transferId),
                    type: this.typeMapper.getVehicleName(parseInt(vehicle[0])),
                    model: vehicle[1],
                    owner: vehicle[2]
                });
            }
        }
        return vehicles;
    }

    async getUserPendingApprovals() {
        console.log('[VEHICLE SERVICE] Retrieving current user approvals...');
        const owner = (await this.web3.eth.getAccounts())[0];
        const filtered = (await this.getPendingApprovals())
            .filter(vehicle => vehicle.owner === owner);
        console.log("[VEHICLE SERVICE] Filtered %d approvals", filtered.length);
        return filtered;
    }

    async getAllRegistrationRequestsPossibleToApprove() {
        console.log('[VEHICLE SERVICE] Retrieving pending approvals possible to approve...');

        const currentUser = (await this.web3.eth.getAccounts())[0];
        const vehicles = (await this.getPendingApprovals());

        const vehiclesToApprove = [];

        for (let i = 0; i < vehicles.length; i++) {
            let vehicle = vehicles[i];
            let vehicleId = this.toBytes(vehicle.id);

            const notApprovedByCurrentUser = await this.contract.methods
                .notApprovingYet(vehicleId)
                .call({from: currentUser});

            if (notApprovedByCurrentUser && vehicle.owner !== currentUser) {
                vehiclesToApprove.push(vehicle);
            }
        }

        console.log("[VEHICLE SERVICE] Filtered %d approvals", vehiclesToApprove.length);
        return vehiclesToApprove;
    }

    async getPendingApprovals() {
        console.log('[VEHICLE SERVICE] Retrieving all registration pendings...');
        return await this.getApprovals(
            this.contract.methods.getPendingIds,
            this.contract.methods.waitingForApprovals
        );
    }

    async getApprovals(getIds, getVehicle) {
        const ids = (await getIds().call());
        const vehicles = [];

        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            const vehicle = await getVehicle(id).call();
            vehicles.push(this.getVehicleReturnObject(id, vehicle));
        }
        console.log("[VEHICLE SERVICE] Found %d vehicles waiting for approval", vehicles.length);
        return vehicles;
    }

    async getAllUtilizationRequestsPossibleToApprove() {
        console.log('[VEHICLE SERVICE] Retrieving utilization approvals possible to approve...');

        const currentUser = (await this.web3.eth.getAccounts())[0];
        const vehicles = (await this.getUtilizationApprovals());

        console.log('[VEHICLE SERVICE] Vehicles pending for utilization:', vehicles);

        const vehiclesToApprove = [];

        for (let i = 0; i < vehicles.length; i++) {
            let vehicle = vehicles[i];

            if (vehicle.owner !== currentUser) {
                vehiclesToApprove.push(vehicle);
            }
        }

        console.log("[VEHICLE SERVICE] Filtered %d approvals", vehiclesToApprove.length);
        return vehiclesToApprove;
    }

    async getUtilizationApprovals() {
        console.log('[VEHICLE SERVICE] Retrieving all utilization pendings...');
        return await this.getApprovals(
            this.contract.methods.getUtilizationIds,
            this.contract.methods.vehicleForUtilization
        );
    }

    async searchForVehicle(id) {
        console.log('[VEHICLE SERVICE] Searching for vehicle %s', id);
        const currentUser = (await this.web3.eth.getAccounts())[0];

        const vehicleFromRegistry = await this.contract.methods.vehicleRegistry(this.toBytes(id)).call();
        if (vehicleFromRegistry[3]) {
            const transferIds = await this.contract.methods.getTransferIds().call();

            if (transferIds.includes(this.toBytes(id))) {
                const vehicleTransfer = await this.contract.methods.waitingForTransfers(this.toBytes(id)).call();

                const isApprovable = currentUser === vehicleTransfer[1];

                console.log('[VEHICLE SERVICE] Vehicle found in transfer: ', vehicleFromRegistry);
                return this.formatVehicle(id, vehicleFromRegistry, isApprovable)
            }

            console.log('[VEHICLE SERVICE] Vehicle found in registry: ', vehicleFromRegistry);
            return this.formatVehicle(id, vehicleFromRegistry, false)
        }

        const vehicleFromPendings = await this.contract.methods.waitingForApprovals(this.toBytes(id)).call();
        if (vehicleFromPendings[3]) {
            const isNotVehicleOwner = currentUser !== vehicleFromPendings[2];

            const notApprovedByUser = await this.contract.methods.notApprovingYet(this.toBytes(id))
                .call({from: currentUser});

            const isApprovable = isNotVehicleOwner && notApprovedByUser;

            console.log('[VEHICLE SERVICE] Vehicle found in pendings: ', vehicleFromPendings);
            return this.formatVehicle(id, vehicleFromPendings, isApprovable)
        }

        const vehiclesForUtilization = await this.contract.methods.vehicleForUtilization(this.toBytes(id)).call();
        if (vehiclesForUtilization[3]) {
            const isApprovable = currentUser !== vehiclesForUtilization[2];

            console.log('[VEHICLE SERVICE] Vehicle found in utilization: ', vehiclesForUtilization);
            return this.formatVehicle(id, vehiclesForUtilization, isApprovable)
        }

        console.log('[VEHICLE SERVICE] Vehicle %s not found!', id);
        return null;
    }

    formatVehicle(id, vehicle, approve) {
        return {
            id: id,
            type: this.typeMapper.getVehicleName(parseInt(vehicle[0])),
            model: vehicle[1],
            owner: vehicle[2],
            approvable: approve
        }
    }

    async transferVehicle(id, address) {
        return this.web3.eth.getAccounts()
            .then(accounts => {
                return this.contract.methods.transferVehicle(this.toBytes(id), address)
                    .send({from: accounts[0], gas: GAS})
            });
    }

    async approveVehicle(id) {
        return this.web3.eth.getAccounts()
            .then(accounts => {
                return this.contract.methods.approveVehicle(this.toBytes(id))
                    .send({from: accounts[0], gas: GAS})
            });
    }

    async approveUtilization(id) {
        return this.web3.eth.getAccounts()
            .then(accounts => {
                return this.contract.methods.approveUtilization(this.toBytes(id))
                    .send({from: accounts[0], gas: GAS})
            });
    }

    async utilizeVehicle(id) {
        return this.web3.eth.getAccounts()
            .then(accounts => {
                return this.contract.methods.utilizeVehicle(this.toBytes(id))
                    .send({from: accounts[0], gas: GAS})
            });
    }

    async approveTransfer(id) {
        return this.web3.eth.getAccounts()
            .then(accounts => {
                return this.contract.methods.approveTransfer(this.toBytes(id))
                    .send({from: accounts[0], gas: GAS})
            });
    }

    async isTransferPossible(id, address) {
        console.log('[VEHICLE SERVICE] Check if transfer possible');
        const currentUser = await this.getCurrentUser();

        const registeredIds = (await this.contract.methods.getRegisteredIds().call())
            .map(this.fromBytesWithReplace);
        const transferIds = (await this.contract.methods.getTransferIds().call())
            .map(this.fromBytesWithReplace);

        const requiredConditions = [{
            condition: registeredIds.includes(id),
            reason: `You do not own vehicle ${id}. You can transfer only your registered vehicles!`
        }, {
            condition: !transferIds.includes(id),
            reason: `Vehicle ${id} is already in transfer!`
        }, {
            condition: currentUser !== address,
            reason: `You cannot transfer vehicle to yourself!`
        }];

        const brokenCondition = requiredConditions.find(x => !x.condition);
        const conditionsFulfilled = brokenCondition === undefined;

        return conditionsFulfilled ?
            {transferPossible: true, reason: ""} :
            {transferPossible: false, reason: brokenCondition.reason};
    }

    async isIdAvailable(id) {
        const registeredIds = (await this.getRegisteredIds());
        const pendingIds = (await this.getPendingIds());

        return !registeredIds
            .concat(pendingIds)
            .includes(id);
    }

    async getRegisteredIds() {
        return await this.getIds(this.contract.methods.getRegisteredIds);
    }

    async getPendingIds() {
        return await this.getIds(this.contract.methods.getPendingIds);
    }

    async getTransferIds() {
        return await this.getIds(this.contract.methods.getTransferIds);
    }

    async getUtilizationIds() {
        return await this.getIds(this.contract.methods.getUtilizationIds);
    }

    async getIds(getIdsFunction) {
        return (await getIdsFunction().call())
            .map(this.fromBytesWithReplace);
    }

    toBytes = x => this.web3.utils.fromAscii(x);
    fromBytes = x => this.web3.utils.toAscii(x);
    fromBytesWithReplace = x => this.fromBytes(x).replace(/\u0000/g, '');
}
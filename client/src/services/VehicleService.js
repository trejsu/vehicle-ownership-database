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

  addCar = car => this.addVehicle(car, car.carVin);

  addBike = bike => this.addVehicle(bike, bike.bikeSerial);

  // todo: validation of id
  addVehicle(vehicle, id) {
    return this.web3.eth.getAccounts()
    .then(accounts => {
      return this.contract.methods.addVehicle(
        this.web3.utils.fromAscii(id),
        vehicle.vehicleModel,
        this.typeMapper.getVehicleCode(vehicle.vehicleType)
      ).send({from: accounts[0], gas: 3000000})
    });
  }

  async getPendingApprovals() {
    const pendingIds = (await this.contract.methods.getPendingIds().call());
    const vehicles = [];
    for (let i = 0; i < pendingIds.length; i++) {
      const vehicle = await this.contract.methods.waitingForApprovals(pendingIds[i]).call();
      vehicles.push({
        id: this.web3.utils.toAscii(pendingIds[i]).replace(/\u0000/g, ''),
        type: this.typeMapper.getVehicleName(parseInt(vehicle[0])),
        model: vehicle[1],
        owner: vehicle[2]
      });
    }
    return vehicles;
  }

  async getUserPendingApprovals() {
    const owner = (await this.web3.eth.getAccounts())[0];
    return this.getPendingApprovals()
      .filter(vehicle => vehicle.owner === owner);
  }
}
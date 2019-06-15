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

  addVehicle(vehicle, id) {
    return this.web3.eth.getAccounts()
    .then(accounts =>
      this.contract.methods.addVehicle(
        id,
        vehicle.vehicleModel,
        this.typeMapper.getVehicleCode(vehicle.vehicleType)
      ).send({from: accounts[0]}));
  }

}
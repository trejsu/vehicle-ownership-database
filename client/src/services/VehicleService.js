import SimpleStorageContract from "../contracts/SimpleStorage";

export default class VehicleService {
  constructor(contract) {
    if (typeof contract === 'undefined') {
      throw new Error('Cannot instantiate VehicleService directly. Use init function instead.');
    }
    this.contract = contract;
  }

  static init(web3) {
    return VehicleService.initContract(web3)
    .then(contract => new VehicleService(contract));
  }

  static initContract(web3) {
    return web3.eth.net.getId().then(networkId => {
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      return new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
    });
  }

  addCar(car) {
    console.log('Adding car.');
  }

  addBike(bike) {
    console.log('Adding bike.');
  }
}
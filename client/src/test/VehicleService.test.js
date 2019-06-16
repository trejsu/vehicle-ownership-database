// todo: change require to imports
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
provider.setMaxListeners(15);
const web3 = new Web3(provider);
const contract = require('../contracts/VehicleOwnershipDatabase');
const contractInterface = contract['abi'];
const contractBytecode = contract['bytecode'];
import VehicleService from '../services/VehicleService';

// todo: probably to remove
let accounts;
let vehicleDb;

// todo: fix too log execution

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  const contractInstance = new web3.eth.Contract(contractInterface);
  const contractDeployed = contractInstance.deploy({
    data: contractBytecode
  });
  vehicleDb = await contractDeployed.send({from: accounts[0], gas: '5000000'});
});

describe('VehicleService', () => {

  it('should fail when instantiated through constructor', () => {
    expect(() => new VehicleService()).toThrow(Error);
  });

  it('addVehicle should return promise with transaction', async () => {
    const service = new VehicleService(web3, vehicleDb);
    const vehicle = {
      vehicleType: "car",
      vehicleModel: "model",
      id: 'abcd'
    };
    return service.addVehicle(vehicle)
      .then(tx => expect(tx).not.toBeUndefined());
  });

  // // todo: assert retrned objects
  // it('getPendingApprovals should return list of all pending vehicles', async () => {
  //   const service = new VehicleService(web3, vehicleDb);
  //   const vehicle = {
  //     vehicleType: "car",
  //     vehicleModel: "model",
  //     id: 'abcd'
  //   };
  //   await
  //   const pendings = await service.getPendingApprovals();
  //   console.log(pendings);
  //   expect(pendings.every(p => p.length < 7)).toBeTruthy();
  // });

});





//

//
// // todo: change tests to be independent
// // todo: assert returned objects
// it('getUserPendingApprovals should return list of vehicles owned by current user', async () => {
//   const service = await VehicleService.init(web3);
//   const pendings = await service.getUserPendingApprovals();
//   console.log(pendings);
//   expect(pendings.every(p => p.length < 7)).toBeTruthy();
// });
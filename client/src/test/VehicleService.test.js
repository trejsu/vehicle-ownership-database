const ganache = require('ganache-cli');
const Web3 = require('web3');
const contract = require('../contracts/VehicleOwnershipDatabase');
import VehicleService from '../services/VehicleService';
import VehicleTypeMapper from '../utils/vehicleTypeMapper';

const typeMapper = new VehicleTypeMapper();

let web3;
let accounts;
let vehicleDb;

// todo: fix too log execution

beforeAll(() => {
  console.log('Setting up ganache and web3...');
  const provider = ganache.provider();
  provider.setMaxListeners(16);
  web3 = new Web3(provider);
});

beforeEach(async () => {
  console.log('Deploying contract...');
  accounts = await web3.eth.getAccounts();
  const contractInstance = new web3.eth.Contract(contract['abi']);
  const contractDeployed = contractInstance.deploy({
    data: contract['bytecode']
  });
  vehicleDb = await contractDeployed.send({from: accounts[0], gas: '5000000'});
});

describe('VehicleService', () => {

  it('should fail when instantiated through constructor', () => {
    expect(() => new VehicleService()).toThrow(Error);
  });

  // todo: check from contract if vehicle was really added
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

  it('getPendingApprovals should return list containing pending vehicles objects', async () => {
    // given
    const service = new VehicleService(web3, vehicleDb);
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
    await addVehicle(vehicle, owner);

    // when
    const pendings = await service.getPendingApprovals();

    // then
    expect(pendings).toEqual([expectedVehicle]);
  });

  it('getUserPendingApprovals should return list containing only user owned vehicles objects', async () => {
    // given
    const service = new VehicleService(web3, vehicleDb);
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

    await addVehicle(vehicle1, user1);
    await addVehicle(vehicle2, user2);

    // when
    const pendings = await service.getUserPendingApprovals();

    // then
    expect(pendings.length).toEqual(1);
    expect(pendings).toEqual([expectedVehicle]);
  })

});

async function addVehicle(vehicle, owner) {
  await vehicleDb.methods.addVehicle(
    web3.utils.fromAscii(vehicle.id),
    vehicle.vehicleModel,
    typeMapper.getVehicleCode(vehicle.vehicleType)
  ).send({from: owner, gas: 3000000});
}


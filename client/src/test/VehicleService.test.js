import VehicleService from "../services/VehicleService";
import Web3 from "web3";
import truffleConfig from "../../../truffle-config";

const host = truffleConfig.networks.develop.host;
const port = truffleConfig.networks.develop.port;
const provider = new Web3.providers.HttpProvider('http://' + host + ':' + port);
const web3 = new Web3(provider);

it('should fail when instantiated through constructor', () => {
  expect(() => new VehicleService()).toThrow(Error);
});

// todo: change random strings to new contract with every test run
it('addCar should return promise with transaction', async () => {
  const service = await VehicleService.init(web3);
  const carVin = Math.random().toString(36).substring(7);
  return service.addCar({vehicleType: "car", vehicleModel: "model", carVin: carVin})
    .then(tx => expect(tx).not.toBeUndefined());
});

// todo: change tests to be independent
// todo: assert retrned objects
it('getPendingApprovals should return list of vehicles', async () => {
  const service = await VehicleService.init(web3);
  const pendings = await service.getPendingApprovals();
  console.log(pendings);
  expect(pendings.every(p => p.length < 7)).toBeTruthy();
});

// todo: change tests to be independent
// todo: assert returned objects
it('getUserPendingApprovals should return list of vehicles owned by current user', async () => {
  const service = await VehicleService.init(web3);
  const pendings = await service.getUserPendingApprovals();
  console.log(pendings);
  expect(pendings.every(p => p.length < 7)).toBeTruthy();
});
import VehicleService from "../services/VehicleService";
import Web3 from "web3";

// todo: get host from config
const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
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
it('getPendingApprovals should return list of vehicle ids', async () => {
  const service = await VehicleService.init(web3);
  const pendings = await service.getPendingApprovals();
  console.log(pendings);
});
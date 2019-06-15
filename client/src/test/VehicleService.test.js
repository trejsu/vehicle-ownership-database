import VehicleService from "../services/VehicleService";
import Web3 from "web3";

// todo: get host from config
const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
const web3 = new Web3(provider);

it('has addCar and addBike methods', async () => {
  const service = await VehicleService.init(web3);
  service.addCar({vehicleType: "car", vehicleModel: "model", carVim: "xxx"});
  service.addBike({vehicleType: "bike", vehicleModel: "model", bikeSerial: "xxx"});
});

it('should fail when instantiated through constructor', () => {
  expect(() => new VehicleService()).toThrow(Error);
});
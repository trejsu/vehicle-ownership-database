import VehicleService from "../src/services/VehicleService";

it('has addCar and addBike methods', () => {
  const service = new VehicleService();
  service.addCar({});
  service.addBike({});
});
export default class VehicleTypeMapper {

    constructor() {
        this.vehicleMap = new Map();
        this.vehicleMap.set("car",  0);
        this.vehicleMap.set("bike", 1);
    }

    getVehicleCode = (name) => this.vehicleMap.get(name);

    getVehicleName = (code) => {
        for (const [key, value] of this.vehicleMap.entries()) {
            if (value === code) return key;
        }
    }
}
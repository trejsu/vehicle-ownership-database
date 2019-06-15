pragma solidity ^0.5.8;

contract VehicleOwnershipDatabase {

    enum VehicleType { Car, Bike }

    struct Vehicle {
        VehicleType vType;
        string model;
        address owner;
        bool exists;
    }

    mapping (bytes32 => Vehicle) public waitingForApprovals;

    modifier isNotInPending(bytes32 _id) {
        require(!waitingForApprovals[_id].exists);
        _;
    }

    function addVehicle(bytes32 _id, string memory _vehicleModel, uint _vehicleType) isNotInPending(_id) public {

        Vehicle memory newVehicle = Vehicle(VehicleType(_vehicleType), _vehicleModel, msg.sender, true);

        waitingForApprovals[_id] = newVehicle;
    }
}
pragma solidity ^0.5.8;

contract VehicleOwnershipDatabase {

    enum VehicleType { Car, Bike }

    struct Vehicle {
        VehicleType vType;
        string model;
        address owner;
        bool exists;
    }

    struct VehicleTemp {
        VehicleType vType;
        string model;
        address owner;
        bool exists;
        mapping(address => bool) approvals;
        uint approvalsNumber;
    }

    struct VehicleTransfer {
        address owner;
        address nextOwner;
        bool exists;
    }

    mapping (bytes32 => VehicleTemp) public waitingForApprovals;
    mapping (bytes32 => VehicleTransfer) public waitingForTransfers;
    mapping (bytes32 => Vehicle) public vehicleRegistry;
    bytes32[] public pendingIds;
    bytes32[] public existingIds;
    bytes32[] public transferIds;

    modifier canBeRegistered(bytes32 _id) {
        require(!waitingForApprovals[_id].exists);
        require(!vehicleRegistry[_id].exists);
        _;
    }

    modifier canApprove(bytes32 _id, address _sender) {
        require(waitingForApprovals[_id].exists);
        require(!waitingForApprovals[_id].approvals[_sender]);
        _;
    }

    modifier canSubmitTransfer(bytes32 _id, address _sender) {
        require(vehicleRegistry[_id].exists);
        require(vehicleRegistry[_id].owner == _sender);
        _;
    }

    modifier canApproveTransfer(bytes32 _id, address _sender) {
        require(waitingForTransfers[_id].exists);
        require(waitingForTransfers[_id].nextOwner == _sender);
        _;
    }

    function addVehicle(bytes32 _id, string memory _vehicleModel, uint _vehicleType) canBeRegistered(_id) public {
        VehicleTemp memory newVehicle = VehicleTemp(VehicleType(_vehicleType), _vehicleModel, msg.sender, true, 0);
        pendingIds.push(_id);
        waitingForApprovals[_id] = newVehicle;
    }

    function approveVehicle(bytes32 _id) canApprove(_id, msg.sender) public {
        VehicleTemp storage vehicle = waitingForApprovals[_id];

        //check if approving user is not owner
        require(vehicle.owner != msg.sender);

        vehicle.approvals[msg.sender] = true;
        vehicle.approvalsNumber += 1;

        //check if vehicle has already two approvals
        if(vehicle.approvalsNumber == 2 ) {

            // creating existing in registry vehicle
            Vehicle memory createdVehicle = Vehicle({
                vType: vehicle.vType,
                model: vehicle.model,
                owner: vehicle.owner,
                exists : true
                });

            vehicleRegistry[_id] = createdVehicle;
            existingIds.push(_id);

            //removing vehicle from waiting for approval list
            delete waitingForApprovals[_id];

            //removing vehicle from pendingIds list
            for(uint i=0; i < pendingIds.length; i++) {
                if(pendingIds[i] == _id) {
                    delete pendingIds[i];
                }
            }
        }

    }

    function transferVehicle(bytes32 _id, address nextOwner) canSubmitTransfer(_id, msg.sender) public {
        Vehicle storage vehicle = vehicleRegistry[_id];
        VehicleTransfer memory transfer =  VehicleTransfer(vehicle.owner, nextOwner, true);
        waitingForTransfers[_id] = transfer;
        transferIds.push(_id);
    }

    function approveTransfer(bytes32 _id) canApproveTransfer(_id, msg.sender) public {

        Vehicle storage vehicle = vehicleRegistry[_id];
        VehicleTransfer memory transfer = waitingForTransfers[_id];
        vehicle.owner = transfer.nextOwner;

        //removing vehicle from waiting for transfer
        delete waitingForTransfers[_id];

        //removing vehicle from transferIds list
        for(uint i=0; i < transferIds.length; i++) {
            if(transferIds[i] == _id) {
                delete transferIds[i];
            }
        }
    }

    function getRegisteredIds() public view returns (bytes32[] memory ids) {
        return existingIds;
    }

    function notApprovingYet(bytes32 _id) public view returns (bool result) {
        require(waitingForApprovals[_id].exists);

        return !waitingForApprovals[_id].approvals[msg.sender];
    }

    function getPendingIds() public view returns (bytes32[] memory _ids) {
        return pendingIds;
    }

    function getTransferIds() public view returns (bytes32[] memory _ids) {
        return transferIds;
    }
}
import React, {Component} from "react";

import VehicleInfo from "./VehicleInfo";

export default class AllPendingVehicles extends Component {
    state = {pendingApprovalVehicles: []};
    vehicleService = this.props.vehicleService;

    componentDidMount = async () => {
        this.vehicleService.getPendingApprovals()
            .then(response => {
                this.setState({pendingApprovalVehicles: response});
            });
    };

    render() {
        return (
            <div>
                <div className={"all-pending-vehicles-title"}>
                    List of all pending approvals
                </div>

                {this.state.pendingApprovalVehicles.length > 0 &&
                <div>
                    {this.state.pendingApprovalVehicles.map(vehicle =>
                        <VehicleInfo key={vehicle.id} vehicle={vehicle}/>)}
                </div>}

                {this.state.pendingApprovalVehicles.length === 0 &&
                <div>
                    Something went wrong?
                </div>}
            </div>
        );
    }
}
import React, {Component} from "react";

import VehicleInfo from "./VehicleInfo";
import ApproveVehicle from "./ApproveVehicle";

export default class AllPendingVehicles extends Component {
    state = {pendingApprovalVehicles: []};
    vehicleService = this.props.vehicleService;

    componentDidMount = async () => {
        this.loadData();
    };

    loadData() {
        this.vehicleService.getAllPendingApprovalsPossibleToApprove()
            .then(response => {
                this.setState({
                    pendingApprovalVehicles: response,
                    downloaded: true,
                });
            })
            .catch(() => {
                this.setState({
                    downloaded: true,
                    error: true
                })
            });
    }

    getAllPendingApprovalsDownloadError = () => {
        return (
            <div>
                Something went wrong ...
            </div>
        )
    };

    handleApproveClicked = (id) => {
        this.vehicleService.approveVehicle(id)
            .then(response => {
                console.log("Approve vehicle response ", response);
                this.loadData();
            });
    };

    getVehicleToApprove = (vehicle) => {
        return (
            <div key={vehicle.id}>
                <VehicleInfo
                    vehicle={vehicle}/>
                <ApproveVehicle
                    vehicleId={vehicle.id}
                    handleApproveClicked={this.handleApproveClicked}/>
            </div>
        );
    };

    getPendingApprovalVehicleInfos = () => {
        return (
            this.state.pendingApprovalVehicles.map(vehicle =>
                this.getVehicleToApprove(vehicle))
        );
    };

    getPendingApprovalVehiclesContent = () => {
        return (
            <div>
                <div className={"all-pending-vehicles-title"}>
                    List of all pending approvals
                </div>
                {this.getPendingApprovalVehicleInfos()}
            </div>
        );
    };

    getVehicles = () => {
        const content = this.state.pendingApprovalVehicles &&
        this.state.pendingApprovalVehicles.length > 0 ?
            this.getPendingApprovalVehiclesContent() :
            this.getDefault();

        return (
            content
        )
    };

    getDefault = () => {
        return (
            <div>
                <div className={"mine-vehicles"}>
                    List of all pending approvals is empty
                </div>
            </div>
        )
    };

    getWait = () => {
        return (
            <div>
                Please wait...
            </div>
        )
    };

    render() {
        const content = this.state.downloaded ?
            (this.state.error ?
                this.getAllPendingApprovalsDownloadError() :
                this.getVehicles()) :
            this.getWait();

        return (
            content
        );
    }
}
import React, {Component} from "react";

import VehicleInfo from "./VehicleInfo";

export default class MineVehicles extends Component {
    state = {
        downloadPending: false,
        downloadRegistered: false,
        error: false,
        pendingVehicles: [],
        registeredVehicles: []
    };
    vehicleService = this.props.vehicleService;

    componentDidMount = async () => {
        this.vehicleService.getUserPendingApprovals()
            .then(response => {
                this.setState({
                    pendingVehicles: response
                });
            })
            .catch(() => {
                this.setState({
                    error: true
                })
            })
            .finally(() => {
                this.setState({
                    downloadPending: true
                });
            });

        this.vehicleService.getUserRegisteredVehicles()
            .then(response => {
                this.setState({
                    registeredVehicles: response
                });
            })
            .catch(() => {
                this.setState({
                    error: true
                })
            })
            .finally(() => {
                this.setState({
                    downloadRegistered: true
                });
            });
    };

    getVehiclesDownloadError = () => {
        return (
            <div>
                Something went wrong ...
            </div>
        )
    };

    getMinePendingApprovalVehicleInfos = (vehicles) => {
        return (
            vehicles.map(vehicle =>
                <VehicleInfo
                    key={vehicle.id}
                    vehicle={vehicle}/>)
        );
    };

    getVehiclesContent = (vehicles) => {
        return (
            <div>
                <div className={"mine-vehicles-title"}>
                    List of mine vehicles
                </div>
                {this.getMinePendingApprovalVehicleInfos(vehicles)}
            </div>
        );
    };

    getVehicles = () => {
        const vehicles = this.state.pendingVehicles.concat(this.state.registeredVehicles);

        return vehicles && vehicles.length > 0 ?
            this.getVehiclesContent(vehicles) :
            this.getDefault();
    };

    getDefault = () => {
        return (
            <div>
                <div className={"mine-vehicles"}>
                    List of mine vehicles is empty
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
        return this.state.downloadRegistered || this.state.downloadPending ?
            (this.state.error ?
                this.getVehiclesDownloadError() :
                this.getVehicles()) :
            this.getWait();
    }
}
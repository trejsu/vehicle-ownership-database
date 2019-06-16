import React, {Component} from "react";

import VehicleInfo from "./VehicleInfo";

export default class MineVehicles extends Component {
    state = {
        downloadPending: false,
        downloadRegistered: false,
        downloadTransfered: false,
        error: false,
        pendingVehicles: [],
        registeredVehicles: [],
        transferedVehicleIds: []
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

        this.vehicleService.getTransferIds()
            .then(response => {
                console.log(response);
                this.setState({
                    transferedVehicleIds: response
                })
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    error: true
                })
            })
            .finally(() => {
                this.setState({
                    downloadTransfered: true
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
        const pendingVehicles = this.state.pendingVehicles
            .map(vehicle => ({...vehicle, status: "pending"}));

        const registeredVehicles = this.state.registeredVehicles
            .filter(vehicle => !this.state.transferedVehicleIds.contains(vehicle.id))
            .map(vehicle => ({...vehicle, status: "registered"}));

        const transferedVehicles = this.state.registeredVehicles
            .filter(vehicle => this.state.transferedVehicleIds.contains(vehicle.id))
            .map(vehicle => ({...vehicle, status: "transfer"}));

        const vehicles = pendingVehicles
            .concat(registeredVehicles)
            .concat(transferedVehicles);

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
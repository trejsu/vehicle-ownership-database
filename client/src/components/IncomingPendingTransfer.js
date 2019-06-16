import React, {Component} from "react";

import VehicleInfo from "./VehicleInfo";
import ApproveVehicle from "./ApproveVehicle";

export default class IncomingPendingTransfer extends Component {
    state = {
        download: false,
        error: false,
        vehicles: [],
    };
    vehicleService = this.props.vehicleService;

    componentDidMount = async () => {
        this.vehicleService.getIncomingPendingTransfer()
            .then(response => {
                this.setState({
                    vehicles: response
                });
            })
            .catch(() => {
                this.setState({
                    error: true
                })
            })
            .finally(() => {
                this.setState({
                    download: true
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

    handleApproveClicked = (id) => {
        this.vehicleService.approveVehicle(id)
            .then(() => {
                console.log("approved ", id);
            });
    };

    getIncomingPendingTransferVehicleInfos = (vehicles) => {
        return (
            vehicles.map(vehicle =>
                <div>
                    <VehicleInfo
                        key={vehicle.id}
                        vehicle={vehicle}/>
                    <ApproveVehicle
                        vehicleId={this.state.vehicle.id}
                        handleApproveClicked={this.handleApproveClicked}/>
                </div>
            )
        );
    };

    getVehiclesContent = (vehicles) => {
        return (
            <div>
                <div className={"mine-vehicles-title"}>
                    List of incoming pending transfer
                </div>
                {this.getIncomingPendingTransferVehicleInfos(vehicles)}
            </div>
        );
    };

    getVehicles = () => {
        const vehicles = this.state.vehicles
            .map(vehicle => ({...vehicle, status: "transfer"}));

        return vehicles && vehicles.length > 0 ?
            this.getVehiclesContent(vehicles) :
            this.getDefault();
    };

    getDefault = () => {
        return (
            <div>
                <div className={"incoming-pending-transfer-vehicles"}>
                    List of incoming pending vehicle transfer is empty
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
        return this.state.download ?
            (this.state.error ?
                this.getVehiclesDownloadError() :
                this.getVehicles()) :
            this.getWait();
    }
}
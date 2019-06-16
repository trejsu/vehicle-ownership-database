import React, {Component} from "react";

import VehicleInfo from "./VehicleInfo";

export default class MineVehicles extends Component {
    state = {downloaded: false};
    vehicleService = this.props.vehicleService;

    componentDidMount = async () => {
        this.vehicleService.getUserPendingApprovals()
            .then(response => {
                this.setState({
                    vehicles: response,
                    downloaded: true,
                });
            })
            .catch(() => {
                this.setState({
                    downloaded: true,
                    error: true
                })
            });
    };

    getVehiclesDownloadError = () => {
        return (
            <div>
                Something went wrong ...
            </div>
        )
    };

    getMinePendingApprovalVehicleInfos = () => {
        return (
            this.state.vehicles.map(vehicle =>
                <VehicleInfo
                    key={vehicle.id}
                    vehicle={vehicle}/>)
        );
    };

    getVehiclesContent = () => {
        return (
            <div>
                <div className={"mine-vehicles-title"}>
                    List of mine vehicles
                </div>
                {this.getMinePendingApprovalVehicleInfos()}
            </div>
        );
    };

    getVehicles = () => {
        return this.state.vehicles && this.state.vehicles.length > 0 ?
            this.getVehiclesContent() :
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
        return this.state.downloaded ?
            (this.state.error ?
                this.getVehiclesDownloadError() :
                this.getVehicles()) :
            this.getWait();
    }
}
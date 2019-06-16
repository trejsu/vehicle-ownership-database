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
            .catch(error => {
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

    getVehiclesContent = () => {
        return (
            <div>
                <div className={"mine-vehicles-title"}>
                    List of mine vehicles
                </div>
                {this.state.vehicles.map(vehicle =>
                    <VehicleInfo
                        key={vehicle.id}
                        vehicle={vehicle}/>)}
            </div>
        );
    };

    getVehicles = () => {
        const content = this.state.vehicles && this.state.vehicles.length > 0 ?
            this.getVehiclesContent() :
            this.getDefault();

        return (
            content
        )
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
        const content = this.state.downloaded ?
            (this.state.error ?
                this.getVehiclesDownloadError() :
                this.getVehicles()) :
            this.getWait();

        return (
            content
        );
    }
}
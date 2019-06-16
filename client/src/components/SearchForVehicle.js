import React, {Component} from "react";

import VehicleInfo from "./VehicleInfo";

export default class SearchForVehicle extends Component {
    state = {error: false, downloaded: false};
    vehicleService = this.props.vehicleService;

    handleIdChanged = (event) => {
        this.setState({id: event.target.value})
    };

    handleRequestClicked = () => {
        const id = this.state.id;
        this.setState({id: null, vehicle: null, error: false, downloaded: false});
        this.vehicleService.searchForVehicle(id)
            .then(response => {
                this.setState({vehicle: response, downloaded: true})
            })
            .catch(() => {
                this.setState({error: true, downloaded: true});
            });
    };

    getVehicleInfo = () => {
        return (
            <div>
                Found vehicle
                <VehicleInfo
                    key={this.state.vehicle.id}
                    vehicle={this.state.vehicle}/>
            </div>
        );
    };

    getVehicleNotFoundInfo = () => {
        return (
            <div>
                Vehicle not found
            </div>
        )
    };

    getErrorMessage = () => {
        return (
            <div>
                There was some error...
            </div>
        );
    };

    getVehicleResult() {
        const content = this.state.downloaded ?
            (this.state.error ?
                this.getErrorMessage() :
                (this.state.vehicle ?
                    this.getVehicleInfo() :
                    this.getVehicleNotFoundInfo())) :
            null;

        return (
            content
        );
    };

    render() {
        return (
            <div>
                <div>
                    <div className={"search-for-vehicles-title"}>
                        Search for vehicle
                    </div>
                    <div>
                        <input
                            placeholder={"ID"}
                            defaultValue={this.state.id}
                            onChange={this.handleIdChanged}/>
                    </div>

                    <button type={"button"}
                            className={"btn btn-primary"}
                            onClick={this.handleRequestClicked}>
                        Request
                    </button>
                </div>
                {this.getVehicleResult()}
            </div>
        )
    }
}
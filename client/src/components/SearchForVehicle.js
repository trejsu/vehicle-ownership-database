import React, {Component} from "react";

import VehicleInfo from "./VehicleInfo";
import ApproveVehicle from "./ApproveVehicle";

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

    handleApproveClicked = (id) => {
        this.vehicleService.approveVehicle(id)
            .then(() => {
                console.log("approved ", id);
            });
    };


    getVehicleInfo = () => {
        return (
            <div>
                Found vehicle
                <VehicleInfo
                    vehicle={this.state.vehicle}/>
                <ApproveVehicle
                    vehicleId={this.state.vehicle.id}
                    handleApproveClicked={this.handleApproveClicked}/>
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
        return this.state.downloaded ?
            (this.state.error ?
                this.getErrorMessage() :
                (this.state.vehicle ?
                    this.getVehicleInfo() :
                    this.getVehicleNotFoundInfo())) :
            null;
    };

    render() {
        return (
            <div>
                <div className={"search-for-vehicle-title"}>
                    Search for vehicle
                </div>
                <div className={"search-for-vehicle-panel"}>
                    <div>
                        <input
                            placeholder={"ID"}
                            defaultValue={this.state.id}
                            onChange={this.handleIdChanged}/>
                    </div>

                    <div>
                        <button type={"button"}
                                className={"btn btn-primary"}
                                onClick={this.handleRequestClicked}>
                            Request
                        </button>
                    </div>

                    {this.getVehicleResult()}
                </div>
            </div>
        )
    }
}
import React, {Component} from "react";

export default class VehicleUtilization extends Component {
    state = {};
    vehicleId = this.props.vehicleId;
    handleUtilization = this.props.handleUtilization;

    onUtilizationClicked = (event) => {
        this.handleUtilization(event.target.id)
    };

    getUtilizeButton = () => {
        return (
            <div className={"vehicle-utilization-action row"}>
                <button type={"button"}
                        className={"btn btn-danger"}
                        id={this.vehicleId}
                        onClick={this.onUtilizationClicked}>
                    Utilize
                </button>
            </div>
        );
    };

    getContent = () => {
        return this.getUtilizeButton();
    };

    render() {
        return this.getContent();
    }
}
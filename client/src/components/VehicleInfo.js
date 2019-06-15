import React, {Component} from "react";

export default class AllPendingVehicles extends Component {
    state = {};
    vehicle = this.props.vehicle;

    render() {
        return (
            <div className={"vehicle-info"}>
                <div>
                    Type = {this.vehicle.type}
                </div>

                <div>
                    Model = {this.vehicle.model}
                </div>

                {this.vehicle.type === "car" &&
                <div>
                    VIN = {this.vehicle.id}
                </div>}

                {this.vehicle.type === "bike" &&
                <div>
                    Serial = {this.vehicle.id}
                </div>}
            </div>
        );
    }
}
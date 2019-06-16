import React, {Component} from "react";

export default class VehicleInfo extends Component {
    state = {};
    vehicle = this.props.vehicle;

    getCarInfo = () => {
        return (
            <div>
                <b>VIN:</b> {this.vehicle.id}
            </div>
        )
    };

    getBikeInfo = () => {
        return (
            <div>
                SERIAL: {this.vehicle.id}
            </div>
        )
    };

    getIdInfo = () => {
        return this.vehicle.type === "car" ?
            this.getCarInfo() :
            this.getBikeInfo();
    };

    getStateLabel = () => {
        if (this.vehicle.status) {
            return this.vehicle.status.toUpperCase();
        }
    };

    render() {
        return (
            <div className={"vehicle-info " + this.vehicle.status}>
                <div className={"vehicle-info-first-row"}>
                    <div className={"vehicle-type-label"}>
                        <b>Type:</b> {this.vehicle.type}
                    </div>
                    <div className={"vehicle-status-label " + this.vehicle.status + "-label"}>
                        {this.getStateLabel()}
                    </div>

                </div>
                <div>
                    <b>Model:</b> {this.vehicle.model}
                </div>

                {this.getIdInfo()}
            </div>
        );
    }
}
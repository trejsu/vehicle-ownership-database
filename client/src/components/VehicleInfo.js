import React, {Component} from "react";

export default class VehicleInfo extends Component {
    state = {};
    vehicle = this.props.vehicle;

    getCarInfo = () => {
        return (
            <div>
                VIN = {this.vehicle.id}
            </div>
        )
    };

    getBikeInfo = () => {
        return (
            <div>
                Serial = {this.vehicle.id}
            </div>
        )
    };

    getIdInfo = () => {
        return this.vehicle.type === "car" ?
            this.getCarInfo() :
            this.getBikeInfo();
    };

    render() {
        return (
            <div className={"vehicle-info"}>
                <div>
                    Type = {this.vehicle.type}
                </div>

                <div>
                    Model = {this.vehicle.model}
                </div>

                {this.getIdInfo()}
            </div>
        );
    }
}
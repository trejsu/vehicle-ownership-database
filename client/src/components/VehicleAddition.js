import React, {Component} from "react";

class VehicleAddition extends Component {
    state = {};
    defaultVehicleType = "car";
    defaultVehicleModel = undefined;

    componentDidMount = async () => {
        this.setState({
            vehicleType: this.defaultVehicleType,
            vehicleModel: this.defaultVehicleModel
        });
    };

    handleVehicleTypeChanged = (event) => {
        this.setState({
            vehicleType: event.target.value
        });
    };

    handleRequestClicked = () => {
        console.log("request", {
            type: this.state.vehicleType,
            model: this.state.vehicleModel
        });
    };

    render() {
        return (
            <div className={"row"}>
                <div style={{margin: "20px"}}>
                        <span>
                            Select type of vehicle
                        </span>
                    <div className="col-sm-">
                        <select
                            className="form-control"
                            defaultValue={this.state.vehicleType}
                            onChange={this.handleVehicleTypeChanged}
                        >
                            <option value="car">Car</option>
                            <option value="bike">Bike</option>
                        </select>
                    </div>
                </div>
                <div>
                    {this.state.vehicleType &&
                    <div>
                        Selected vehicle type = '{this.state.vehicleType}'
                    </div>
                    }
                    {this.state.vehicleModel &&
                    <div>
                        Selected vehicle model = '{this.state.vehicleModel}'
                    </div>
                    }
                </div>

                <button type={"button"}
                        className={"btn btn-primary"}
                        style={{margin: "20px"}}
                        onClick={this.handleRequestClicked}
                >
                    Request
                </button>
            </div>
        );
    }
}

export default VehicleAddition;
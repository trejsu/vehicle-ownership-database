import React, {Component} from "react";

class VehicleAddition extends Component {
    state = {};
    defaultVehicleType = "car";

    componentDidMount = async () => {
        this.setState({vehicleType: this.defaultVehicleType})
    };

    handleVehicleTypeChanged = (event) => {
        this.setState({vehicleType: event.target.value})
    };

    render() {
        return (
            <div className={"row"}>
                <div style={{margin: "20px"}}>
                        <span>
                            Select type of vehicle
                        </span>
                    <div className="col-sm-3">
                        <select
                            className="form-control"
                            onChange={this.handleVehicleTypeChanged}
                            defaultValue={this.state.vehicleType}
                        >
                            <option value="car">Car</option>
                            <option value="bike">Bike</option>
                        </select>
                    </div>
                </div>
                <div>
                    Selected type of vehicle = '{this.state.vehicleType}'
                </div>
            </div>
        );
    }
}

export default VehicleAddition;
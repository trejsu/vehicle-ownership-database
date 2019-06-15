import React, {Component} from "react";

export default class VehicleAddition extends Component {
    state = {};
    defaultVehicleType = "car";
    vehicleService = this.props.vehicleService;

    componentDidMount = async () => {
        this.setState({
            vehicleType: this.defaultVehicleType
        });
    };

    handleVehicleTypeChanged = (event) => {
        this.setState({
            vehicleType: event.target.value
        });
    };

    handleModelChanged = (event) => {
        this.setState({
            vehicleModel: event.target.value
        })
    };

    handleCarVinChanged = (event) => {
        this.setState({
            carVin: event.target.value
        })
    };

    handleBikeSerialChanged = (event) => {
        this.setState({
            bikeSerial: event.target.value
        })
    };

    handleRequestClicked = () => {
        switch (this.state.vehicleType) {
            case "car":
                this.vehicleService.addCar(
                    (({vehicleType, vehicleModel, carVin}) =>
                        ({vehicleType, vehicleModel, carVin}))(this.state)).then(result => console.log(result));
                break;
            case "bike":
                this.vehicleService.addBike(
                    (({vehicleType, vehicleModel, bikeSerial}) =>
                        ({vehicleType, vehicleModel, bikeSerial}))(this.state)).then(result => console.log(result));
                break;
            default:
                console.log("error with state: ", this.state.vehicleType);
        }
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

                        <div>
                            <input
                                placeholder={"Model"}
                                defaultValue={this.state.vehicleModel}
                                onChange={this.handleModelChanged}/>
                        </div>

                        {this.state.vehicleType === 'car' &&
                        <div>
                            <input
                                placeholder={"VIN"}
                                defaultValue={this.state.carVin}
                                onChange={this.handleCarVinChanged}/>
                        </div>}

                        {this.state.vehicleType === 'bike' &&
                        <div>
                            <input
                                placeholder={"Serial number"}
                                defaultValue={this.state.bikeSerial}
                                onChange={this.handleBikeSerialChanged}/>
                        </div>}
                    </div>
                </div>
                <div>
                    {this.state.vehicleType &&
                    <div>
                        Selected vehicle type = '{this.state.vehicleType}'
                    </div>}

                    {this.state.vehicleModel &&
                    <div>
                        Selected vehicle model = '{this.state.vehicleModel}'
                    </div>}

                    {this.state.vehicleType === 'car' && this.state.carVin &&
                    <div>
                        VIN = '{this.state.carVin}
                    </div>}

                    {this.state.vehicleType === 'bike' && this.state.bikeSerial &&
                    <div>
                        Serial = '{this.state.bikeSerial}
                    </div>}
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
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

    handleIdChanged = (event) => {
        this.setState({
            id: event.target.value
        })
    };

    handleRequestClicked = () => {
        switch (this.state.vehicleType) {
            case "car":
            case "bike":
                this.vehicleService.addVehicle(
                    (({vehicleType, vehicleModel, id}) =>
                        ({vehicleType, vehicleModel, id}))(this.state))
                    .then(result => console.log(result));
                break;
            default:
                console.log("error with state: ", this.state.vehicleType);
        }
    };

    getIdInputWithPlaceholder = placeholder => {
        return (
            <div>
                <input
                    placeholder={placeholder}
                    defaultValue={this.state.carVin}
                    onChange={this.handleIdChanged}/>
            </div>
        )
    };


    getIdInput = () => {
        if (this.state.vehicleType === "car") {
            return this.getIdInputWithPlaceholder("VIN");
        } else if (this.state.vehicleType === "bike") {
            return this.getIdInputWithPlaceholder("Serial");
        } else {
            return (
                <div>
                    There should be something!
                </div>
            )
        }
    };

    render() {
        return (
            <div className={"col-sm-6 offset-sm-3"}>
                <div className={"vehicle-addition-title"}>
                    Select type of vehicle
                </div>
                <div className={"vehicle-addition-panel"}>
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

                    {this.getIdInput()}
                </div>

                <button type={"button"}
                        className={"btn btn-primary"}
                        onClick={this.handleRequestClicked}>
                    Request
                </button>
            </div>
        );
    }
}
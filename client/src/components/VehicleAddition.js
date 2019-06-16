import React, {Component} from "react";

export default class VehicleAddition extends Component {
    state = {id: "", vehicleModel: "", vehicleType: "car"};
    vehicleService = this.props.vehicleService;

    componentDidMount = async () => {
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
        const elem = {
            id: this.state.id,
            vehicleModel: this.state.vehicleModel,
            vehicleType: this.state.vehicleType,
        };
        this.setState({
            vehicleModel: "",
            id: ""
        });
        this.vehicleService.addVehicle(elem)
            .then(result => console.log(result))
            .catch(() => console.log("addition err"));
    };

    getIdInputWithPlaceholder = placeholder => {
        return (
            <div>
                <input
                    placeholder={placeholder}
                    value={this.state.id}
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
            <div>
                <div className={"vehicle-addition-title"}>
                    Select type of vehicle
                </div>
                <div className={"vehicle-addition-panel"}>
                    <select
                        className={"vehicle-addition-select"}
                        value={this.state.vehicleType}
                        onChange={this.handleVehicleTypeChanged}>
                        <option value="car">Car</option>
                        <option value="bike">Bike</option>
                    </select>

                    <div>
                        <input
                            placeholder={"Model"}
                            value={this.state.vehicleModel}
                            onChange={this.handleModelChanged}/>
                    </div>

                    {this.getIdInput()}

                    <div>
                        <button type={"button"}
                                className={"btn btn-primary"}
                                onClick={this.handleRequestClicked}>
                            Request
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
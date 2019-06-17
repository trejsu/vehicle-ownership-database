import React, {Component} from "react";

export default class VehicleAddition extends Component {
    state = {id: "", vehicleModel: "", vehicleType: "car", added: false};
    vehicleService = this.props.vehicleService;

    handleVehicleTypeChanged = (event) => {
        this.setState({
            vehicleType: event.target.value,
            added: false,
            error: false,
            alreadyExisting: false
        });
    };

    handleModelChanged = (event) => {
        this.setState({
            vehicleModel: event.target.value,
            added: false,
            error: false,
            alreadyExisting: false
        })
    };

    handleIdChanged = (event) => {
        this.setState({
            id: event.target.value,
            added: false,
            error: false,
            alreadyExisting: false
        })
    };

    addVehicle = (vehicle) => {
        this.setState({
            vehicleModel: "",
            id: ""
        });

        return this.vehicleService.addVehicle(vehicle)
            .then(() => {
                this.setState({
                    added: true,
                    vehicleModel: "",
                    id: ""
                });
                this.props.onChange();
            })
            .catch(error => {
                console.log("Error occurred during adding vehicle", error)
            })
    };

    handleRequestClicked = () => {
        this.vehicleService.isIdAvailable(this.state.id)
            .then(available => {
                console.log("[VEHICLE ADDITION] %s VIN / Serial number is%s available.",
                    this.state.id, available ? "" : " not");
                if (available) {
                    return this.addVehicle(this.state);
                } else {
                    this.setState({
                        alreadyExisting: true
                    });
                    throw Error();
                }
            })
            .catch(() => {
                this.setState({
                    error: true
                })
            })
            .finally(() => {
                this.setState({
                    blocked: false
                });
            });
    };

    getIdInputWithPlaceholder = placeholder => {
        return (
            <div>
                <input
                    placeholder={placeholder}
                    disabled={this.state.blocked}
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

    getAlreadyExisting = () => {
        return (
            <div className="alert alert-danger" role="alert">
                Vehicle with entered VIN / Serial number already exists.
            </div>
        );
    };

    getErrorMessage = () => {
        return (
            <div>
                There was some error...
            </div>
        );
    };

    getAdded = () => {
        return <div className="alert alert-success" role="alert">
            Vehicle added to pending.
        </div>
    };

    getResult = () => {
        return this.state.error ?
            (this.state.alreadyExisting ?
                this.getAlreadyExisting() :
                this.getErrorMessage()) :
            (this.state.added ?
                this.getAdded() :
                null);
    };

    render() {
        return (
            <div>
                <div className={"vehicle-addition-title"}>
                    Request new vehicle
                </div>
                <div className={"vehicle-addition-panel"}>
                    <select
                        className={"vehicle-addition-select"}
                        value={this.state.vehicleType}
                        disabled={this.state.blocked}
                        onChange={this.handleVehicleTypeChanged}>
                        <option value="car">Car</option>
                        <option value="bike">Bike</option>
                    </select>

                    <div>
                        <input
                            placeholder={"Model"}
                            value={this.state.vehicleModel}
                            disabled={this.state.blocked}
                            onChange={this.handleModelChanged}/>
                    </div>

                    {this.getIdInput()}

                    <div>
                        <button type={"button"}
                                disabled={this.state.blocked}
                                className={"btn btn-primary"}
                                onClick={this.handleRequestClicked}>
                            Request
                        </button>
                    </div>
                    {this.getResult()}
                </div>
            </div>
        );
    }
}
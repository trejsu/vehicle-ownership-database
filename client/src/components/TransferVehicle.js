import React, {Component} from "react";

export default class TransferVehicle extends Component {
    state = {
        error: false,
        transferred: false,
        address: "",
        id: "",
        transferPossible: true,
        blocked: false
    };
    vehicleService = this.props.vehicleService;

    handleIdChanged = (event) => {
        this.setState({
            id: event.target.value,
            transferPossible: true
        })
    };

    handleAddressChanged = (event) => {
        this.setState({
            address: event.target.value
        })
    };

    transfer(id, address) {
        return this.vehicleService.transferVehicle(id, address)
            .then(() => {
                console.log('transfer then');
                this.setState({
                    transferred: true
                });
                this.props.onChange();
            })
            .catch(error => {
                console.log('transferVehicle error', error.message);
                this.setState({
                    error: true,
                    errorMessage: error.message
                });
            })
            .finally(() => {
                console.log('transfer finally');
                this.setState({
                    id: "",
                    address: "",
                    blocked: false
                });
            })
    }

    handleRequestClicked() {
        const id = this.state.id;
        const address = this.state.address;

        // this.setState({
        //     id: "",
        //     address: ""
        // });

        this.setState({
            blocked: true
        });

        this.vehicleService.isTransferPossible(id, address)
            .then((response) => {
                console.log(response);
                if (response.transferPossible) {
                    return this.transfer(id, address);
                } else {
                    this.setState({
                        transferPossible: false,
                        blocked: false,
                        transferNotPossibleReason: response.reason,
                        error: true
                    });
                    // throw Error();
                }
            })
            .catch(error => {
                console.log('isTransferPossible error', error);
                this.setState({
                    error: true,
                })
            });
    };

    getTransferPositiveInfo = () => {
        return (
            <div className="alert alert-success" role="alert">
                Vehicle transfer requested successfully! Transaction will be finished after receiver approves the
                transfer.
            </div>
        );
    };

    getErrorMessage = () => !this.state.transferPossible ?
        this.getTransferNotPossibleError() :
        this.getDefaultError();

    getDefaultError = () =>
        <div className="alert alert-danger" role="alert">
            {this.state.errorMessage ?
                this.state.errorMessage :
                "Unexpected error occurred."}
        </div>;

    getTransferNotPossibleError = () =>
        <div className="alert alert-danger" role="alert">
            {this.state.transferNotPossibleReason}
        </div>;

    getTransferResult() {
        return this.state.error ?
            this.getErrorMessage() :
            (this.state.transferred ? this.getTransferPositiveInfo() : null);
    };

    render() {
        return (
            <div>
                <div className={"transfer-vehicle-title"}>
                    Transfer Vehicle
                </div>

                <div className={"transfer-vehicle-panel"}>
                    <div>
                        <input
                            placeholder={"Vehicle ID"}
                            value={this.state.id}
                            disabled={this.state.blocked}
                            onChange={this.handleIdChanged}/>
                    </div>

                    <div>
                        <input
                            placeholder={"Receiver address"}
                            value={this.state.address}
                            disabled={this.state.blocked}
                            onChange={this.handleAddressChanged}/>
                    </div>

                    <div>
                        <button type={"button"}
                                className={"btn btn-primary"}
                                disabled={this.state.blocked}
                                onClick={this.handleRequestClicked.bind(this)}>
                            Request transfer
                        </button>
                    </div>

                    {this.getTransferResult()}
                </div>
            </div>
        )
    }
}
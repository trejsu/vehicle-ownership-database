import React, {Component} from "react";

export default class TransferVehicle extends Component {
    state = {
        error: false,
        transferred: false,
        address: "",
        id: "",
        blocked: false
    };
    vehicleService = this.props.vehicleService;

    handleIdChanged = (event) => {
        this.setState({
            id: event.target.value
        })
    };

    handleAddressChanged = (event) => {
        this.setState({
            address: event.target.value
        })
    };

    handleRequestClicked() {
        const id = this.state.id;
        const address = this.state.address;

        this.setState({
            id: "",
            address: ""
        });

        // this.setState({
        //     blocked: true
        // });

        this.vehicleService.transferVehicle(id, address)
            .then(() => {
                this.setState({
                    transferred: true
                })
            })
            .catch(() => {
                this.setState({
                    error: true
                });
            })
            .finally(() => {
                this.setState({
                    id: "",
                    address: "",
                    blocked: false
                });
            })
    };

    getTransferPositiveInfo = () => {
        return (
            <div>
                Vehicle transferred
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

    getTransferResult() {
        return this.state.transferred ?
            (this.state.error ?
                this.getErrorMessage() :
                this.getTransferPositiveInfo()) :
            null;
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
                            Request
                        </button>
                    </div>

                    {this.getTransferResult()}
                </div>
            </div>
        )
    }
}
import React, {Component} from "react";

export default class TransferVehicle extends Component {
    state = {error: false, transferred: false};
    vehicleService = this.props.vehicleService;

    handleIdChanged = (event) => {
        this.setState({id: event.target.value})
    };

    handleAddressChanged = (event) => {
        this.setState({address: event.target.value})
    };

    handleRequestClicked = () => {
        const id = this.state.id;
        const address = this.state.address;
        this.setState({id: null, address: null, error: false, transferred: false});
        this.vehicleService.transferVehicle(address, id)
            .then(() => {
                this.setState({transferred: true})
            })
            .catch(() => {
                this.setState({error: true});
            });
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
        const content = this.state.transferred ?
            (this.state.error ?
                this.getErrorMessage() :
                this.getTransferPositiveInfo()) :
            null;

        return (
            content
        );
    };

    render() {
        return (
            <div>
                <div>
                    <div className={"transfer-vehicle-title"}>
                        Transfer Vehicle
                    </div>
                    <div className={"transfer-vehicle-panel"}>
                        <div>
                            <input
                                placeholder={"Address"}
                                defaultValue={this.state.address}
                                onChange={this.handleAddressChanged}/>
                        </div>

                        <div>
                            <input
                                placeholder={"ID"}
                                defaultValue={this.state.id}
                                onChange={this.handleIdChanged}/>
                        </div>

                        <div>
                            <button type={"button"}
                                    className={"btn btn-primary"}
                                    onClick={this.handleRequestClicked}>
                                Request
                            </button>
                        </div>

                        {this.getTransferResult()}
                    </div>
                </div>
            </div>
        )
    }
}
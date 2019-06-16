import React, {Component} from "react";

export default class ApproveVehicle extends Component {
    state = {};
    vehicleId = this.props.vehicleId;
    handleApproveClicked = this.props.handleApproveClicked;

    onApproveClicked = (event) => {
        this.handleApproveClicked(event.target.id)
    };

    getApproveButton = () => {
        return (
            <div className={"vehicle-approve-action row"}>
                <button type={"button"}
                        className={"btn btn-success"}
                        id={this.vehicleId}
                        onClick={this.onApproveClicked}>
                    Approve
                </button>
            </div>
        );
    };

    getContent = () => {
        return this.getApproveButton();
    };

    render() {
        return this.getContent();
    }
}
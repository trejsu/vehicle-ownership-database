import React, {Component} from "react";

import VehicleAddition from "./VehicleAddition";
import SearchForVehicle from "./SearchForVehicle";
import TransferVehicle from "./TransferVehicle";
import AllPendingVehicles from "./AllPendingVehicles";
import MineVehicles from "./MineVehicles";
import IncomingPendingTransfer from "./IncomingPendingTransfer";

export default class Content extends Component {
    vehicleService = this.props.vehicleService;
    state = {
        page: this.props.page,
        addingComponentChange: true
    };

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({page: nextProps.page});
        if (this.accountChanged(nextProps)) {
            this.onVehicleAdditionChange();
        }
    }

    accountChanged(nextProps) {
        return nextProps.account !== this.props.account;
    }

    getAddingComponent = () => {
        return (
            <div className={"row"}>
                <div className={"col-sm-6"}>
                    <VehicleAddition
                        vehicleService={this.vehicleService}
                        onChange={this.onVehicleAdditionChange.bind(this)}/>
                </div>
                <div className={"col-sm-6"}>
                    <MineVehicles
                        vehicleService={this.vehicleService}
                        change={this.state.addingComponentChange}/>
                </div>
            </div>
        );
    };

    onVehicleAdditionChange() {
        this.setState(prevState => ({
            addingComponentChange: !prevState.addingComponentChange
        }));
    }

    getBrowsingComponent = () => {
        return (
            <div className={"row"}>
                <div className={"col-sm-6"}>
                    <SearchForVehicle
                        vehicleService={this.vehicleService}/>
                </div>
                <div className={"col-sm-6"}>
                    <AllPendingVehicles
                        vehicleService={this.vehicleService}/>
                </div>
            </div>
        );
    };

    getPrivateComponent = () => {
        return (
            <div className={"row"}>
                <div className={"col-sm-6"}>
                    <MineVehicles
                        vehicleService={this.vehicleService}/>
                </div>
                <div className={"col-sm-6"}>
                    <div className={"col-xs-12"}>
                        <TransferVehicle
                            vehicleService={this.vehicleService}/>
                    </div>
                    <div className={"col-xs-12"}>
                        <IncomingPendingTransfer
                            vehicleService={this.vehicleService}/>
                    </div>
                </div>
            </div>
        );
    };

    getDefaultComponent = () => {
        return (
            <div className={"row"}>
                <div
                    className={"col-sm-12"}
                    style={{textAlign: "center"}}>
                    Choose something!
                </div>
            </div>
        )
    };

    getProperComponents = () => {
        switch (this.state.page) {
            case "adding":
                return this.getAddingComponent();
            case "browsing":
                return this.getBrowsingComponent();
            case "private":
                return this.getPrivateComponent();
            default:
                return this.getDefaultComponent();
        }
    };

    render() {
        return (
            this.getProperComponents()
        );
    }
}
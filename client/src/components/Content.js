import React, {Component} from "react";

import VehicleAddition from "./VehicleAddition";
import SearchForVehicle from "./SearchForVehicle";
import TransferVehicle from "./TransferVehicle";
import AllPendingVehicles from "./AllPendingVehicles";
import MineVehicles from "./MineVehicles";
import IncomingPendingTransfer from "./IncomingPendingTransfer";

export default class Content extends Component {

    constructor(props) {
        super(props);
        this.vehicleService = this.props.vehicleService;
        this.state = {
            page: this.props.page,
            addingComponentChange: true,
            browsingComponentChange: true,
            privateComponentChange: true
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        console.log('Content will receive props.');
        if (nextProps.page !== this.state.page) {
            this.setState({page: nextProps.page});
        }
        if (this.accountChanged(nextProps)) {
            console.log('Account changed');
            this.onAddingComponentChange();
            this.onBrowsingComponentChange();
            this.onPrivateComponentChange();
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
                        onChange={this.onAddingComponentChange.bind(this)}/>
                </div>
                <div className={"col-sm-6"}>
                    <MineVehicles
                        vehicleService={this.vehicleService}
                        change={this.state.addingComponentChange}/>
                </div>
            </div>
        );
    };

    getBrowsingComponent = () => {
        return (
            <div className={"row"}>
                <div className={"col-sm-6"}>
                    <SearchForVehicle
                        vehicleService={this.vehicleService}/>
                </div>
                <div className={"col-sm-6"}>
                    <AllPendingVehicles
                        vehicleService={this.vehicleService}
                        change={this.state.browsingComponentChange}/>
                </div>
            </div>
        );
    };

    getPrivateComponent = () => {
        return (
            <div className={"row"}>
                <div className={"col-sm-6"}>
                    <MineVehicles
                        vehicleService={this.vehicleService}
                        change={this.state.privateComponentChange}/>
                </div>
                <div className={"col-sm-6"}>
                    <div className={"col-xs-12"}>
                        <TransferVehicle
                            vehicleService={this.vehicleService}
                            onChange={this.onPrivateComponentChange.bind(this)}/>
                    </div>
                    <div className={"col-xs-12"}>
                        <IncomingPendingTransfer
                            vehicleService={this.vehicleService}
                            change={this.state.privateComponentChange}
                            onChange={this.onPrivateComponentChange.bind(this)}/>
                    </div>
                </div>
            </div>
        );
    };

    onAddingComponentChange() {
        this.setState(prevState => ({
            addingComponentChange: !prevState.addingComponentChange
        }));
    }

    onBrowsingComponentChange() {
        this.setState(prevState => ({
            browsingComponentChange: !prevState.browsingComponentChange
        }));
    }

    onPrivateComponentChange() {
        console.log('onPrivateComponentChange');
        this.setState(prevState => ({
            privateComponentChange: !prevState.privateComponentChange
        }));
    }

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
import React, {Component} from "react";

import VehicleAddition from "./VehicleAddition";
import AllPendingVehicles from "./AllPendingVehicles";
import MineVehicles from "./MineVehicles";

export default class Content extends Component {
    vehicleService = this.props.vehicleService;
    state = {page: this.props.page};

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({page: nextProps.page});
    }

    getAddingComponent = () => {
        return (
            <div className={"row"}>
                <div className={"col-sm-6"}>
                    <VehicleAddition
                        vehicleService={this.vehicleService}
                    />
                </div>
            </div>
        );
    };

    getBrowsingComponent = () => {
        return (
            <div className={"row"}>
                <div className={"col-sm-6"}>
                    <AllPendingVehicles
                        vehicleService={this.vehicleService}
                    />
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
                    />
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
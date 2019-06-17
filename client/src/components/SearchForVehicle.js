import React, {Component} from "react";

import VehicleInfo from "./VehicleInfo";
import ApproveVehicle from "./ApproveVehicle";

export default class SearchForVehicle extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            notFound: false,
            downloaded: false,
            blocked: false,
            id: ""
        };
        this.vehicleService = this.props.vehicleService;
    }

    componentWillReceiveProps(nextProps) {
        if (this.propsChanged(nextProps)) {
            this.search(this.state.id);
        }
    }

    propsChanged(nextProps) {
        return this.props.change !== nextProps.change;
    }

    handleIdChanged = (event) => {
        this.setState({
            id: event.target.value,
            downloaded: false,
            error: false,
            notFound: false
        })
    };

    getStatusByType = (id, registeredIds, utilizationIds, transferIds, pendingIds) => {
        if (utilizationIds.includes(id)) {
            return "utilize";
        } else if (transferIds.includes(id)) {
            return "transfer";
        } else if (pendingIds.includes(id)) {
            return "pending";
        } else if (registeredIds.includes(id)) {
            return "registered";
        }
    };

    search = (id, status) => {
        console.log('[SEARCH FOR VEHICLE] Searching for %s', id);
        this.vehicleService.searchForVehicle(id)
            .then(response => {
                console.log('[SEARCH FOR VEHICLE] Search for vehicle response', response);
                response.status = status;
                this.setState({
                    vehicle: response
                })
            })
            .catch(() => {
                this.setState({
                    error: true
                });
            })
            .finally(() => {
                this.setState({
                    downloaded: true
                });
            });
    };

    handleRequestClicked = () => {
        const id = this.state.id;

        this.setState({
            blocked: true
        });

        let registeredIds;
        let utilizationIds;
        let transferIds;
        let pendingIds;

        this.vehicleService.getRegisteredIds()
            .then(response => {
                registeredIds = response;
                return this.vehicleService.getUtilizationIds();
            })
            .then(response => {
                utilizationIds = response;
                return this.vehicleService.getTransferIds();
            })
            .then(response => {
                transferIds = response;
                return this.vehicleService.getPendingIds();
            })
            .then(response => {
                pendingIds = response;

                let status = this.getStatusByType(id, registeredIds, utilizationIds, transferIds, pendingIds);

                if (status) {
                    return this.search(id, status);
                } else {
                    this.setState({
                        notFound: true
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
            })
    };

    handleApproveClicked = (id) => {
        this.vehicleService.approveVehicle(id)
            .then(() => {
                console.log("[SEARCH FOR VEHICLE] Approved %s", id);
                this.setState({downloaded: false});
                this.props.onChange();
            });
    };

    getVehicleInfo = () => {
        return (
            <div className={"found-vehicle"}>
                Found vehicle
                <VehicleInfo
                    vehicle={this.state.vehicle}/>
                {this.state.vehicle.approvable &&
                <ApproveVehicle
                    vehicleId={this.state.vehicle.id}
                    handleApproveClicked={this.handleApproveClicked}/>
                }
            </div>
        );
    };

    getNotFound = () => {
        return (
            <div className="alert alert-warning" role="alert">
                ID not found
            </div>
        );
    };

    getErrorMessage = () => {
        return (
            <div className="alert alert-danger" role="alert">
                There was some error...
            </div>
        );
    };

    getVehicleResult() {
        return this.state.error ?
            (this.state.notFound ?
                this.getNotFound() :
                this.getErrorMessage()) :
            (this.state.downloaded ?
                (this.state.vehicle &&
                    this.getVehicleInfo()) :
                null);
    };

    render() {
        return (
            <div>
                <div className={"search-for-vehicle-title"}>
                    Search for vehicle
                </div>
                <div className={"search-for-vehicle-panel"}>
                    <div>
                        <input
                            placeholder={"ID"}
                            disabled={this.state.blocked}
                            value={this.state.id}
                            onChange={this.handleIdChanged}/>
                    </div>

                    <div>
                        <button type={"button"}
                                disabled={this.state.blocked}
                                className={"btn btn-primary"}
                                onClick={this.handleRequestClicked}>
                            Search
                        </button>
                    </div>

                    {this.getVehicleResult()}
                </div>
            </div>
        )
    }
}
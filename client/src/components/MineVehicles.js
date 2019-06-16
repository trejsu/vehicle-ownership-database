import React, {Component} from "react";

import VehicleInfo from "./VehicleInfo";
import VehicleUtilization from "./VehicleUtilization";

export default class MineVehicles extends Component {

    constructor(props) {
        super(props);
        this.state = {
            downloadPending: false,
            downloadRegistered: false,
            downloadTransfered: false,
            error: false,
            pendingVehicles: [],
            registeredVehicles: [],
            transferedVehicleIds: []
        };
        this.vehicleService = this.props.vehicleService;
    }

    componentDidMount() {
        this.loadData();
    };

    componentWillReceiveProps(nextProps) {
        if (this.propsChanged(nextProps)) {
            this.loadData();
        }
    }

    loadData() {
        this.getUserPendingApprovals();
        this.getUserRegisteredVehicles();
        this.getTransferIds();
    }

    getTransferIds() {
        this.vehicleService.getTransferIds()
            .then(response => {
                console.log('transferred vehicle ids', response);
                this.setState({
                    transferedVehicleIds: response
                })

            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    error: true
                })
            })
            .finally(() => {
                this.setState({
                    downloadTransfered: true
                });
            });
    }

    getUserRegisteredVehicles() {
        this.vehicleService.getUserRegisteredVehicles()
            .then(response => {
                this.setState({
                    registeredVehicles: response
                });
            })
            .catch(() => {
                this.setState({
                    error: true
                })
            })
            .finally(() => {
                this.setState({
                    downloadRegistered: true
                });
            });
    }

    getUserPendingApprovals() {
        this.vehicleService.getUserPendingApprovals()
            .then(response => {
                this.setState({
                    pendingVehicles: response
                });
            })
            .catch(() => {
                this.setState({
                    error: true
                })
            })
            .finally(() => {
                this.setState({
                    downloadPending: true
                });
            });
    }

    propsChanged(nextProps) {
        return this.props.change !== nextProps.change;
    }

    getVehiclesDownloadError = () => {
        return (
            <div>
                Something went wrong ...
            </div>
        )
    };

    handleUtilization = (id) => {
        this.vehicleService.utilizeVehicle(id)
            .then(response => {
                console.log("Utilized vehicle", response);
                this.loadData();
            });
    };

    getMinePendingApprovalVehicleInfos = (vehicles) => {
        return (
            vehicles.map(vehicle => {
                    return (<div key={vehicle.id + vehicle.status}>
                        <VehicleInfo
                            vehicle={vehicle}/>
                        {vehicle.status === "registered" &&
                        <VehicleUtilization
                            vehicleId={vehicle.id}
                            handleUtilization={this.handleUtilization}/>
                        }
                    </div>)
                }
            )
        );
    };

    getVehiclesContent = (vehicles) => {
        return (
            <div>
                <div className={"mine-vehicles-title"}>
                    My vehicles
                </div>
                {this.getMinePendingApprovalVehicleInfos(vehicles)}
            </div>
        );
    };

    getVehicles = () => {
        const pendingVehicles = this.state.pendingVehicles
            .map(vehicle => ({...vehicle, status: "pending"}));

        const registeredVehicles = this.state.registeredVehicles
            .filter(vehicle => !this.state.transferedVehicleIds.includes(vehicle.id))
            .map(vehicle => ({...vehicle, status: "registered"}));

        const transferedVehicles = this.state.registeredVehicles
            .filter(vehicle => this.state.transferedVehicleIds.includes(vehicle.id))
            .map(vehicle => ({...vehicle, status: "transfer"}));

        const vehicles = pendingVehicles
            .concat(registeredVehicles)
            .concat(transferedVehicles);

        return vehicles && vehicles.length > 0 ?
            this.getVehiclesContent(vehicles) :
            this.getDefault();
    };

    getDefault = () => {
        return (
            <div>
                <div className={"mine-vehicles"}>
                    You don't have any vehicles registered yet.
                </div>
            </div>
        )
    };

    getWait = () => {
        return (
            <div>
                Please wait...
            </div>
        )
    };

    render() {
        return this.state.downloadRegistered && this.state.downloadPending && this.state.downloadTransfered ?
            (this.state.error ?
                this.getVehiclesDownloadError() :
                this.getVehicles()) :
            this.getWait();
    }
}
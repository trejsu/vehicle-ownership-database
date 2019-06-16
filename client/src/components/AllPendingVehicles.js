import React, {Component} from "react";

import VehicleInfo from "./VehicleInfo";
import ApproveVehicle from "./ApproveVehicle";

export default class AllPendingVehicles extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pendingApprovalVehicles: [],
            utilizedApprovalVehicles: []
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

    propsChanged(nextProps) {
        return this.props.change !== nextProps.change;
    }

    loadData() {
        this.vehicleService.getAllPendingApprovalsPossibleToApprove()
            .then(response => {
                console.log(response);
                this.setState({
                    pendingApprovalVehicles: response
                });
            })
            .catch(() => {
                this.setState({
                    error: true
                })
            })
            .finally(() => {
                this.setState({
                    downloadedPending: true
                })
            });

        this.vehicleService.getAllUtilizationApprovalsPossibleToApprove()
            .then(response => {
                console.log(response);
                this.setState({
                    utilizationApprovalVehicles: response
                });
            })
            .catch(() => {
                this.setState({
                    error: true
                })
            })
            .finally(() => {
                this.setState({
                    downloadedUtilization: true
                })
            });
    }

    getAllPendingApprovalsDownloadError = () => {
        return (
            <div>
                Something went wrong ...
            </div>
        )
    };

    handleApproveClicked = (id) => {
        this.vehicleService.approveVehicle(id)
            .then(response => {
                console.log("[ALL PENDING VEHICLES] Approve vehicle response ", response);
                this.props.onChange();
            });
    };

    handleUtilizationClicked = (id) => {
        this.vehicleService.approveUtilization(id)
            .then(response => {
                console.log("Approve vehicle utilization response ", response);
                this.loadData();
            });
    };

    getVehicleToApprove = (vehicle) => {
        const approveContent = vehicle.status === "pending" ?
            <ApproveVehicle
                vehicleId={vehicle.id}
                handleApproveClicked={this.handleApproveClicked}/>
            :
            (vehicle.status === "utilize" ?
                    <ApproveVehicle
                        vehicleId={vehicle.id}
                        handleApproveClicked={this.handleUtilizationClicked}/>
                    :
                    null
            );

        return (
            <div key={vehicle.id + vehicle.status}>
                <VehicleInfo
                    vehicle={vehicle}/>
                {approveContent}
            </div>
        );
    };

    getPendingApprovalVehicleInfos = () => {
        const pendingVehicles = this.state.pendingApprovalVehicles
            .map(vehicle => ({...vehicle, status: "pending"}));
        const utilizeVehicles = this.state.utilizationApprovalVehicles
            .map(vehicle => ({...vehicle, status: "utilize"}));

        console.log(pendingVehicles);
        console.log(utilizeVehicles);

        const vehicles = pendingVehicles.concat(utilizeVehicles);
        console.log(vehicles);
        return (
            vehicles.map(vehicle => this.getVehicleToApprove(vehicle))
        );
    };

    getPendingApprovalVehiclesContent = () => {
        return (
            <div>
                <div className={"all-pending-vehicles-title"}>
                    List of all pending approvals
                </div>
                {this.getPendingApprovalVehicleInfos()}
            </div>
        );
    };

    getVehicles = () => {
        const content = this.state.pendingApprovalVehicles &&
        this.state.pendingApprovalVehicles.length > 0 ?
            this.getPendingApprovalVehiclesContent() :
            this.getDefault();

        return (
            content
        )
    };

    getDefault = () => {
        return (
            <div>
                <div className="alert alert-info mine-vehicles" role="alert">
                    There are no pending approvals at the moment.
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
        const content = this.state.downloadedPending && this.state.downloadedUtilization ?
            (this.state.error ?
                this.getAllPendingApprovalsDownloadError() :
                this.getVehicles()) :
            this.getWait();

        return (
            content
        );
    }
}
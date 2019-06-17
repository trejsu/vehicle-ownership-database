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
        this.vehicleService.getAllRegistrationRequestsPossibleToApprove()
            .then(vehicles => {
                console.log('[ALL PENDING VEHICLES] Registration requests possible to approve', vehicles);
                this.setState({
                    pendingApprovalVehicles: vehicles
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

        this.vehicleService.getAllUtilizationRequestsPossibleToApprove()
            .then(response => {
                console.log('[ALL PENDING VEHICLES] Utilization requests possible to approve', response);
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

    getPendingVehicleInfos = () => {
        const pendingVehicles = this.state.pendingApprovalVehicles
            .map(vehicle => ({...vehicle, status: "pending"}));
        const utilizeVehicles = this.state.utilizationApprovalVehicles
            .map(vehicle => ({...vehicle, status: "utilize"}));

        return pendingVehicles
            .concat(utilizeVehicles)
            .map(this.getVehicleToApprove);
    };

    getPendingVehiclesContent = () =>
        <div>
            <div className={"all-pending-vehicles-title"}>
                List of all pending approvals
            </div>
            {this.getPendingVehicleInfos()}
        </div>;

    getVehicles = () => this.pendingVehiclesPresent() ?
        this.getPendingVehiclesContent() :
        this.getDefault();

    pendingVehiclesPresent = () =>
        this.state.pendingApprovalVehicles.length > 0 ||
        this.state.utilizationApprovalVehicles.length > 0;

    getDefault = () =>
        <div>
            <div className="alert alert-info mine-vehicles" role="alert">
                There are no pending approvals at the moment.
            </div>
        </div>;

    getWait = () =>
        <div className="alert alert-info" role="alert">
            Please wait...
        </div>;

    render() {
        return this.state.downloadedPending && this.state.downloadedUtilization ?
            (this.state.error ?
                this.getAllPendingApprovalsDownloadError() :
                this.getVehicles()) :
            this.getWait();
    }
}
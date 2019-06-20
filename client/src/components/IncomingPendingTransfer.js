import React, {Component} from "react";

import VehicleInfo from "./VehicleInfo";
import ApproveVehicle from "./ApproveVehicle";

export default class IncomingPendingTransfer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            download: false,
            error: false,
            vehicles: [],
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
        this.vehicleService.getIncomingTransfers()
            .then(response => {
                this.setState({
                    vehicles: response
                });
            })
            .catch(() => {
                this.setState({
                    error: true
                })
            })
            .finally(() => {
                this.setState({
                    download: true
                });
            });
    }

    getVehiclesDownloadError = () =>
        <div>
            Something went wrong ...
        </div>;

    handleApproveClicked = id =>
        this.vehicleService.approveTransfer(id)
            .then(() => {
                console.log("transfer approved ", id);
                this.props.onChange();
            });

    getIncomingPendingTransferVehicleInfos = vehicles =>
        vehicles.map(vehicle =>
            <div key={vehicle.id + vehicle.status}>
                <VehicleInfo
                    vehicle={vehicle}/>
                <ApproveVehicle
                    vehicleId={vehicle.id}
                    handleApproveClicked={this.handleApproveClicked}/>
            </div>
        );

    getVehiclesContent = vehicles =>
        <div className={"incoming-transfers"}>
            <div className={"mine-vehicles-title"}>
                Incoming pending transfers
            </div>
            {this.getIncomingPendingTransferVehicleInfos(vehicles)}
        </div>;

    getVehicles = () => {
        const vehicles = this.state.vehicles
            .map(vehicle => ({...vehicle, status: "transfer"}));

        return vehicles && vehicles.length > 0 ?
            this.getVehiclesContent(vehicles) :
            this.getDefault();
    };

    getDefault = () =>
        <div>
            <div className="alert alert-info incoming-pending-transfer-vehicles" role="alert">
                No transfers to approve at the moment.
            </div>
        </div>;

    getWait = () =>
        <div className="alert alert-info" role="alert">
            Please wait...
        </div>;

    render() {
        return this.state.download ?
            (this.state.error ?
                this.getVehiclesDownloadError() :
                this.getVehicles()) :
            this.getWait();
    }
}
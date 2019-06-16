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
        this.vehicleService.getIncomingPendingTransfer()
            .then(response => {
                console.log('incoming pending transfer then');
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
                console.log('incoming pending transfer finally');
                this.setState({
                    download: true
                });
            });
    }

    getVehiclesDownloadError = () => {
        return (
            <div>
                Something went wrong ...
            </div>
        )
    };

    handleApproveClicked = (id) => {
        this.vehicleService.approveTransfer(id)
            .then(() => {
                console.log("transfer approved ", id);
                this.props.onChange();
            });
    };

    getIncomingPendingTransferVehicleInfos = (vehicles) => {
        return (
            vehicles.map(vehicle =>
                <div key={vehicle.id}>
                    <VehicleInfo
                        vehicle={vehicle}/>
                    <ApproveVehicle
                        vehicleId={vehicle.id}
                        handleApproveClicked={this.handleApproveClicked}/>
                </div>
            )
        );
    };

    getVehiclesContent = (vehicles) => {
        return (
            <div>
                <div className={"mine-vehicles-title"}>
                    List of incoming pending transfer
                </div>
                {this.getIncomingPendingTransferVehicleInfos(vehicles)}
            </div>
        );
    };

    getVehicles = () => {
        const vehicles = this.state.vehicles
            .map(vehicle => ({...vehicle, status: "transfer"}));

        return vehicles && vehicles.length > 0 ?
            this.getVehiclesContent(vehicles) :
            this.getDefault();
    };

    getDefault = () => {
        return (
            <div>
                <div className={"incoming-pending-transfer-vehicles"}>
                    List of incoming pending vehicle transfer is empty
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
        return this.state.download ?
            (this.state.error ?
                this.getVehiclesDownloadError() :
                this.getVehicles()) :
            this.getWait();
    }
}
import React, {Component} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import getWeb3 from "./utils/getWeb3";

import VehicleService from "./services/VehicleService";
import VehicleAddition from "./components/VehicleAddition";
import AllPendingVehicles from "./components/AllPendingVehicles";
import "./App.css";

class App extends Component {
    state = {web3: null, vehicleService: null, adding: false, browsing: false};

    componentDidMount = async () => {
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();
            const vehicleService = await VehicleService.init(web3);
            this.setState({web3: web3, vehicleService: vehicleService});
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    chooseAdding = () => {
        this.setState({
            adding: true,
            browsing: false
        })
    };

    chooseBrowsing = () => {
        this.setState({
            browsing: true,
            adding: false
        })
    };

    getProperComponents = () => {
        if (this.state.browsing) {
            return (
                <div className={"row"}>
                    <div className={"col-sm-6"}>
                        <VehicleAddition
                            vehicleService={this.state.vehicleService}
                        />
                    </div>
                    <div className={"col-sm-6"}>
                        <AllPendingVehicles
                            vehicleService={this.state.vehicleService}
                        />
                    </div>
                </div>
            )
        }
    };


    render() {
        if (!this.state.web3) {
            return (
                <div>
                    Loading Web3, accounts, and contract...
                </div>
            );
        } else {

            return (
                <div>
                    <div className={"row"}>
                        <div className={"col-sm-4"}>
                            <button type={"button"}
                                    className={"btn btn-primary"}
                                    onClick={this.chooseAdding}>
                                Add
                            </button>
                        </div>
                        <div className={"col-sm-4"}>
                            <button type={"button"}
                                    className={"btn btn-primary"}
                                    onClick={this.chooseBrowsing}>
                                Browse
                            </button>
                        </div>
                    </div>
                    {this.getProperComponents()}
                </div>
            )
        }
    }
}

export default App;
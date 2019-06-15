import React, {Component} from "react";
import getWeb3 from "./utils/getWeb3";

import VehicleService from "./services/VehicleService";

import VehicleAddition from "./components/VehicleAddition";
import "./App.css";

class App extends Component {
    state = {web3: null, vehicleService: null};

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

    render() {
        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        } else {
            return <VehicleAddition vehicleService={this.state.vehicleService}/>
        }
    }
}

export default App;
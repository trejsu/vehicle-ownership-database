import React, {Component} from "react";
import getWeb3 from "./utils/getWeb3";

import VehicleAddition from "./components/VehicleAddition";

import "./App.css";

class App extends Component {
    state = {web3: null, accounts: null};

    componentDidMount = async () => {
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();

            this.setState({web3, accounts});

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
            return <VehicleAddition number={6}/>
        }
    }
}

export default App;

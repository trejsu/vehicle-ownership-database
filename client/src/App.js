import React, {Component} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import getWeb3 from "./utils/getWeb3";

import VehicleService from "./services/VehicleService";

import NavigationBar from "./components/NavigationBar";
import Content from "./components/Content";

import "./App.css";

class App extends Component {
    state = {web3: null, vehicleService: null, page: null};

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

    onNavigationChange = (page) => {
        this.setState({page: page});
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
                <div className={"row"}>
                    <div className={"col-lg-8 offset-lg-2 col-md-8 offset-md-2 col-sm-10 offset-sm-1 col-xs-12"}>
                        <NavigationBar
                            onNavigationChange={this.onNavigationChange.bind(this)}
                        />
                        <Content
                            vehicleService={this.state.vehicleService}
                            page={this.state.page}
                        />
                    </div>
                </div>
            )
        }
    }
}

export default App;
import React, {Component} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import getWeb3 from "./utils/getWeb3";

import VehicleOwnershipDatabase from "./contracts/VehicleOwnershipDatabase";
import VehicleService from "./services/VehicleService";

import NavigationBar from "./components/NavigationBar";
import Content from "./components/Content";

import "./App.css";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            web3: null,
            vehicleService: null,
            page: 'private',
            account: null,
            intervalId: null
        };
    }

    async componentDidMount() {
        try {
            const web3 = await getWeb3();
            const vehicleService = await VehicleService.init(web3);
            const account = (await web3.eth.getAccounts())[0];
            const networkId = (await web3.eth.net.getId());

            this.setState({
                web3: web3,
                vehicleService: vehicleService,
                account: account,
                networkId: networkId
            });
        } catch (error) {
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
        const intervalId = setInterval(this.timer.bind(this), 1000);
        this.setState({intervalId: intervalId});
    };

    componentWillUnmount() {
        clearInterval(this.state.intervalId);
    }

    async timer() {
        const account = (await this.state.web3.eth.getAccounts())[0];
        const networkId = (await this.state.web3.eth.net.getId());

        if (account !== this.state.account ||
            networkId !== this.state.networkId) {
            this.setState({
                account: account,
                networkId: networkId
            });
        }
    }

    onNavigationChange = (page) => {
        this.setState({page: page});
    };

    getNavigationBar = () => {
        return <NavigationBar
            account={this.state.account}
            networkId={this.state.networkId}
            page={this.state.page}
            onNavigationChange={this.onNavigationChange.bind(this)}/>
    };

    getContent = () => {
        const showContent = VehicleOwnershipDatabase.networks[this.state.networkId];
        return showContent &&
            <Content
                account={this.state.account}
                page={this.state.page}
                vehicleService={this.state.vehicleService}/>
    };

    render() {
        if (!this.state.web3) {
            return (
                <div className="alert alert-info" role="alert">
                    Loading Web3, accounts, and contract...
                </div>
            );
        } else {
            return (
                <div className={"row"} id={"main"}>
                    <div className={"col-lg-8 offset-lg-2 col-md-8 offset-md-2 col-sm-10 offset-sm-1 col-xs-12"}>
                        {this.getNavigationBar()}

                        {this.getContent()}
                    </div>
                </div>
            )
        }
    }
}

export default App;
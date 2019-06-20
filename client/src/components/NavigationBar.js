import React, {Component} from "react";
import VehicleOwnershipDatabase from "../contracts/VehicleOwnershipDatabase";

export default class NavigationBar extends Component {
    state = {
        account: this.props.account,
        networkId: this.props.networkId,
        page: this.props.page
    };

    navigationOptions = [{
        pageKey: "private",
        description: "My vehicles"
    }, {
        pageKey: "adding",
        description: "Add vehicle"
    }, {
        pageKey: "browsing",
        description: "Browse vehicles"
    }];

    componentDidMount() {
        this.onNavigationChange = this.props.onNavigationChange;
        const network = VehicleOwnershipDatabase.networks[this.state.networkId];
        this.setState({
            network: network
        })
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.networkId !== this.state.networkId) {
            const network = VehicleOwnershipDatabase.networks[nextProps.networkId];
            this.setState({
                network: network
            })
        }

        this.setState({
            account: nextProps.account,
            networkId: nextProps.networkId
        });
    }

    onNavigationButtonClick = event => {
        const page = event.target.value;
        this.setState({page: page});
        this.onNavigationChange(page);
    };

    getActualPageElement = option => {
        return (
            <button
                className={"btn btn-primary"}
                disabled={true}
                value={option.pageKey}>
                {option.description}
            </button>
        );
    };

    getOtherPageElement = option => {
        return (
            <button
                className={"btn btn-secondary active"}
                onClick={this.onNavigationButtonClick}
                value={option.pageKey}>
                {option.description}
            </button>
        );
    };

    getElement = option => {
        const elem = this.state.page === option.pageKey ?
            this.getActualPageElement(option) :
            this.getOtherPageElement(option);

        return (
            <div className={"col"} key={option.pageKey}>
                {elem}
            </div>
        );
    };

    getAccountInformation = () => {
        return (
            <div className={"col-xs-12"} title={this.state.account}>
                <div>
                    Current account id
                </div>
                <div>
                    {this.state.account}
                </div>
            </div>
        );
    };

    getNetworkContent = () => {
        if (this.state.network) {
            return (
                <div>
                    <div>
                        Current network
                    </div>
                    <div>
                        {this.state.networkId}
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <div>
                        Current network
                    </div>

                    <div>
                        {this.state.networkId}
                    </div>

                    <div className={"wrong-neighborhood"}>
                        <div className={"caution"}>
                            CAUTION
                        </div>

                        <div>
                            You came to the wrong neighborhood!
                        </div>
                    </div>

                    <div>
                        Change your network
                    </div>
                </div>
            );
        }
    };

    getNetworkInformation = () => {
        const content = this.getNetworkContent();

        return this.state.networkId && (
            <div className={"col-xs-12"} title={this.state.account}>
                {content}
            </div>
        );
    };

    getNavigationBar = () => {
        return (
            <div className={"row"}>
                {this.navigationOptions.map(this.getElement)}
            </div>
        );
    };

    getContent = () => {
        return this.state.network &&
            <div className={"col-lg-6 offset-lg-3 col-md-10 offset-md-1 col-sm-12 col-xs-12"}>
                {this.getNavigationBar()}
            </div>
    };

    render() {
        return (
            <div className={"row navigation-panel"}>
                <div className={'col-lg-6 offset-lg-3 col-md-10 offset-md-1 col-sm-12 col-xs-12 network-information'}>
                    {this.getNetworkInformation()}
                </div>

                <div className={'col-lg-6 offset-lg-3 col-md-10 offset-md-1 col-sm-12 col-xs-12 account-information'}>
                    {this.getAccountInformation()}
                </div>

                {this.getContent()}
            </div>
        );
    }
}
import React, {Component} from "react";

export default class NavigationBar extends Component {
    state = {page: this.props.page};

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

    getNavigationBar = () => {
        return (
            this.navigationOptions.map(option =>
                this.getElement(option))
        );
    };

    render() {
        return (
            <div className={"row navigation-panel"}>
                <div className={"col-lg-6 offset-lg-3 col-md-10 offset-md-1 col-sm-12 col-xs-12"}>
                    <div className={"row"}>
                        {this.getNavigationBar()}
                    </div>
                </div>
            </div>
        );
    }
}
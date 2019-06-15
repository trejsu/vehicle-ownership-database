import React, {Component} from "react";

class VehicleAddition extends Component {
    state = {number: 0};

    componentDidMount = async () => {
        this.setState({number: 5})
    };

    render() {
        return (
            <div>
                <div>
                    Hello, with state number = {this.state.number}
                </div>
                <div>
                    Hello, with props number = {this.props.number}
                </div>
            </div>
        );
    }
}

export default  VehicleAddition;
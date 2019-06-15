import React, {Component} from "react";

export default class AllPendingVehicles extends Component {

    componentDidMount = async () => {
        this.somePromise()
            .then((response) => {
                console.log(response);
            })
            .catch(err => {
                console.log(err);
            });
    };

    somePromise = () => {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve(45);
            }, 2000);
        })
    };

    render() {
        return (
            <div>
                Something went wrong?
            </div>
        );
    }
}
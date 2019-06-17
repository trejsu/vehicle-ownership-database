# Vehicle ownership database

Web application, based on Ethereum blockchain,  allowing users to manage data about
owned vehicles.

## Prerequisites
User should have: 
* [Metamask](https://metamask.io/) extension installed in web browser (Chrome, Firefox, Opera)
* ethereum wallet imported to Metamask, with essential amount of ether to interact with blockchain database
* there is no need to additionally create any extra account in application, ethereum address will be synchronize with
app from Metamask

## Functionality
1. Registering vehicle in database:
   - user can register owned car using: 
     - VIN number for cars
     - serial number for bikes
     - vehicle model
   - after submitting new vehicle, it is stored in pending list, waiting for approval from two other users
2. Transferring vehicle:
   - user has ability to transfer owned vehicle to another existing user 
   - transfer has to be confirmed by vehicle receiver, until then it is stored in pending transfers list
3. Vehicle utilisation: 
   - user can utilize owned vehicle 
   - after submitting vehicle is waiting in pending for utilisation list for approval from one additional user

4. Additionally users are allowed to: 
   - browse owned, registered vehicles 
   - browse possible to approve, pending for register, transfer or utlisation vehicles and confirm them
   - search any existing in database vehicles by VIN or serial number and view their details, including state (registered, transferred, pending for register, waiting for utilisation)
   
## For developers
### Requirements
App is unboxed from [Drizzle](https://www.trufflesuite.com/boxes/drizzle) project. 
1. Matamask 
2. Ganache 
3. Truffle framework
4. Node.js 

### Installation
1. In the ```client``` directory we run React app. Type ```npm install``` to download project dependencies. 
2. We simulate database with in-memory blockchain instance, so make sure that you have Ganache running on port 7547 with network id 5777. 
2. Project has two contracts written in solidity. To compile and deploy it in network type ```truffle migrate --network develop``` from project root. 
5. If you have successfully deployed contract run the client app from ```client``` directory ```npm start```. 
6. Project contains tests for contract VehicleOwnershipDatabase contract written in Javascript. 
   To run tests type ```truffle test ``` from ```root``` directory. Disconnect a running Ganache instance to use Truffle built-in blockchain. 
7. Project contains tests for React app in ```client/test``` package. From ```client``` directory run ```npm run test```.
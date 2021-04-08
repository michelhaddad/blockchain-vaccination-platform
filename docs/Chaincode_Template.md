# Introduction

An initial iteration of the `donationcc` chaincode was added to the `basic` network.
A convention will be adopted whereby **one single smart contract** will be packaged in a chaincode container.


# Adding a new smart contract

To add a smart contract you will need to follow these steps:

1. Navigate to the chaincode folder of the network you want to add the contract to (in our case `basic/chaincode`)
2. Create a folder preferably with a name like cc (ex: `donationcc`)
3. You will need to initialize an npm project in it (just copy paste the `donationcc` folder and change it accordingly)
4. Implement all the logic
5. Make sure you export the contract in `index.js`
6. Add your smart contract in `basic/scripts/platformcc/channel-chaincode-setup.sh`
7. Feel free to add some bash scripts so that smart contracts can easily be tested from the cli container

In case any additional assistance is needed, check these pull requests [#1](https://github.com/michelhaddad/blockchain-analyzer/pull/1) and [#2](https://github.com/michelhaddad/blockchain-analyzer/pull/2)

# Side note

Once a chaincode is added/removed, don't forget to issue `make rmchaincode` in the `network/basic` directory before starting your network.

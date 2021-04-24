# Blockchain Vaccination Platform
This project is a POC, aimed at showing that building a **project management framework with Hyperledger Fabric** is feasible.

## Description

Currently, the project includes:

1. An Elastic beats module (in Go), that ships ledger data from a Hyperledger peer to an Elasticsearch instance. 

2. Generic Kibana dashboards, that allow selection of a particular key and visualization updates to it (channel, id, timestamp etc) - similar to Hyperledger Explorer.

3. [Scripts](https://github.com/hyperledger-labs/blockchain-analyzer/tree/master/network) to create and configure the `basic` Hyperledger Fabric network.

4. [Scripts](https://github.com/hyperledger-labs/blockchain-analyzer/tree/master/stack) to start and stop Elasticsearch and Kibana.

5. An Express REST server that communicates with the Blockchain.

6. A web interface to interact with the Blockchain network and visualize data and transactions.

### Project background

This project was part of the Multidisciplinary project at Saint Joseph University.


## Getting Started

You should start by running the `basic` network by following our [Basic Setup](docs/Basic_setup.md) file.

If you want to learn more about `fabricbeat` configuration or connect it to your own blockchain network, click [here](docs/Fabricbeat_config.md).

If you want to understand dataflow involving `fabricbeat`, click [here](docs/Fabricbeat_architecture.md).

## License
The Apache 2.0 License applies to the whole project, except for the [stack](https://github.com/hyperledger-labs/blockchain-analyzer/tree/master/stack) directory and its contents.

## Acknowledgments:
Big thanks to [Salman Baset](https://github.com/salmanbaset) and [Balazs Prehoda](https://github.com/balazsprehoda) authors of https://github.com/hyperledger-labs-archives/blockchain-analyzer, which we used to initially set up the project and work with the ELK stack.

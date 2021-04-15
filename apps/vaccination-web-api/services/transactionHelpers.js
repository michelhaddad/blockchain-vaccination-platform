/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const configPath = path.resolve(__dirname, 'config.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);

module.exports.submitTransaction = async function invokeContract(tx) {
    let ccpPath = path.resolve(__dirname, config.connection_profile);
    let ccpJSON = fs.readFileSync(ccpPath, 'utf8');
    let ccp = JSON.parse(ccpJSON);

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), '..', 'dummyapp', 'wallet');
    const wallet = new FileSystemWallet(walletPath);

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: tx.user, discovery: { enabled: false } });

    // Get the network (channel) our contract is deployed to.

    const network = await gateway.getNetwork(tx.channel);
    // Get the contract from the network.
    const contract = network.getContract(tx.contract);
    console.log("Invoking the following transaction:\n",tx, '\n\n')

    let result;
    result = await contract.submitTransaction(tx.txFunction, ...tx.args);
    gateway.disconnect();

    return result;
}

module.exports.evaluateTransaction = async function invokeContract(tx) {
    let ccpPath = path.resolve(__dirname, config.connection_profile);
    let ccpJSON = fs.readFileSync(ccpPath, 'utf8');
    let ccp = JSON.parse(ccpJSON);

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), '..', 'dummyapp', 'wallet');
    const wallet = new FileSystemWallet(walletPath);

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: tx.user, discovery: { enabled: false } });

    // Get the network (channel) our contract is deployed to.

    const network = await gateway.getNetwork(tx.channel);
    // Get the contract from the network.
    const contract = network.getContract(tx.contract);
    console.log("Invoking the following transaction:\n",tx, '\n\n')

    let result;
    result = await contract.evaluateTransaction(tx.txFunction, ...tx.args);
    gateway.disconnect();

    return result;
}
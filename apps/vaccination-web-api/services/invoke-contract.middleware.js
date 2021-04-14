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

module.exports = async function invokeContract(tx, contractName, channelName) {
    let ccpPath = path.resolve(__dirname, config.connection_profile);
    let ccpJSON = fs.readFileSync(ccpPath, 'utf8');
    let ccp = JSON.parse(ccpJSON);
    // Create a new file system based wallet for managing identities.
    const walletPath = '/home/paola/go/1.12.7/src/github.com/blockchain-analyzer/apps/dummyapp/wallet'
    const wallet = new FileSystemWallet(walletPath);
    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: tx.user, discovery: { enabled: false } });
    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork(channelName);
    // Get the contract from the network.
    const contract = network.getContract(contractName);
    console.log("invoking",tx)
    // Submit the transaction.
    if (tx.key) {
        if (tx.previousKey) {
            await contract.submitTransaction(tx.txFunction, tx.key, tx.previousKey);
        }
        else {
            await contract.submitTransaction(tx.txFunction, tx.key);
        }
    }
    else {
        await contract.submitTransaction(tx.txFunction);
    }
    // Disconnect from the gateway.
    await gateway.disconnect();
}
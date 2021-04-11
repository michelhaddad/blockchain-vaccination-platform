/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const OrderDelivery = require('../../network/basic/chaincode/supplychaincc/lib/orderDelivery');
const uuid = require('uuid');

const getUID = () => uuid.v4();

const configPath = path.resolve(__dirname, 'config.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);

let ccpPath;
let ccpJSON;
let ccp;

async function main() {
    try {

        dotenv.config();
        if (process.env.NETWORK != undefined) {
            config.connection_profile = config.connection_profile.replace("basic", process.env.NETWORK);
        }
        if (process.env.CHANNEL != undefined) {
            config.channel.channelName = config.channel.channelName.replace("mychannel", process.env.CHANNEL);
        }

        ccpPath = path.resolve(__dirname, config.connection_profile);
        ccpJSON = fs.readFileSync(ccpPath, 'utf8');
        ccp = JSON.parse(ccpJSON);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet, identity: 'user1', discovery: { enabled: false }, eventHandlerOptions: {
                commitTimeout: 100,
            },
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(config.channel.channelName);

        // Get the contract from the network.
        const contract = network.getContract("supplychaincc");

        // issue commercial paper
        console.log('Submit order issue transaction.');

        //deliveryID, storageID, hospitalID, batchNumber, numberOfVials, arrivalDateTime
        let issueResponse = await contract.submitTransaction('issue', 'delivery1', 'storage1', 'hospital1',
            'BATCH001', '500', '2021-04-8');

        // process response
        console.log('Process issue transaction response.' + issueResponse);

        let delivery = OrderDelivery.fromBuffer(issueResponse);

        console.log(`Order ${delivery.deliveryID} issued by ${delivery.issuer} with the state ${delivery.currentState}\n`);
        
        //###################################################################################################################
        console.log('Leaving border control.');

        issueResponse = await contract.submitTransaction('storageDelivery', 'order1');

        // process response
        console.log('Process issue transaction response.' + issueResponse);

        delivery = OrderDelivery.fromBuffer(issueResponse);

        console.log(`Order ${delivery.deliveryID} left ${delivery.borderControl} to ${delivery.storage} with the state ${delivery.currentState}\n`);

        //###################################################################################################################
        console.log('Arriving to storage.');

        issueResponse = await contract.submitTransaction('storageArrival', 'order1');

        // process response
        console.log('Process issue transaction response.' + issueResponse);

        delivery = OrderDelivery.fromBuffer(issueResponse);

        console.log(`Order ${delivery.deliveryID} arrived to ${delivery.storage} with the state ${delivery.currentState}\n`);

        //###################################################################################################################
        console.log('Leaving storage.');

        issueResponse = await contract.submitTransaction('hospitalDelivery', 'order1');

        // process response
        console.log('Process issue transaction response.' + issueResponse);

        delivery = OrderDelivery.fromBuffer(issueResponse);

        console.log(`Order ${delivery.deliveryID} left ${delivery.storage} to ${delivery.hospital} with the state ${delivery.currentState}\n`);


        //###################################################################################################################
        console.log('Arriving to hospital.');

        issueResponse = await contract.submitTransaction('hospitalArrival', 'order1');

        // process response
        console.log('Process issue transaction response.' + issueResponse);

        delivery = OrderDelivery.fromBuffer(issueResponse);

        console.log(`Order ${delivery.deliveryID} arrived to ${delivery.hospital} with the state ${delivery.currentState}\n`);

        process.exit();
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

main();

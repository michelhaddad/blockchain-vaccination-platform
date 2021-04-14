/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const DonationPaper = require('../../network/basic/chaincode/donationcc/lib/donationPaper');
const uuid = require('uuid');
const Order = require('../../network/basic/chaincode/ordercc/lib/order');

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

        /**
         * Impact make order
         */

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
        const contract = network.getContract("ordercc");
        // issue order
        console.log('Submit order issue transaction.');

        const issueResponse = await contract.submitTransaction('issue', '1', 'Pfizer?', 'Border control', '150000', '2021-05-20');
        // process response
        console.log('Process issue transaction response.' + issueResponse);
        let order = Order.fromBuffer(issueResponse);
        console.log(`Order ${order.orderID} issued by ${order.issuer}.`);

        /**
         * Manufacturer Approves
         */
        console.log(`
        
        `);

        const user2Exists = await wallet.exists('user4');
        if (!userExists) {
            console.log('An identity for the user "user4" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway2 = new Gateway();
        await gateway2.connect(ccp, {
            wallet, identity: 'user4', discovery: { enabled: false }, eventHandlerOptions: {
                commitTimeout: 100,
            },
        });

        const network2 = await gateway2.getNetwork(config.channel.channelName);

        // Get the contract from the network.
        const contract2 = network2.getContract("ordercc");

        // approve order
        console.log('Submit order approve transaction.');

        const approveResponse = await contract2.submitTransaction('approve', '1', '9x5x4s5', '2021-05-02');
        // process response
        console.log('Process issue transaction response.' + approveResponse);
        order = Order.fromBuffer(approveResponse);
        console.log(`${order.issuer} approved order ${order.orderID}.`);

        /**
         * Skip shipping and Delivery
         */

        /**
         * Get All orders
         */
        console.log(`
        xxxxxxxxxxxxxx
        Getting Orders
        xxxxxxxxxxxxxx
        `)
        // issue order
        console.log('Submit get all orders transaction.');

        const getAllResponse = await contract.evaluateTransaction('getAllOrders');
        // process response
        console.log('Process issue transaction response.' + getAllResponse);


        process.exit();
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

main();
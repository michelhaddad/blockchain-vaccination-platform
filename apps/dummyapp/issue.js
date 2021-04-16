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
        if ( process.env.NETWORK != undefined) {
            config.connection_profile = config.connection_profile.replace("basic", process.env.NETWORK);
        }
        if ( process.env.CHANNEL != undefined) {
            config.channel.channel2 = config.channel.channel2.replace("mychannel", process.env.CHANNEL);
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
        await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false }, eventHandlerOptions: {
            commitTimeout: 100,
          },});

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(config.channel.channel2);

        // Get the contract from the network.
        const contract = network.getContract("donationcc");

        // issue commercial paper
        console.log('Submit donation paper issue transaction.');

        const issueResponse = await contract.submitTransaction('issue', '5', '1000');

        // process response
        console.log('Process issue transaction response.' + issueResponse);

        let paper = DonationPaper.fromBuffer(issueResponse);

        console.log(`Donation paper ${paper.paperID} issued by ${paper.issuer} with the amount of ${paper.amount}`);
        process.exit();
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

main();
/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const Hospital = require('../../network/basic/chaincode/hospitalcc/lib/hospital');

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
        await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('hospitalcc');

        /**
         * Index all Hospitals
         */

        // Evaluate the specified transaction.
        console.log('Getting all hospitals ...')
        const result = await contract.evaluateTransaction('indexHospitals');
        let res = JSON.parse(JSON.parse(result));
        console.log('Hospitals:');
        res.forEach(element => {
            console.log('   - ' + element.Record.name)
        });

        console.log(`

        Delivering to Hospital ...

        `)

        /**
         * Deliver to Hospital
         */
        const deliverResponse = await contract.submitTransaction('deliverVials', '1', 'BATCH001', '100', 'Manufacturer');
        console.log('Process issue transaction response.' + deliverResponse);
        let hospital = Hospital.fromBuffer(deliverResponse);
        console.log(`Delivered 100 vials from Manufacturer to hospital ${hospital.name}.`)

        /**
         * Inoculate patients
         */

        console.log(`

          Inoculating patients ...
          
          `)

        const inoculateResponse = await contract.submitTransaction('inoculatePatients', '1', 'BATCH001', '100');
        console.log('Process issue transaction response.' + inoculateResponse);
        hospital = Hospital.fromBuffer(inoculateResponse);
        console.log(`Inoculated 500 patients from hospital ${hospital.name}.`)
        console.log('\n\n' + hospital.name + ' vaccine stats:');
        console.log(hospital.vaccineData);
        process.exit();

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

main();
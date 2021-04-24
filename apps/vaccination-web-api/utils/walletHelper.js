const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const User = require('../database/models/user');

const configPath = path.resolve(__dirname, '..', 'services', 'config.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);

let ccpPath;
let ccpJSON;
let ccp;

const addUserToWallet = async (userInfo, adminInfo) => {
    ccpPath = path.resolve(__dirname, '..', config.connection_profile);
    ccpJSON = fs.readFileSync(ccpPath, 'utf8');
    ccp = JSON.parse(ccpJSON);

    const walletPath = path.join(__dirname, '..', 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists(userInfo.username + adminInfo.organization);
    if (userExists) {
        console.log('An identity for the user already exists in the wallet: ' + userInfo.username + adminInfo.organization);
        return;
    }

    // Check to see if we've already enrolled the admin user.
    const adminExists = await wallet.exists(adminInfo.enrollmentID);
    if (!adminExists) {
        console.log('Identity for the admin user does not exist in the wallet: admin' + adminInfo.organization);
        return;
    }


    // Create a new gateway for connecting to our peer node.
    var gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: adminInfo.enrollmentID, discovery: { enabled: false } });

    // Get the CA client object from the gateway for interacting with the CA.

    var caURL = ccp.certificateAuthorities[ccp.organizations[adminInfo.organization]['certificateAuthorities'][0]].url;
    var ca = new FabricCAServices(caURL);
    var adminIdentity = gateway.getCurrentIdentity();
    let affiliationService = ca.newAffiliationService();
    let registeredAffiliations = await affiliationService.getAll(adminIdentity);
    // If the CA does not have the affiliation to which the user belongs, add it
    if (!registeredAffiliations.result.affiliations.some(
        x => x.name == adminInfo.organization.toLowerCase())) {
        let affiliation = adminInfo.organization.toLowerCase() + '.department1';
        await affiliationService.create({
            name: affiliation,
            force: true
        }, adminIdentity);
    }

    // Register the user, enroll the user, and import the new identity into the wallet.
    var secret = await ca.register({ affiliation: adminInfo.organization.toLowerCase() + '.department1', enrollmentID: userInfo.username + adminInfo.organization, role: 'client', attrs: [{ name: "role", value: "patient", ecert: true }] }, adminIdentity);
    var enrollment = await ca.enroll({ enrollmentID: userInfo.username + adminInfo.organization, enrollmentSecret: secret });
    var userIdentity = X509WalletMixin.createIdentity(config.organizations[adminInfo.organization].MSP, enrollment.certificate, enrollment.key.toBytes());
    wallet.import(userInfo.username + adminInfo.organization, userIdentity);
    console.log('Successfully registered and enrolled user and imported it into the wallet: ', userInfo.username + adminInfo.organization);
    return {
        enrollmentID: userInfo.username + adminInfo.organization,
        organization: adminInfo.organization
    }
}

module.exports = {
    addUserToWallet
}
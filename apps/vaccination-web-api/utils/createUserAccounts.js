'use strict';

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

const addUserToDB = async ({username, organization, password, enrollmentID}) => {
    User.register(
        new User({ username, organization, enrollmentID}),
        password,
        (err, user) => {
          if (err) {
            throw err;
          } else {
              user.save((err, user) => {
              if (err) {
                throw err;
              }
              console.log("Successfully registered the user: " + username)
            });
          }
        },
    );
}

const createUserAccounts = async () => {
    ccpPath = path.resolve(__dirname, '..', config.connection_profile);
    ccpJSON = fs.readFileSync(ccpPath, 'utf8');
    ccp = JSON.parse(ccpJSON);

    const walletPath = path.join(__dirname, '..', 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    for (let key of Object.keys(config.users)) {

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(config.users[key].name);
        if (userExists) {
            console.log('An identity for the user already exists in the wallet: ' + config.users[key].name);
            return;
        }

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists('admin' + config.users[key].organization);
        if (!adminExists) {
            console.log('Identity for the admin user does not exist in the wallet: admin' + config.users[key].organization);
            console.log('Run the enrollAdmins.js application before retrying');
            return;
        }
        

        // Create a new gateway for connecting to our peer node.
        var gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'admin' + config.users[key].organization, discovery: { enabled: false } });
        
        // Get the CA client object from the gateway for interacting with the CA.
        //var ca = gateway.getClient().getCertificateAuthority();

        var caURL = ccp.certificateAuthorities[ccp.organizations[config.users[key].organization]['certificateAuthorities'][0]].url;
        var ca = new FabricCAServices(caURL);
        var adminIdentity = gateway.getCurrentIdentity();
        let affiliationService = ca.newAffiliationService();
        let registeredAffiliations = await affiliationService.getAll(adminIdentity);
        // If the CA does not have the affiliation to which the user belongs, add it
        if (!registeredAffiliations.result.affiliations.some(
            x => x.name == config.users[key].organization.toLowerCase())) {
            let affiliation = config.users[key].organization.toLowerCase() + '.department1';
            await affiliationService.create({
                name: affiliation,
                force: true
            }, adminIdentity);
        }
        
        // Register the user, enroll the user, and import the new identity into the wallet.
        var secret = await ca.register({ affiliation: config.users[key].organization.toLowerCase() + '.department1', enrollmentID: config.users[key].name, role: 'client', attrs: [{ name: "role", value: "patient", ecert: true }] }, adminIdentity);
        var enrollment = await ca.enroll({ enrollmentID: config.users[key].name, enrollmentSecret: secret });
        var userIdentity = X509WalletMixin.createIdentity(config.organizations[config.users[key].organization].MSP, enrollment.certificate, enrollment.key.toBytes());
        wallet.import(config.users[key].name, userIdentity);
        console.log('Successfully registered and enrolled user and imported it into the wallet: ', config.users[key].name);
        await addUserToDB({
            username: config.users[key].name,
            enrollmentID: config.users[key].name,
            organization: config.users[key].organization,
            password: 'password'
        })
    }
}

module.exports = createUserAccounts;
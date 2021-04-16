import { Injectable } from '@angular/core';
import { networkConfig } from './network.config';
import { Gateway, FileSystemWallet }from 'fabric-network'
import { Subscription } from 'rxjs';
import { connectionProfile } from './connectionProfile';
@Injectable({
  providedIn: 'root',
})
export class HyperledgerFabricService {
  constructor() {}

  async main() {
    try {

      const config = networkConfig as any;
      const ccp = connectionProfile as any;
      const gateway: Gateway = new Gateway();
      const wallet: FileSystemWallet = new FileSystemWallet(''); //hardcoded for testing

      // Check to see if we've already enrolled all the users.
      for (let i = 0; i < config.users.length; i++) {
          var userExists = await wallet.exists(config.users[i].name);
          if (!userExists) {
              console.log('An identity for the user does not exist in the wallet: ', config.users[i].name);
              console.log('Run the registerUser.js application before retrying');
              return;
          }
      }

      for (let i = 0; i < config.transactions.length; i++) {

          let tx = config.transactions[i];
          // Create a new gateway for connecting to our peer node.
          const gateway = new Gateway();
          await gateway.connect(ccp, { wallet, identity: tx.user, discovery: { enabled: false } });

          // Get the network (channel) our contract is deployed to.
          const network = await gateway.getNetwork(config.channel.channelName);

          // Get the contract from the network.
          const contract = network.getContract(config.channel.contract);

          // Submit the transaction.
          if (tx.key){
              if (tx.previousKey) {
                  await contract.submitTransaction(tx.txFunction, tx.key, tx.previousKey);
                  console.log(`Transaction has been submitted: ${tx.user}\t${tx.txFunction}\t${tx.key}\t${tx.previousKey}`);
              }
              else {
                  await contract.submitTransaction(tx.txFunction, tx.key);
                  console.log(`Transaction has been submitted: ${tx.user}\t${tx.txFunction}\t${tx.key}`);
              }
          }
          else {
              await contract.submitTransaction(tx.txFunction);
              console.log(`Transaction has been submitted: ${tx.user}\t${tx.txFunction}`);
          }
          
          // Disconnect from the gateway.
          await gateway.disconnect();
      }
  } catch (error) {
      console.error(`Failed to submit transaction: ${error}`);
  }
  }
}

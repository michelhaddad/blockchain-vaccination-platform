/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// PaperNet specifc classes
const OrderDelivery = require('./orderDelivery.js');
const OrderDeliveryList = require('./orderDeliveryList.js');

/**
 * A custom context provides easy access to list of all order deliveries
 */
class OrderDeliveryContext extends Context {

    constructor() {
        super();
        // All orders are held in a list of orders
        this.deliveryList = new OrderDeliveryList(this);
    }

}

/**
 * Define supply chain smart contract by extending Fabric Contract class
 *
 */
class SupplyChainContract extends Contract {


    /**
     * Define a custom context for order delivery
    */
    createContext() {
        return new OrderDeliveryContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the contract');
    }

    async query(ctx, query) {
        const iterator = await ctx.stub.getQueryResult(query);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }

    /**
     * Selects orders from database in descending order of arrivalDateTime
     * 
     * @param {Context} ctx 
     * @returns 
     */
    async indexOrderDelivery(ctx) {
        let identity = ctx.clientIdentity;
        const enrollmentID = identity.getAttributeValue('hf.EnrollmentID');
        let org = identity.getMSPID();
        const role;
        if(org === "MOPH")
            role = "issuer";
        else
            role = org;
        const query = `{
            "selector": {
                "${role.toLowerCase()}": "${enrollmentID}", 
                "class": "org.papernet.orderDelivery"
            },
            "sort": [{"arrivalDateTime": "desc"}]
        }`;
        const results = await this.query(ctx, query);
        return results;
    }

    /**
     * Issue order plan
     *
     * @param {Context} ctx the transaction context
     * @param {Integer} deliveryID delivery number
     * @param {Integer} storageID ID of targeted order's storage facility
     * @param {Integer} hospitalID ID of targeted final destination
     * @param {String} batchNumber batch number sent to hospital
     * @param {Integer} numberOfVials number of vials sent to the hospital
     * @param {Date} arrivalDateTime expected arrival date of vials to final destination
    */
    async issue(ctx, deliveryID, storageID, hospitalID, batchNumber, numberOfVials, arrivalDateTime) {
        // get enrollement ID of the issuer
        let identity = ctx.clientIdentity;
        const enrollmentID = identity.getAttributeValue('hf.EnrollmentID');

        // Get today's date in format yyyy-mm-dd
        let today = new Date().toISOString().slice(0, 10);

        // create an instance of the delivery
        let delivery = OrderDelivery.createInstance(deliveryID, enrollmentID, storageID, 
            hospitalID, batchNumber, numberOfVials, arrivalDateTime, today, today);

        // Smart contract moves delivery into IN_BORDER_CONTROL state
        delivery.setInBorderControl();

        // Add the delivery to the list of all similar deliveries in the ledger world state
        await ctx.deliveryList.addDelivery(delivery);

        // Must return a serialized delivery to caller of smart contract
        return delivery;
    }

    /**
     * Initiate order delivery from border control to storage facility
     *
     * @param {Context} ctx the transaction context
     * @param {Integer} deliveryID delivery number
    */
    async storageDelivery(ctx, deliveryID) {
        let delivery = await ctx.deliveryList.getDelivery(deliveryID);

        // Check delivery is in border control
        if (!delivery.isInBorderControl()) {
            throw new Error('Delivery ' + deliveryID + ' is not in border control');
        }

        // Get today's date in format yyyy-mm-dd
        let today = new Date().toISOString().slice(0, 10);

        // Moves delivery into TO_STORAGE state and sets last updated date
        delivery.setToStorage();
        delivery.setUpdateDateTime(today);

        await ctx.deliveryList.updateDelivery(delivery);
        return delivery;
    }


    /**
     * Acknowledge delivery arrival to storage facility
     *
     * @param {Context} ctx the transaction context
     * @param {Integer} deliveryID delivery number
    */
     async storageArrival(ctx, deliveryID) {
        let delivery = await ctx.deliveryList.getDelivery(deliveryID);

        // Check delivery is on its way to storage
        if (!delivery.isToStorage()) {
            throw new Error('Delivery ' + deliveryID + ' is not on its way to storage');
        }

        // Get today's date in format yyyy-mm-dd
        let today = new Date().toISOString().slice(0, 10);

        // Moves delivery into IN_STORAGE state and sets last updated date
        delivery.setInStorage();
        delivery.setUpdateDateTime(today);

        await ctx.deliveryList.updateDelivery(delivery);
        return delivery;
    }

    /**
     * Initiate order delivery from storage facility to hospital
     *
     * @param {Context} ctx the transaction context
     * @param {Integer} deliveryID delivery number
    */
     async hospitalDelivery(ctx, deliveryID) {
        let delivery = await ctx.deliveryList.getDelivery(deliveryID);

        // Check delivery is in storage
        if (!delivery.isInStorage()) {
            throw new Error('Delivery ' + deliveryID + ' is not in storage');
        }

        // Get today's date in format yyyy-mm-dd
        let today = new Date().toISOString().slice(0, 10);

        // Moves delivery into TO_HOSPITAL state and sets last updated date
        delivery.setToHospital();
        delivery.setUpdateDateTime(today);

        await ctx.deliveryList.updateDelivery(delivery);
        return delivery;
    }

    /**
     * Acknowledge delivery arrival to hospital
     *
     * @param {Context} ctx the transaction context
     * @param {Integer} deliveryID delivery number
    */
     async hospitalArrival(ctx, deliveryID) {
        let delivery = await ctx.deliveryList.getDelivery(deliveryID);

        // Check delivery is on its way to hospital
        if (!delivery.isToHospital()) {
            throw new Error('Delivery ' + deliveryID + ' is not on its way to hospital');
        }

        // Get today's date in format yyyy-mm-dd
        let today = new Date().toISOString().slice(0, 10);

        // Moves delivery into IN_HOSPITAL state and sets last updated date
        delivery.setInHospital();
        delivery.setUpdateDateTime(today);

        await ctx.deliveryList.updateOrder(delivery);
        return delivery;
    }
}

module.exports = SupplyChainContract;

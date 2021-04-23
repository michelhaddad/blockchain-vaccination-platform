/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');
const deliveries = require('../init-ledger/deliveries.js');

// PaperNet specifc classes
const OrderDelivery = require('./orderDelivery.js');
const OrderDeliveryList = require('./orderDeliveryList.js');

/**
 * A custom context provides easy access to list of all donation papers
 */
class OrderDeliveryContext extends Context {

    constructor() {
        super();
        // All papers are held in a list of papers
        this.deliveryList = new OrderDeliveryList(this);
    }

}

/**
 * Define donation paper smart contract by extending Fabric Contract class
 *
 */
class SupplyChainContract extends Contract {


    /**
     * Define a custom context for donation paper
    */
    createContext() {
        return new OrderDeliveryContext();
    }

    async instantiate(ctx) {
        for (const delivery of deliveries) {
            let orderDelivery = OrderDelivery.createInstance(delivery.deliveryID, delivery.orderID, 'mophUser', 'StorageFacility', delivery.hospitalID,
                delivery.batchNumber, delivery.numberOfVials, delivery.arrivalDateTime, delivery.issueDateTime, delivery.updateDateTime);
            orderDelivery.currentState = delivery.state;
            await ctx.deliveryList.addDelivery(orderDelivery);
        }
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
        const query = `{
            "selector": {
                "class": "${OrderDelivery.getClass()}"
            }
        }`;
        const results = await this.query(ctx, query);
        return results;
    }

    async getAllOrderDeliveries(ctx, orderID) {
        const query = `{
            "selector": {
                "orderID": "${orderID}",
                "class": "${OrderDelivery.getClass()}"
            }
        }`;
        const results = await this.query(ctx, query);
        return results;
    }

    /**
     * Issue order plan
     *
     * @param {Context} ctx the transaction context
     * @param {Integer} deliveryID order number
     * @param {Integer} storageID ID of targeted order's storage facility
     * @param {Integer} hospitalID ID of targeted final destination
     * @param {String} batchNumber batch number sent to hospital
     * @param {Integer} numberOfVials number of vials sent to the hospital
     * @param {Date} arrivalDateTime expected arrival date of vials to final destination
    */
    async issue(ctx, deliveryID, orderID, storageID, hospitalID, batchNumber, numberOfVials, arrivalDateTime) {
        // get enrollement ID of the issuer
        let identity = ctx.clientIdentity;
        const enrollmentID = identity.getAttributeValue('hf.EnrollmentID');

        // Get today's date in format yyyy-mm-dd
        let today = new Date().toISOString().slice(0, 10);

        // create an instance of the order
        let paper = OrderDelivery.createInstance(deliveryID, orderID, enrollmentID, storageID, 
            hospitalID, batchNumber, numberOfVials, arrivalDateTime, today, today);

        // Smart contract, rather than paper, moves paper into IN_BORDER_CONTROL state
        paper.setInBorderControl();

        // Add the paper to the list of all similar order papers in the ledger world state
        await ctx.deliveryList.addDelivery(paper);

        // Must return a serialized paper to caller of smart contract
        return paper;
    }


    /**
     * Initiate order delivery from border control to storage facility
     *
     * @param {Context} ctx the transaction context
     * @param {Integer} deliveryID order number for this issuer
    */
    async storageDelivery(ctx, deliveryID) {
        let paper = await ctx.deliveryList.getDelivery(deliveryID);

        // Check order is in border control
        if (!paper.isInBorderControl()) {
            throw new Error('Delivery ' + deliveryID + ' is not in border control');
        }

        // Get today's date in format yyyy-mm-dd
        let today = new Date().toISOString().slice(0, 10);

        // Moves order into TO_STORAGE state and sets last updated date
        paper.setToStorage();
        paper.setUpdateDateTime(today);

        await ctx.deliveryList.updateDelivery(paper);
        return paper;
    }


    /**
     * Acknowledge order arrival to storage facility
     *
     * @param {Context} ctx the transaction context
     * @param {Integer} deliveryID order number
    */
     async storageArrival(ctx, deliveryID) {
        let paper = await ctx.deliveryList.getDelivery(deliveryID);

        // Check order is on its way to storage
        if (!paper.isToStorage()) {
            throw new Error('Delivery ' + deliveryID + ' is not on its way to storage');
        }

        // Get today's date in format yyyy-mm-dd
        let today = new Date().toISOString().slice(0, 10);

        // Moves order into IN_STORAGE state and sets last updated date
        paper.setInStorage();
        paper.setUpdateDateTime(today);

        await ctx.deliveryList.updateDelivery(paper);
        return paper;
    }

    /**
     * Initiate order delivery from storage facility to hospital
     *
     * @param {Context} ctx the transaction context
     * @param {Integer} deliveryID order number
    */
     async hospitalDelivery(ctx, deliveryID) {
        let paper = await ctx.deliveryList.getDelivery(deliveryID);

        // Check order is in storage
        if (!paper.isInStorage()) {
            throw new Error('Delivery ' + deliveryID + ' is not in storage');
        }

        // Get today's date in format yyyy-mm-dd
        let today = new Date().toISOString().slice(0, 10);

        // Moves order into TO_HOSPITAL state and sets last updated date
        paper.setToHospital();
        paper.setUpdateDateTime(today);

        await ctx.deliveryList.updateDelivery(paper);
        return paper;
    }

    /**
     * Acknowledge order arrival to hospital
     *
     * @param {Context} ctx the transaction context
     * @param {Integer} deliveryID order number
    */
     async hospitalArrival(ctx, deliveryID) {
        let paper = await ctx.deliveryList.getDelivery(deliveryID);

        // Check paper is on its way to hospital
        if (!paper.isToHospital()) {
            throw new Error('Delivery ' + deliveryID + ' is not on its way to hospital');
        }

        // Get today's date in format yyyy-mm-dd
        let today = new Date().toISOString().slice(0, 10);

        // Moves order into IN_HOSPITAL state and sets last updated date
        paper.setInHospital();
        paper.setUpdateDateTime(today);

        await ctx.deliveryList.updateDelivery(paper);
        const crossContractResponse = await ctx.stub.invokeChaincode('hospitalcc', ['deliverVials', paper.hospitalID, paper.batchNumber, paper.numberOfVials, 'Manufacturer'], 'distributionchannel');
        console.info(crossContractResponse);
        return paper;
    }
}

module.exports = SupplyChainContract;

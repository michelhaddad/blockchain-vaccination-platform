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
 * A custom context provides easy access to list of all donation papers
 */
class OrderDeliveryContext extends Context {

    constructor() {
        super();
        // All papers are held in a list of papers
        this.paperList = new OrderDeliveryList(this);
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


    async indexOrderDelivery(ctx) {
        let identity = ctx.clientIdentity;
        const enrollmentID = identity.getAttributeValue('hf.EnrollmentID');
        const query = `{"selector": {"issuer": "${enrollmentID}"}}`;
        const results = await this.query(ctx, query);
        return results;
    }

    /**
     * Issue order plan
     *
     * @param {Context} ctx the transaction context
     * @param {Integer} orderID order number
     * @param {Integer} storageID ID of targeted order's storage facility
     * @param {Integer} hospitalID ID of targeted final destination
     * @param {String} batchNumber batch number sent to hospital
     * @param {Integer} numberOfVials number of vials sent to the hospital
     * @param {Date} arrivalDateTime expected arrival date of vials to final destination
    */
    async issue(ctx, orderID, storageID, hospitalID, batchNumber, numberOfVials, arrivalDateTime) {
        // get enrollement ID of the issuer
        let identity = ctx.clientIdentity;
        const enrollmentID = identity.getAttributeValue('hf.EnrollmentID');

        // Get today's date in format yyyy-mm-dd
        let today = new Date().toISOString().slice(0, 10);

        // create an instance of the order
        let paper = OrderDelivery.createInstance(orderID, enrollmentID, storageID, 
            hospitalID, batchNumber, numberOfVials, arrivalDateTime, today, today);

        // Smart contract, rather than paper, moves paper into IN_BORDER_CONTROL state
        paper.setInBorderControl();

        // Add the paper to the list of all similar order papers in the ledger world state
        await ctx.paperList.addPaper(paper);

        // Must return a serialized paper to caller of smart contract
        return paper;
    }

    /**
     * Initiate order delivery from border control to storage facility
     *
     * @param {Context} ctx the transaction context
     * @param {Integer} orderID order number for this issuer
    */
    async storageDelivery(ctx, orderID) {
        let paper = await ctx.paperList.getPaper(orderID);

        // Check order is in border control
        if (!paper.isInBorderControl()) {
            throw new Error('Delivery ' + orderID + ' is not in border control');
        }

        // Get today's date in format yyyy-mm-dd
        let today = new Date().toISOString().slice(0, 10);

        // Moves order into TO_STORAGE state and sets last updated date
        paper.setToStorage();
        paper.setUpdateDateTime(today);

        await ctx.paperList.updatePaper(paper);
        return paper;
    }


    /**
     * Acknowledge order arrival to storage facility
     *
     * @param {Context} ctx the transaction context
     * @param {Integer} orderID order number
    */
     async storageArrival(ctx, orderID) {
        let paper = await ctx.paperList.getPaper(orderID);

        // Check order is on its way to storage
        if (!paper.isToStorage()) {
            throw new Error('Delivery ' + orderID + ' is not on its way to storage');
        }

        // Get today's date in format yyyy-mm-dd
        let today = new Date().toISOString().slice(0, 10);

        // Moves order into IN_STORAGE state and sets last updated date
        paper.setInStorage();
        paper.setUpdateDateTime(today);

        await ctx.paperList.updatePaper(paper);
        return paper;
    }

    /**
     * Initiate order delivery from storage facility to hospital
     *
     * @param {Context} ctx the transaction context
     * @param {Integer} orderID order number
    */
     async hospitalDelivery(ctx, orderID) {
        let paper = await ctx.paperList.getPaper(orderID);

        // Check order is in storage
        if (!paper.isInStorage()) {
            throw new Error('Delivery ' + orderID + ' is not in storage');
        }

        // Get today's date in format yyyy-mm-dd
        let today = new Date().toISOString().slice(0, 10);

        // Moves order into TO_HOSPITAL state and sets last updated date
        paper.setToHospital();
        paper.setUpdateDateTime(today);

        await ctx.paperList.updatePaper(paper);
        return paper;
    }

    /**
     * Acknowledge order arrival to hospital
     *
     * @param {Context} ctx the transaction context
     * @param {Integer} orderID order number
    */
     async hospitalArrival(ctx, orderID) {
        let paper = await ctx.paperList.getPaper(orderID);

        // Check paper is on its way to hospital
        if (!paper.isToHospital()) {
            throw new Error('Delivery ' + orderID + ' is not on its way to hospital');
        }

        // Get today's date in format yyyy-mm-dd
        let today = new Date().toISOString().slice(0, 10);

        // Moves order into IN_HOSPITAL state and sets last updated date
        paper.setInHospital();
        paper.setUpdateDateTime(today);

        await ctx.paperList.updatePaper(paper);
        return paper;
    }
}

module.exports = SupplyChainContract;

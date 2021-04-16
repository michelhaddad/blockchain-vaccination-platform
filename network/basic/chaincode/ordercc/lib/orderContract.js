/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

const Order = require('./order.js');
const OrderList = require('./orderlist.js');

/**
 * A custom context provides easy access to list of all orders
 */
class OrderContext extends Context {

    constructor() {
        super();
        // All orders are held in a list of orders
        this.orderList = new OrderList(this);
    }

}

/**
 * Define donation order smart contract by extending Fabric Contract class
 *
 */
class OrderContract extends Contract {


    /**
     * Define a custom context for donation order
    */
    createContext() {
        return new OrderContext();
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
     * 
     * @param {Context} ctx 
     * @returns {String} All issued orders
     */
    async getAllOrders(ctx) {
        let identity = ctx.clientIdentity;
        const mspID = identity.getMSPID();
        // if (mspID !== "ImpactMSP") {
        //     throw new Error("User does not have the permission to invoke this function.")
        // }
        let query = {
            selector: {
                class: Order.getClass()
            }
        }
        query = JSON.stringify(query);
        const results = await this.query(ctx, query);
        return results;
    }

    /**
     * 
     * @param {Context} ctx the transaction context
     * @param {Number} orderID the order's ID
     * @param {String} manufacturer the targeted manufacturer
     * @param {String} destination target destination
     * @param {Number} vialsAmount number of vials requested
     * @param {String} requestedArrivalDate requested arrival date
     * @returns {Order}
     */
    async issue(ctx, orderID, manufacturer, destination, vialsAmount, requestedArrivalDate) {
        let identity = ctx.clientIdentity;
        const mspID = identity.getMSPID();
        if (mspID !== "ImpactMSP") {
            throw new Error("User does not have the permission to invoke this function.")
        }
        const enrollmentID = identity.getAttributeValue('hf.EnrollmentID');

        // Get today's date in format yyyy-mm-dd
        let today = new Date().toISOString().slice(0, 10);

        // create an instance of the order
        const order = Order.createInstance(enrollmentID, orderID, today, manufacturer, destination, vialsAmount, requestedArrivalDate);

        // Smart contract, rather than order, moves order into ISSUED state
        order.setRequested();

        // Add the order to the list of all similar orders in the ledger world state
        await ctx.orderList.addOrder(order);

        // Must return a serialized order to caller of smart contract
        return order;
    }

    async approve(ctx, orderID, batchNumber, expectedDeliveryDate) {
        let identity = ctx.clientIdentity;
        const mspID = identity.getMSPID();
        // if (mspID !== "ManufacturerMSP") {
        //     throw new Error("User does not have the permission to invoke this function.")
        // }

        const order = await ctx.orderList.getOrder(orderID);

        order.setApproved();
        order.setExpectedDeliveryDate(expectedDeliveryDate);
        order.setOrderBatchNumber(batchNumber);
        await ctx.orderList.updateOrder(order);
        return order;
    }

    async reject(ctx, orderID) {
        let identity = ctx.clientIdentity;
        const mspID = identity.getMSPID();
        // if (mspID !== "ManufacturerMSP") {
        //     throw new Error("User does not have the permission to invoke this function.")
        // }
        const order = await ctx.orderList.getOrder(orderID);
        if (!order) {
            throw new Error('Order ' + orderID + ' not found.')
        }

        order.setRejected();
        await ctx.orderList.updateOrder(order);
        return order;
    }

    async setOrderShipped(ctx, orderID) {
        const order = await ctx.orderList.getOrder(orderID);
        if (!order.isApproved()) {
            throw new Error('Order ' + orderID + ' not approved.')
        }

        order.setShipped();
        await ctx.orderList.updateOrder(order);
        return order;
    }

    async setOrderDelivered(ctx, orderID, deliveryDate) {
        const order = await ctx.orderList.getOrder(orderID);
        if (!order.isShipped()) {
            throw new Error('Order ' + orderID + ' not shipped yet.')
        }

        order.setDelivered();
        order.setActualDeliveryDate(deliveryDate);
        await ctx.orderList.updateOrder(order);
        return order;
    }

}

module.exports = OrderContract;

/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');
const OrderAccessControl = require('../ledger-api/OrderAccessControl.js');

const Order = require('./order.js');
const OrderList = require('./orderlist.js');
const initialOrders = require('../init-ledger/orders');

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

    beforeTransaction(ctx) {
        const ac = new OrderAccessControl();
        const fcn = ctx.stub.getFunctionAndParameters().fcn;
        if (!ac.checkAccess(ctx, fcn)) {
            throw new Error("User is not allowed to perform this operation.");
        }
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        for (const initialOrder of initialOrders) {
            let order = Order.createInstance('user2', initialOrder.orderID, initialOrder.date, 'Manufacturer', 'Border Control',
                initialOrder.vialsAmount, initialOrder.requestedArrivalDate);
            order.currentState = initialOrder.state;
            if (order.currentState >= 2) {
                order.setOrderBatchNumber(initialOrder.batchNumber);
                order.setExpectedDeliveryDate(initialOrder.expectedDeliveryDate);
                order.setFee(initialOrder.fee);
            }
            if (initialOrder.state == 4) {
                order.setActualDeliveryDate(initialOrder.deliveryDate);
            }
            await ctx.orderList.addOrder(order);
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
     * 
     * @param {Context} ctx 
     * @returns {String} All issued orders
     */
    async getAllOrders(ctx) {
<<<<<<< HEAD
=======
        let identity = ctx.clientIdentity;
        const mspID = identity.getMSPID();
        
>>>>>>> access_control
        let query = {
            selector: {
                class: Order.getClass()
            }
        }
        query = JSON.stringify(query);
        const results = await this.query(ctx, query);
        return results;
    }

    async getAllApprovedOrders(ctx) {
<<<<<<< HEAD
=======
        let identity = ctx.clientIdentity;
        const mspID = identity.getMSPID();
        
>>>>>>> access_control
        let query = {
            selector: {
                currentState: {"$gt": 1},
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

    async approve(ctx, orderID, batchNumber, expectedDeliveryDate, fee) {
        const order = await ctx.orderList.getOrder(orderID);
        order.setApproved();
        order.setExpectedDeliveryDate(expectedDeliveryDate);
        order.setOrderBatchNumber(batchNumber);
        order.setFee(fee);
        const crossContractResponse = await ctx.stub.invokeChaincode('donationcc', ['triggerMophPayment', order.fee.toString()], 'orderchannel');
        console.info(crossContractResponse);
        await ctx.orderList.updateOrder(order);
        return order;
    }

    async reject(ctx, orderID) {
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

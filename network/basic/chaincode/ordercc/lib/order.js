/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('../ledger-api/state.js');

// Enumerate order state values
const cpState = {
    REQUESTED: 1,
    SHIPPED: 2,
    APPROVED: 3,
    DELIVERED: 4,
    REJECTED: 5
};

/**
 * Order class extends State class
 * Class will be used by application and smart contract to define a vaccine order
 */
class Order extends State {

    constructor(obj) {
        super(Order.getClass(), obj.orderID);
        Object.assign(this, obj);
    }

    /**
     * Basic getters and setters
    */
    getIssuer() {
        return this.issuer;
    }

    setExpectedDeliveryDate(deliveryDate) {
        this.expectedDeliveryDate = deliveryDate;
    }

    getExpectedDeliveryDate() {
        return this.expectedDeliveryDate;
    }

    setActualDeliveryDate(deliveryDate) {
        this.actualDeliveryDate = deliveryDate;
    }

    setOrderBatchNumber(batchNumber) {
        this.batchNumber = batchNumber;
    }

    /**
     * Useful methods to encapsulate order states
     */
    setRequested() {
        this.currentState = cpState.REQUESTED;
    }

    setShipped() {
        this.currentState = cpState.SHIPPED;
    }

    setApproved() {
        this.currentState = cpState.APPROVED;
    }

    setDelivered() {
        this.currentState = cpState.DELIVERED;
    }

    setRejected() {
        this.currentState = cpState.REJECTED;
    }

    isRequested() {
        return this.currentState === cpState.REQUESTED;
    }
    
    isApproved() {
        return this.currentState === cpState.APPROVED;
    }

    isRejected() {
        return this.currentState === cpState.REJECTED;
    }

    isShipped() {
        return this.currentState === cpState.SHIPPED;
    }

    isDelivered() {
        return this.currentState === cpState.DELIVERED;
    }

    static fromBuffer(buffer) {
        return Order.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to order
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Order);
    }

    /**
     * Factory method to create an order object
     */
    static createInstance(issuer, orderID, issueDateTime, manufacturer, destination, vialsAmount, requestedArrivalDate) {
        return new Order({ issuer, orderID, issueDateTime, manufacturer, destination, vialsAmount, requestedArrivalDate });
    }

    static getClass() {
        return 'org.papernet.order';
    }
}

module.exports = Order;

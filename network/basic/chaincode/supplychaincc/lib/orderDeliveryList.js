/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');

const OrderDelivery = require('./orderDelivery.js');

class OrderDeliveryList extends StateList {

    constructor(ctx) {
        super(ctx, OrderDelivery.getClass());
        this.use(OrderDelivery);
    }

    async addDelivery(delivery) {
        return this.addState(delivery);
    }

    async getDelivery(deliveryKey) {
        return this.getState(deliveryKey);
    }

    async updateDelivery(delivery) {
        return this.updateState(delivery);
    }
}


module.exports = OrderDeliveryList;

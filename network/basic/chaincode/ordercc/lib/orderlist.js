/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');

const Order = require('./order.js');

class OrderList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.papernet.orderlist');
        this.use(Order);
    }

    async addOrder(order) {
        return this.addState(order);
    }

    async getOrder(orderID) {
        return this.getState(orderID);
    }

    async updateOrder(order) {
        return this.updateState(order);
    }
}


module.exports = OrderList;
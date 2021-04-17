/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('../ledger-api/statelist.js');

const MophBalance = require('./mophBalance.js');

class BalanceList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.vaccinenet.mophBalance');
        this.use(MophBalance);
    }

    async addBalanceObject(balanceObject) {
        return this.addState(balanceObject);
    }

    async getBalanceObject() {
        return this.getState('MOPH');
    }

    async updateBalanceObject(balanceObject) {
        return this.updateState(balanceObject);
    }
}


module.exports = BalanceList;
'use strict';

class TransactionModel {
    constructor(txFunction, key, previousKey, user) {
        this.txFunction = txFunction;
        this.key = key;
        this.user = user;
        this.previousKey = previousKey;
    }
}

module.exports = TransactionModel;
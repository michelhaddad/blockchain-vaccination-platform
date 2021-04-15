'use strict';

const { SubmitTransaction, EvaluateTransaction } = require('./Transaction')

class TransactionManager {
    constructor(user, channel) {
        this.user = user;
        this.channel = channel;
    }

    getSubmitTransactionInstance(txContract, txFunction, ...args) {
        return new SubmitTransaction(this.user, this.channel, txContract, txFunction, ...args);
    }

    getEvaluateTransactionInstance(txContract, txFunction, ...args) {
        return new EvaluateTransaction(this.user, this.channel, txContract, txFunction, ...args);
    }  
}

module.exports = TransactionManager;
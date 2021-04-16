'use strict';

const { submitTransaction, evaluateTransaction } = require('./../services/transactionHelpers')

class Transaction {
    constructor(user, channel, contract, txFunction, ...args) {
        this.txFunction = txFunction;
        this.channel = channel;
        this.user = user;
        this.args = args;
        this.contract = contract;
    }

    send() {
        throw new Error("Can't call send method on abstract class!");
    }
}

class SubmitTransaction extends Transaction {

    send() {
        return submitTransaction(this);
    }
}

class EvaluateTransaction extends Transaction {

    send() {
        return evaluateTransaction(this);
    }
}

module.exports = {
    SubmitTransaction,
    EvaluateTransaction
}
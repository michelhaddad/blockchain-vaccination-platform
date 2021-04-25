/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('../ledger-api/state.js');

/**
 * MophBalance class extends State class
 * Class will be used by application and smart contract to define a paper
 */
class MophBalance extends State {

    constructor(obj) {
        super(MophBalance.getClass(), 'MOPH');
        Object.assign(this, obj);
    }

    /**
     * Basic Operations
    */

    redeem(amount) {
        if (!this.redeemedAmount) {
            this.redeemedAmount = parseInt(amount);
        } else {
            this.redeemedAmount += parseInt(amount);
        }
    }

    pay(amount) {
        if (!this.payedAmount) {
            if (amount > this.redeemedAmount) {
                throw new Error("MOPH does not have enough funds!");
            }
            this.payedAmount = parseInt(amount);
        } else {
            if (this.payedAmount + parseInt(amount) > this.redeemedAmount) {
                throw new Error("MOPH does not have enough funds!");
            }
            this.payedAmount += parseInt(amount);
        }
    }

    static fromBuffer(buffer) {
        return MophBalance.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to donation paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, MophBalance);
    }

    /**
     * Factory method to create a donation paper object
     */
    static createInstance(redeemedAmount = 0, payedAmount = 0) {
        return new MophBalance({payedAmount: payedAmount, redeemedAmount: redeemedAmount});
    }

    static getClass() {
        return 'org.vaccinenet.mophBalance';
    }
}

module.exports = MophBalance;

/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('../ledger-api/state.js');

// Enumerate donation paper state values
const cpState = {
    ISSUED: 1,
    REDEEMED: 2
};

/**
 * DonationPaper class extends State class
 * Class will be used by application and smart contract to define a paper
 */
class DonationPaper extends State {

    constructor(obj) {
        super(DonationPaper.getClass(), [obj.issuer, obj.paperNumber]);
        Object.assign(this, obj);
    }

    /**
     * Basic getters and setters
    */
    getIssuer() {
        return this.issuer;
    }

    setIssuer(newIssuer) {
        this.issuer = newIssuer;
    }

    /**
     * Useful methods to encapsulate donation paper states
     */
    setIssued() {
        this.currentState = cpState.ISSUED;
    }

    setRedeemed() {
        this.currentState = cpState.REDEEMED;
    }

    /**
     * 
     * @param {String} date time paper was redeemed 
     */
    setRedeemedDate(date) {
        this.redeemDate = date;
    }

    isIssued() {
        return this.currentState === cpState.ISSUED;
    }

    isRedeemed() {
        return this.currentState === cpState.REDEEMED;
    }

    static fromBuffer(buffer) {
        return DonationPaper.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to donation paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, DonationPaper);
    }

    /**
     * Factory method to create a donation paper object
     */
    static createInstance(issuer, paperNumber, issueDateTime, amount) {
        return new DonationPaper({ issuer, paperNumber, issueDateTime, amount });
    }

    static getClass() {
        return 'org.papernet.donationpaper';
    }
}

module.exports = DonationPaper;

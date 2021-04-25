/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');
const DonationAccessControl = require('../ledger-api/DonationAccessControl.js');
const BalanceList = require('./balancelist.js');

// PaperNet specifc classes
const DonationPaper = require('./donationPaper.js');
const MophBalance = require('./mophBalance.js');
const PaperList = require('./paperlist.js');
const initialDonations = require('../init-ledger/donations');
const initialOrders = require('../init-ledger/orders');

/**
 * A custom context provides easy access to list of all donation papers
 */
class DonationPaperContext extends Context {

    constructor() {
        super();
        // All papers are held in a list of papers
        this.paperList = new PaperList(this);
        this.balanceList = new BalanceList(this);
    }

}

/**
 * Define donation paper smart contract by extending Fabric Contract class
 *
 */
class DonationPaperContract extends Contract {


    /**
     * Define a custom context for donation paper
    */
    createContext() {
        return new DonationPaperContext();
    }

    beforeTransaction(ctx) {
        const ac = new DonationAccessControl();
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
        let mophRedeemedAmount = 0;
        let mophPayedAmount = 0;
        for (const donation of initialDonations) {
            if (donation.state == 2) {
                mophRedeemedAmount += parseInt(donation.amount);
            }
            let paper = DonationPaper.createInstance('user7', donation.paperID, donation.date, donation.amount);
            paper.currentState = donation.state;
            await ctx.paperList.addPaper(paper);
        }
        for (const initialOrder of initialOrders) {
            if (initialOrder.state >= 2) {
                mophPayedAmount += parseInt(initialOrder.fee);
            }
        }
        const mophBalance = MophBalance.createInstance(mophRedeemedAmount, mophPayedAmount);
        await ctx.balanceList.addBalanceObject(mophBalance);
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

    async indexDonations(ctx) {
        let query = {
            selector: {
                class: DonationPaper.getClass()
            }
        }
        query = JSON.stringify(query);
        const results = await this.query(ctx, query);
        return results;
    }


    async indexUserDonations(ctx, user = '') {
        const enrollmentID = user ? user : ctx.clientIdentity.getAttributeValue('hf.EnrollmentID');
        const query = `{"selector": {"issuer": "${enrollmentID}"}}`;
        const results = await this.query(ctx, query);
        return results;
    }

    async getMophBalance(ctx) {
        const mophBalance = await ctx.balanceList.getBalanceObject();
        return mophBalance;
    }

    async triggerMophPayment(ctx, amount) {
        const mophBalance = await ctx.balanceList.getBalanceObject();
        mophBalance.pay(amount);
        await ctx.balanceList.updateBalanceObject(mophBalance);
        return mophBalance;
    }

    /**
     * Issue donation paper
     *
     * @param {Context} ctx the transaction context
     * @param {Integer} paperNumber paper number for this issuer
     * @param {Integer} amount amount of donation
    */
    async issue(ctx, paperID, amount) {
        // get enrollement ID of the issuer
        let identity = ctx.clientIdentity;
        const enrollmentID = identity.getAttributeValue('hf.EnrollmentID');

        // Get today's date in format yyyy-mm-dd
        let today = new Date().toISOString().slice(0, 10);

        // create an instance of the paper
        let paper = DonationPaper.createInstance(enrollmentID, paperID, today, amount);

        // Smart contract, rather than paper, moves paper into ISSUED state
        paper.setIssued();

        // Add the paper to the list of all similar donation papers in the ledger world state
        await ctx.paperList.addPaper(paper);

        // Must return a serialized paper to caller of smart contract
        return paper;
    }

    /**
     * Redeem donation paper
     *
     * @param {Context} ctx the transaction context
     * @param {String} issuer donation paper issuer
     * @param {Integer} paperNumber paper number for this issuer
     * @param {String} redeemDate time paper was redeemed
    */
    async redeem(ctx, paperID) {
        // get enrollement ID of the issuer
        let identity = ctx.clientIdentity;
        const enrollmentID = identity.getAttributeValue('hf.EnrollmentID');

        let paper = await ctx.paperList.getPaper(paperID);

        // Check paper is not REDEEMED
        if (paper.isRedeemed()) {
            throw new Error('Paper ' + paperID + ' is already redeemed');
        }

        // Get today's date in format yyyy-mm-dd
        let today = new Date().toISOString().slice(0, 10);

        paper.setRedeemed();
        paper.setRedeemedDate(today);
        paper.setRedeemer(enrollmentID);

        const mophBalance = await ctx.balanceList.getBalanceObject();
        mophBalance.redeem(paper.amount);
        await ctx.balanceList.updateBalanceObject(mophBalance);
        await ctx.paperList.updatePaper(paper);
        return paper;
    }

}

module.exports = DonationPaperContract;

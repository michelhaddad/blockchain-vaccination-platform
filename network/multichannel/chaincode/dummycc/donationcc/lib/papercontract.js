/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// PaperNet specifc classes
const DonationPaper = require('./donationPaper.js');
const PaperList = require('./paperlist.js');

/**
 * A custom context provides easy access to list of all donation papers
 */
class DonationPaperContext extends Context {

    constructor() {
        super();
        // All papers are held in a list of papers
        this.paperList = new PaperList(this);
    }

}

/**
 * Define donation paper smart contract by extending Fabric Contract class
 *
 */
class DonationPaperContract extends Contract {

    constructor() {
        // Unique name when multiple contracts per chaincode file
        super('org.papernet.donationpaper');
    }

    /**
     * Define a custom context for donation paper
    */
    createContext() {
        return new DonationPaperContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the contract');
    }

    /**
     * Issue donation paper
     *
     * @param {Context} ctx the transaction context
     * @param {String} issuer donation paper issuer
     * @param {Integer} paperNumber paper number for this issuer
     * @param {String} issueDateTime paper issue date
     * @param {Integer} amount amount of donation
    */
    async issue(ctx, issuer, paperNumber, issueDateTime, amount) {

        // create an instance of the paper
        let paper = DonationPaper.createInstance(issuer, paperNumber, issueDateTime, amount);

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
     * @param {String} redeemDateTime time paper was redeemed
    */
    async redeem(ctx, issuer, paperNumber) {

        let paperKey = DonationPaper.makeKey([issuer, paperNumber]);

        let paper = await ctx.paperList.getPaper(paperKey);

        // Check paper is not REDEEMED
        if (paper.isRedeemed()) {
            throw new Error('Paper ' + issuer + paperNumber + ' already redeemed');
        }

        paper.setRedeemed();

        await ctx.paperList.updatePaper(paper);
        return paper;
    }

}

module.exports = DonationPaperContract;

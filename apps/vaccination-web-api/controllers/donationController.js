'use strict';
const DonationPaper = require('../../../network/basic/chaincode/donationcc/lib/donationPaper');
const TransactionManager = require('./../models/TransactionManager');
const { generateUID } = require('./../utils/idHelper')

exports.getAllDonations = async function (req, res) {
    try {
        const txManager = new TransactionManager('user1', 'mychannel');
        const submitTx = txManager.getEvaluateTransactionInstance('donationcc', 'indexDonations');
        let response = await submitTx.send();
        response = JSON.parse(JSON.parse(response));
        res.status(200).send({response});

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserDonations = async function (req, res) {
    try {
        let { user } = req.query;
        user = user ? user : '';
        const txManager = new TransactionManager('user1', 'mychannel');
        const submitTx = txManager.getEvaluateTransactionInstance('donationcc', 'indexUserDonations', user);
        let response = await submitTx.send();
        response = JSON.parse(JSON.parse(response));
        res.status(200).send({response});

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.donate = async function (req, res) {
    try {
        const { amount } = req.query;
        if (!amount) {
            return res.status(400).json({ message: 'amount not specified' });
        }

        const txManager = new TransactionManager('user1', 'mychannel');
        const submitTx = txManager.getSubmitTransactionInstance('donationcc', 'issue', generateUID(), amount);
        const response = await submitTx.send();
        console.log(DonationPaper.fromBuffer(response));
        res.status(204).send({});

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.redeem = async function (req, res) {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ message: 'id not specified' });
        }

        const txManager = new TransactionManager('user1', 'mychannel');
        const submitTx = txManager.getSubmitTransactionInstance('donationcc', 'redeem', id);
        const response = await submitTx.send();
        console.log(DonationPaper.fromBuffer(response));
        res.status(204).send({});

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

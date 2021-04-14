'use strict';
const invokeContract= require('../services/invoke-contract.middleware');
const TransactionModel = require('../models/transaction.model')
exports.getDonationsPerDonor = function(req, res) {
};

exports.getDonations= function(req, res) {
};

exports.donate = function(req, res) {
    var tx= new TransactionModel('issue', 5, 1000, 'user1'); //il faut se debarasser des hard coded values
    
    invokeContract(tx, "donationcc", "mychannel").then(()=> res.status(204).send({}));
};

exports.redeemDonation = function(req, res) {
};

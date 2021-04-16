'use strict';

const Order = require("../../../network/basic/chaincode/ordercc/lib/order");
const TransactionManager = require("../models/TransactionManager");
const { generateUID } = require('./../utils/idHelper');

exports.getAllOrders = async function (req, res) {
    try {
        const txManager = new TransactionManager('user1', 'mychannel');
        const submitTx = txManager.getEvaluateTransactionInstance('ordercc', 'getAllOrders');
        let response = await submitTx.send();
        response = JSON.parse(JSON.parse(response));
        res.status(200).send({response});

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.issueOrder = async function (req, res) {
    try {
        const { manufacturer, destination, vialsAmount, requestedArrivalDate } = req.body;
        if (!(manufacturer && destination && vialsAmount && requestedArrivalDate)) {
            return res.status(400).json({ message: 'Missing parameter(s)' });
        }
        const txManager = new TransactionManager('user1', 'mychannel');
        const submitTx =
            txManager.getSubmitTransactionInstance('ordercc', 'issue', generateUID(),manufacturer, destination, vialsAmount, requestedArrivalDate);
        let response = await submitTx.send();
        console.log(Order.fromBuffer(response));
        res.status(204).send({}); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.approveOrder = async function (req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Missing id' });
        }
        const { batchNumber, expectedDeliveryDate } = req.body;
        if (!(batchNumber && expectedDeliveryDate)) {
            return res.status(400).json({ message: 'Missing parameter(s)' });
        }
        const txManager = new TransactionManager('user1', 'mychannel');
        const submitTx =
            txManager.getSubmitTransactionInstance('ordercc', 'approve', id, batchNumber, expectedDeliveryDate);
        let response = await submitTx.send();
        console.log(Order.fromBuffer(response));
        res.status(204).send({}); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const orderAction = (action) => async function (req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Missing id' });
        }
        const txManager = new TransactionManager('user1', 'mychannel');
        const submitTx =
            txManager.getSubmitTransactionInstance('ordercc', action, id);
        let response = await submitTx.send();
        console.log(Order.fromBuffer(response));
        res.status(204).send({}); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.rejectOrder = orderAction('reject');

exports.setOrderShipped = orderAction('setOrderShipped');

exports.setOrderDelivered = orderAction('setOrderDelivered');




'use strict';

const OrderDelivery = require('../../../network/basic/chaincode/supplychaincc/lib/orderDelivery');
const TransactionManager = require('./../models/TransactionManager');
const { generateUID } = require('./../utils/idHelper');

exports.getAllDeliveries = async function (req, res) {
    try {
        const txManager = new TransactionManager('user1', 'distributionchannel');
        const submitTx = txManager.getEvaluateTransactionInstance('supplychaincc', 'indexOrderDelivery');
        let response = await submitTx.send();
        response = JSON.parse(JSON.parse(response));
        res.status(200).send({response});

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllOrderDeliveries = async function (req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Missing id' });
        }
        const txManager = new TransactionManager('user1', 'distributionchannel');
        const submitTx = txManager.getEvaluateTransactionInstance('supplychaincc', 'getAllOrderDeliveries', id);
        let response = await submitTx.send();
        response = JSON.parse(JSON.parse(response));
        res.status(200).send({response});

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.issueOrderDelivery = async function (req, res) {
    try {
        const { orderID, storageID, hospitalID, batchNumber, numberOfVials, arrivalDateTime } = req.body;
        if (!(orderID && storageID && hospitalID && batchNumber && numberOfVials && arrivalDateTime)) {
            return res.status(400).json({ message: 'Missing parameter(s)' });
        }
        const txManager = new TransactionManager('user1', 'distributionchannel');
        const submitTx =
            txManager.getSubmitTransactionInstance('supplychaincc', 'issue', generateUID(), orderID, storageID, hospitalID, batchNumber, numberOfVials, arrivalDateTime);
        let response = await submitTx.send();
        console.log(OrderDelivery.fromBuffer(response));
        res.status(204).send({}); 

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.setStorageDelivery = async function (req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Missing id' });
        }
        const txManager = new TransactionManager('user1', 'distributionchannel');
        const submitTx =
            txManager.getSubmitTransactionInstance('supplychaincc', 'storageDelivery', id);
        let response = await submitTx.send();
        console.log(OrderDelivery.fromBuffer(response));
        res.status(204).send({}); 

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.setStorageArrival = async function (req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Missing id' });
        }
        const txManager = new TransactionManager('user1', 'distributionchannel');
        const submitTx =
            txManager.getSubmitTransactionInstance('supplychaincc', 'storageArrival', id);
        let response = await submitTx.send();
        console.log(OrderDelivery.fromBuffer(response));
        res.status(204).send({}); 

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.setHospitalDelivery = async function (req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Missing id' });
        }
        const txManager = new TransactionManager('user1', 'distributionchannel');
        const submitTx =
            txManager.getSubmitTransactionInstance('supplychaincc', 'hospitalDelivery', id);
        let response = await submitTx.send();
        console.log(OrderDelivery.fromBuffer(response));
        res.status(204).send({}); 

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.setHospitalArrival = async function (req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Missing id' });
        }
        const txManager = new TransactionManager('user1', 'distributionchannel');
        const submitTx =
            txManager.getSubmitTransactionInstance('supplychaincc', 'hospitalArrival', id);
        let response = await submitTx.send();
        console.log(OrderDelivery.fromBuffer(response));
        res.status(204).send({}); 

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

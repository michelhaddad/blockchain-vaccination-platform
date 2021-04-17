'use strict';

const OrderDelivery = require('../../../network/basic/chaincode/supplychaincc/lib/orderDelivery');
const TransactionManager = require('./../models/TransactionManager');
const { generateUID } = require('./../utils/idHelper');

exports.getAllDeliveries = async function (req, res) {
    try {
        const txManager = new TransactionManager(req.user.enrollmentID, 'distributionchannel');
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
        const txManager = new TransactionManager(req.user.enrollmentID, 'distributionchannel');
        const submitTx = txManager.getEvaluateTransactionInstance('supplychaincc', 'getAllOrderDeliveries', id);
        let response = await submitTx.send();
        response = JSON.parse(JSON.parse(response));
        res.status(200).send({response});

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.VaccinesOrgDistribution = async function (req, res) {
    try {
        const txManager = new TransactionManager(req.user.enrollmentID, 'orderchannel');
        const submitTx = txManager.getEvaluateTransactionInstance('ordercc', 'getAllApprovedOrders');
        let response = await submitTx.send();
        response = JSON.parse(JSON.parse(response));
        let totalOrderedVials = 0;
        let vialsInBorderControl = 0;
        let vialsInStorage = 0;
        let vialsInHospital = 0;
        
        for (const order of response){
            totalOrderedVials += parseInt(order['Record']['vialsAmount']);
        }

        const txManager2 = new TransactionManager(req.user.enrollmentID, 'distributionchannel');
        const submitTx2 = txManager2.getEvaluateTransactionInstance('supplychaincc', 'indexOrderDelivery');
        response = await submitTx2.send();
        response = JSON.parse(JSON.parse(response));

        for (const delivery of response){
            const currentState = delivery['Record']['currentState'];
            const numberOfVials = parseInt(delivery['Record']['numberOfVials']);
            console.log(numberOfVials)
            if (currentState < 3) {
                vialsInBorderControl += numberOfVials;
            } else if (currentState < 5) {
                vialsInStorage += numberOfVials;
            } else {
                vialsInHospital += numberOfVials;
            }
        }

        const watingForManufacturer = (totalOrderedVials - vialsInHospital - vialsInStorage - vialsInBorderControl) * 4;

        const result = [
            {
                name: 'Border Control',
                value: vialsInBorderControl * 4
            },
            {
                name: 'Storage',
                value: vialsInStorage * 4
            },
            {
                name: 'Hospital',
                value: vialsInHospital * 4
            },
            {
                name: 'Waiting Manufacturer Delivery',
                value: watingForManufacturer
            }
        ]

        res.status(200).send(result);

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
        const txManager = new TransactionManager(req.user.enrollmentID, 'distributionchannel');
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
        const txManager = new TransactionManager(req.user.enrollmentID, 'distributionchannel');
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
        const txManager = new TransactionManager(req.user.enrollmentID, 'distributionchannel');
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
        const txManager = new TransactionManager(req.user.enrollmentID, 'distributionchannel');
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
        const txManager = new TransactionManager(req.user.enrollmentID, 'distributionchannel');
        const submitTx =
            txManager.getSubmitTransactionInstance('supplychaincc', 'hospitalArrival', id);
        let response = await submitTx.send();
        console.log(OrderDelivery.fromBuffer(response));
        res.status(204).send({}); 

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

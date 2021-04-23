'use strict';

const Order = require("../../../network/basic/chaincode/ordercc/lib/order");
const TransactionManager = require("../models/TransactionManager");
const { generateUID } = require('./../utils/idHelper');

exports.getAllOrders = async function (req, res) {
    try {
        const txManager = new TransactionManager('user1', 'orderchannel');
        const submitTx = txManager.getEvaluateTransactionInstance('ordercc', 'getAllOrders');
        let response = await submitTx.send();
        response = JSON.parse(JSON.parse(response));
        res.status(200).send({response});

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getManufacturerDosesData = async function (req, res) {
    try {
        const result = {};

        const txManager = new TransactionManager('user1', 'orderchannel');
        const evalTx = txManager.getEvaluateTransactionInstance('ordercc', 'getAllApprovedOrders');
        let response = await evalTx.send();
        response = JSON.parse(JSON.parse(response));
        for (const order of response){
            const manufacturer = order['Record']['manufacturer'];
            if (!result[manufacturer]) {
                result[manufacturer] = {
                    ordered: 0,
                    administered: 0,
                    remainingInCountry: 0
                }
            }
            
            const vialsAmount = parseInt(order['Record']['vialsAmount']);
            if(order['Record']['currentState']==4){
                result[manufacturer].remainingInCountry += vialsAmount*4;
            }
            result[manufacturer].ordered += vialsAmount * 4;
        }

        const txManager2 = new TransactionManager('user1', 'distributionchannel');
        const evalTx2 = txManager2.getEvaluateTransactionInstance('hospitalcc', 'indexHospitals');

        let response2 = await evalTx2.send();
        response2 = JSON.parse(JSON.parse(response2));
        for (const hospital of response2){
            const vaccineDataPerBatch = hospital['Record']['vaccineDataPerBatch'];
            for (const [batch, value] of Object.entries(vaccineDataPerBatch)) {
                const administeredDoses = value['dosesDelivered'] - value['remainingDoses'];
                result[value['manufacturer']].administered += administeredDoses;
                result[value['manufacturer']].remainingInCountry -=administeredDoses;
            }
        }

        res.status(200).send(result);

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
        const txManager = new TransactionManager('user1', 'orderchannel');
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
        const { batchNumber, expectedDeliveryDate, fee } = req.body;
        if (!(batchNumber && expectedDeliveryDate && fee)) {
            return res.status(400).json({ message: 'Missing parameter(s)' });
        }
        const txManager = new TransactionManager('user1', 'orderchannel');
        const submitTx =
            txManager.getSubmitTransactionInstance('ordercc', 'approve', id, batchNumber, expectedDeliveryDate, fee);
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
        const txManager = new TransactionManager('user1', 'orderchannel');
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




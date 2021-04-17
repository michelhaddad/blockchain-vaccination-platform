'use strict';

const Hospital = require("../../../network/basic/chaincode/hospitalcc/lib/hospital");
const TransactionManager = require("../models/TransactionManager");
const { generateUID } = require('./../utils/idHelper');

exports.getAllHospitals = async function (req, res) {
    try {
        const txManager = new TransactionManager(req.user.enrollmentID, 'distributionchannel');
        const submitTx = txManager.getEvaluateTransactionInstance('hospitalcc', 'indexHospitals');
        let response = await submitTx.send();
        response = JSON.parse(JSON.parse(response));
        res.status(200).send({response});

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getDosesData = async function (req, res) {
    try {
        const txManager = new TransactionManager(req.user.enrollmentID, 'distributionchannel');
        const submitTx = txManager.getEvaluateTransactionInstance('hospitalcc', 'indexHospitals');
        let response = await submitTx.send();
        response = JSON.parse(JSON.parse(response));

        const resultArray = [];
        for (const hospital of response){
            const name = hospital['Record']['name'];
            const remainingDoses = hospital['Record']['totalRemainingDoses'];
            resultArray.push({
                name,
                remainingDoses
            })
        }

        res.status(200).send(resultArray);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getDailyAdministrations = async function (req, res) {
    try {
        const txManager = new TransactionManager(req.user.enrollmentID, 'distributionchannel');
        const submitTx = txManager.getEvaluateTransactionInstance('hospitalcc', 'indexHospitals');
        let response = await submitTx.send();
        response = JSON.parse(JSON.parse(response));
        
        const resultArray = [];
        for (const hospital of response){
            const series = [];
            const name = hospital['Record']['name'];
            const dailyAdministeredDoses = hospital['Record']['dailyAdministeredDoses'];
            

            for (const [date, value] of Object.entries(dailyAdministeredDoses)) {
                let doses = 0;
                for (const [batch, doseCount] of Object.entries(value)) {
                    doses += doseCount;
                }
                series.push({
                    value: doses,
                    name: date
                });
            }
            resultArray.push({
                name,
                series
            });

            res.status(200).send(resultArray);
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deliverVials = async function (req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Missing id' });
        }
        const { batchID, vials, manufacturer } = req.body;
        if (!(batchID && vials && manufacturer)) {
            return res.status(400).json({ message: 'Missing parameter(s)' });
        }
        const txManager = new TransactionManager(req.user.enrollmentID, 'distributionchannel');
        const submitTx = txManager.getSubmitTransactionInstance('hospitalcc', 'deliverVials', id, batchID, vials, manufacturer);
        let response = await submitTx.send();
        console.log(Hospital.fromBuffer(response));
        res.status(204).send({}); 

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.inoculatePatients = async function (req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Missing id' });
        }
        const { batchID, patientCount } = req.body;
        if (!(batchID && patientCount)) {
            return res.status(400).json({ message: 'Missing parameter(s)' });
        }
        const txManager = new TransactionManager(req.user.enrollmentID, 'distributionchannel');
        const submitTx = txManager.getSubmitTransactionInstance('hospitalcc', 'inoculatePatients', id, batchID, patientCount);
        let response = await submitTx.send();
        console.log(Hospital.fromBuffer(response));
        res.status(204).send({}); 

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


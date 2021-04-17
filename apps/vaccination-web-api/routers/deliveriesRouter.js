const express = require('express');
const router = express.Router();
const supplychainController = require('../controllers/supplychainController')

const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.get('/', supplychainController.getAllDeliveries);

router.post('/', supplychainController.issueOrderDelivery);

router.put('/:id/settostorage', supplychainController.setStorageDelivery);

router.put('/:id/setinstorage', supplychainController.setStorageArrival);

router.put('/:id/settohospital', supplychainController.setHospitalDelivery);

router.put('/:id/setinhospital', supplychainController.setHospitalArrival);

module.exports = router;
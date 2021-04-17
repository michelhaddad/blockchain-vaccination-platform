const express = require('express');
const router = express.Router();

const donationsController = require('../controllers/donationController');
const orderController = require('../controllers/orderController');
const deliveriesController = require('../controllers/supplychainController');

const bodyParser = require('body-parser');
const { verifyUser } = require('../database/authenticate');

router.use(bodyParser.json());

router.get('/MOPH/balance', verifyUser, donationsController.getMophBalance);

router.get('/dosesdatapermanufacturer', verifyUser, orderController.getManufacturerDosesData);

router.get('/vaccineorgdistribution', verifyUser, deliveriesController.VaccinesOrgDistribution);

module.exports = router;
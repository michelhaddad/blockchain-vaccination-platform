const express = require('express');
const router = express.Router();

const donationsController = require('../controllers/donationController');
const orderController = require('../controllers/orderController');
const deliveriesController = require('../controllers/supplychainController');
const userController = require('../controllers/userController');

const bodyParser = require('body-parser');
const { verifyUser, verifyAdmin } = require('../database/authenticate');

router.use(bodyParser.json());

router.get('/users', verifyUser, verifyAdmin, userController.getUsers);

router.get('/MOPH/balance', verifyUser, donationsController.getMophBalance);

router.get('/dosesdatapermanufacturer', verifyUser, orderController.getManufacturerDosesData);

router.get('/vaccineorgdistribution', verifyUser, deliveriesController.VaccinesOrgDistribution);

module.exports = router;